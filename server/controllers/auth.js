import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import List from "../models/List.js"
import {uploadFile, sendSQSMessage} from "../lib/aws.js"

const cloudFrontBaseURL = process.env.AWS_CLOUDFRONT_BASE_URL


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
    if (!email || !password) return res.status(401).json("No credential provided");
    try {
        
        const user = await User.findOne({email: email}).select('+password');
        if(!user) {
            return res.status(400).json({message: "User doesn't exist"});
        }
        const list = await List.findOne({userId: user._id}).populate({
            path: "entries",
            populate: { 
                path: "book"
            }
        });
        
        const isMatch = await bcrypt.compare(password, user.password)
        console.log(password, user.password, isMatch);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '24h' });
        //remove property before sending user object
        user.password = undefined;

        res.status(200).json({token, user, list});
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}