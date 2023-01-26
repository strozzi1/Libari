import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import List from "../models/List.js"

/* REGISTER USER */
export const register = async (req, res ) => {
    try {
        const {
            username,
            email,
            password,
            picturePath,
            location,
            bio,
            following,
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
            list
        });
        const savedUser = await newUser.save();
        const newList = new List({
            userId: savedUser._id,
            username
        });

        const token = jwt.sign({ id: savedUser._id}, process.env.JWT_SECRET);
        const savedList = await newList.save();
        
        delete savedUser.password
        res.status(201).json({user: savedUser, list: savedList, token: token});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({message: "User doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) res.status(400).json({message: "Invalid Credentials"});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({token, user});
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}