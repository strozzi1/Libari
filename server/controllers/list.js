import List from "../models/List.js";

export const getListByUsername = async (req, res) => {
    const userName = req.params.username
    try{
        const foundList = await List.findOne({username: userName});
        if(!foundList){
            return res.status(400).json({message: "No list found with that user"});
        }
        res.status(200).json({foundList});
    } catch (err){
        res.status(500).message({message: err.message})
    }
    
}