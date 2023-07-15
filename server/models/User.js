import mongoose from "mongoose"
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            unique: true, 
            required: [true, "can't be blank"], 
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            index: true
        },
        email: {
            type: String, 
            lowercase: true, 
            unique: true, 
            required: [true, "can't be blank"], 
            match: [/\S+@\S+\.\S+/, 'is invalid'], 
            index: true
        },
        googleId: {
            type: String, 
            unique: true,
            required: false
        },
        password: {
            type: String,
            required: true,
            min: 5,
            max: 40,
            select: false
        },
        image: {
            type: String,
            required: false,
            default: ""
        },
        location: {
            type: String,
            require: false,
            default: "Earth"
        },
        bio: {
            type: String,
            require: false,
            default: "Bio not provided"
        },
        following: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: []
        },
        followers:{
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: [],
        },
        role:{
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user'
        }

    },
    {timestamps: true}
);

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});


const User = mongoose.model("User", UserSchema)
export default User;
