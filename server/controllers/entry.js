import Entry from "../models/Entry.js";
import List from "../models/List.js";
import { ObjectId } from "mongoose";

/*
expected req:
body: {
    book: {
        id?: string,  (might not exist, if so, add to db)
        title: string,
        author: string,
        photo: string,
        pages: number,
        released: Date
    },
    entry: {
        rating: number,
        status: string,
        startDate: Date,
        endDate: Date,
        review: string,
    }
}
*/
export const addNewBookEntryToList = async (req, res) => {
    
}

/*
expected req:
body: {
    entryId: string,
}
*/
export const removeBookEntryFromList = async (req, res) => {
    if(!req.body.entryId) return res.status(400).json({message: "Invalid book entry id"});
    if(!req.userId) return res.status(400).json({message: "Invalid user"});
    try {
        const entryObjId = ObjectId(req.body.entryId);
        const foundList = await List.findOne({userId: req.userId}).populate({path:'entries', select: 'bookId'});
       
        if(!foundList) return res.status(400).json({message: "No list belonging to said user"});
        
        if(!foundList.entries.includes(entryObjId)) return res.status(400).json({message: "Entry does not exist in list"});
        
        const updatedList = await foundList.updateOne({$pull: {entries: req.body.entry.id}, $pull: {books: req.body.entry.bookId}});
        res.status(200).json({updatedList})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

