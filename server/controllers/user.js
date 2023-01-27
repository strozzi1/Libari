import User from "../models/User.js"
import List from "../models/List.js"
import { isObjectIdOrHexString } from "mongoose";

export const getUserByUsername = async (req, res) => {
    try{
        const userFound = await User.findOne({username: req.params.username})
        
        if(!userFound) return res.status(400).json({message: "No user with provided username"});
        
        return res.status(200).json({user: userFound})
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


/**
 * Delete user
 * AUTH required
 * @param {username} req.params
 * @returns success message
 */
export const deleteUserByUsername = async (req, res) => {
    try{
        const userFound = await User.findOne({username: req.params.username})
        
        if(!userFound) return res.status(400).json({message: "No user with provided username"});
        console.log (req.role)
        if(req.role !== "admin" && userFound._id.valueOf() !== req.userId) return res.status(400).json({message: "Not Authorized to delete this user"});

        List.findOneAndDelete({userId: userFound._id}, function (err, docs) {
            if (err){
                return res.status(500).json({message: err})
            }
            else{
                console.log("Deleted List: ", docs);
            }
        });
        
        User.findByIdAndDelete(userFound._id, function (err, docs) {
            if (err){
                return res.status(500).json({message: err})
            }
            else{
                console.log("Deleted User: ", docs);
            }
        });

        return res.status(200).json({message: `User ${userFound.username} has been deleted, and list`})
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

export const deleteUserById = async (req,res) => {
    const { userId } = req.body
    let result = {}
    if(!userId) return res.status(400).json({message: "Invalid userId provided"});

    if(req.role === "admin" || userFound._id.valueOf() !== req.userId) return res.status(400).json({message: "Not Authorized to delete this user"});

    try {
        List.findOneAndDelete({userId: userId}, function(err, docs){
            if(err){
                return res.status(400).json({message: err.message})
            }
            result.deletedList = docs;
        })
        //delete user
        User.findByIdAndDelete(userId, function(err, docs) {
            if(err){
                res.status(400).json({message: err.message});
            } else if (docs == null){
                res.status(400).json({message: "No such user in database"});
            } else {
                result.deletedUser = docs
                res.status(201).json({message: `Successfully deleted user`, deleted: result});
            }
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}