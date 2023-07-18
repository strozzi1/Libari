import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import List from "../models/List.js"
import {uploadFile, sendSQSMessage} from "../lib/aws.js"
import {OAuth2Client} from 'google-auth-library';


const cloudFrontBaseURL = process.env.AWS_CLOUDFRONT_BASE_URL;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client();

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

}
/* REGISTER USER */
export const register = async (req, res) => {
    
    if(req.body === {}) return res.status(401).json({message: "Invalid request, data provided"})
    if (!req.body.password || !req.body.email) return res.status(401).json("No password or email provided");
    try {
        const {
            username,
            email,
            password,
            location,
            bio,
            role
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        let image = ''
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            location,
            bio,
            role
        });
        if(req.file){
            //Set image name to be the userID, there can only be one image per user
            let fileName = newUser._id.toString()
            await uploadFile(req.file.buffer, fileName, req.file.mimetype)
            image = `${cloudFrontBaseURL}/${fileName}`
        
            var params = {
                MessageAttributes: {
                    UserId: {
                        DataType: "String",
                        StringValue: fileName
                    },
                    Username: {
                        DataType: "String",
                        StringValue: newUser.username
                    },
                    ImageURL: {
                        DataType: "String",
                        StringValue: image
                    }
                },
                MessageBody: "Information to be sent to image resize worker",
                QueueUrl: process.env.AWS_SQS_URL
            };
            sendSQSMessage(params)
            //send image id to golang resizer
        }
        //console.log(newUser._id.toString())
        newUser.image = image
        const savedUser = await newUser.save();
        const newList = new List({
            userId: savedUser._id,
            username
        });
        
        const token = jwt.sign({ id: savedUser._id, role: savedUser.role}, process.env.JWT_SECRET, {expiresIn: '24h' });
        const savedList = await newList.save();
        //remove password property before sending object
        savedUser.password = undefined
        res.status(201).json({user: savedUser, list: savedList, token: token});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


/* LOGGING IN */
export const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) return res.status(401).json({message: "No credential provided"});
    try {
        
        const user = await User.findOne({email: email}).select('+password');
        if(!user) {
            return res.status(400).json({message: "User doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        console.log(password, user.password, isMatch);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const list = await List.findOne({userId: user._id}).populate({
            path: "entries",
            populate: { 
                path: "book"
            }
        });

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '24h' });
        //remove property before sending user object
        user.password = undefined;

        res.status(200).json({token, user, list});
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

//TODO: make more secure
export const googleLogin = async (req, res) => {
    const {credential} = req.body
    if (!credential) return res.status(401).json({message: "No credential provided"});
    try{
        
        //const decoded = jwt.decode(credential);
        //console.log("decoded: ", decoded)
        //const { name, picture, sub, email} = decoded;
        //let sub, email;
        const decoded = await verify(credential).catch(console.error)
        const { name, picture, sub, email} = decoded;
        const user = await User.findOne({email: email, googleId: sub});
        if(!user) {
            return res.status(400).json({message: "User doesn't exist"});
        }

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '24h' });

        const list = await List.findOne({userId: user._id}).populate({
            path: "entries",
            populate: { 
                path: "book"
            }
        });

        res.status(200).json({token, user, list: list.entries});
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    
}

export const googleRegister = async (req, res) => {
    const {credential} = req.body
    if (!credential) return res.status(401).json({message: "No credential provided"});
    try{
        
        const decoded = await verify(credential).catch(console.error)
        const { name, picture, sub, email} = decoded;
        const salt = await bcrypt.genSalt();
        //temporary password, can be changed by the user
        const passwordHash = await bcrypt.hash(sub, salt);

        const newUser = new User({
            username: sub,
            email: email,
            googleId: sub,
            password: passwordHash,
            image: picture,
            location: "",
            bio: "No Bio provided",
            role: "user"
        });

        const savedUser = await newUser.save();
        savedUser.password = undefined;
        savedUser.googleId = undefined;
        const newList = new List({
            userId: savedUser._id,
            username: sub
        });
        const savedList = await newList.save();

        const token = jwt.sign({ id: savedUser._id, role: savedUser.role}, process.env.JWT_SECRET, {expiresIn: '24h' });

        res.status(201).json({user: savedUser, list: savedList.entries, token});
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

