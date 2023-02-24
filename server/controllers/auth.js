import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import List from "../models/List.js"

/* REGISTER USER */
export const register = async (req, res) => {
    console.log("req.body: ",req.body)
    
    if (!req.body.password || !req.body.email) return res.status(401).json("No password or email provided");
    try {
        const {
            username,
            email,
            password,
            picturePath,
            location,
            bio,
            following,
            followers,
            role,
            list
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            picturePath,
            location,
            bio,
            following,
            followers,
            list,
            role
        });
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

        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '24h' });
        //remove property before sending user object
        user.password = undefined;

        res.status(200).json({token, user});
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}