import User from "../models/User.js"
import List from "../models/List.js"

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
 * @param {username} req.params
 * @returns success message
 */
export const deleteUserByUsername = async (req, res) => {
    try{
        const userFound = await User.findOne({username: req.params.username})
        
        if(!userFound) return res.status(400).json({message: "No user with provided username"});

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