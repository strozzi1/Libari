import List from "../models/List.js";

//DONE
export const getListByUsername = async (req, res) => {
    const userNameParam = req.params.username
    try{
        //get list and populate books list with books from ids in said list

        //Just get Entries
        const foundList = await List.findOne({username: userNameParam})
            .populate({
                path: "entries",
                populate: { 
                    path: "book"
                }
            });
        
        if(!foundList){
            return res.status(400).json({message: "No list found with that user"});
        }
        res.status(200).json({foundList});
    } catch (err){
        res.status(500).json({message: err.message})
    }
}
