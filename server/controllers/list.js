import List from "../models/List.js";
import Book from "../models/Book.js"
import { validateAgainstSchema, extractValidFields } from  "../util/validation.js"
import { Mongoose } from "mongoose";

export const getListByUsername = async (req, res) => {
    const userName = req.params.username
    try{
        //get list and populate books list with books from ids in said list

        const foundList = await List.findOne({username: userName})
        .populate({
            path: "books"
          });
        if(!foundList){
            return res.status(400).json({message: "No list found with that user"});
        }
        res.status(200).json({foundList});
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

// will store books separately from list, will only save list of book _id
// use this to populate array with books: https://stackoverflow.com/questions/73106030/mongoose-populate-array-of-object-id 
export const addBook = async (req, res) => {
    //if no book or book not valid book object -> return 400 status
    //console.log(req.body.book)
    
    if(!req.body.book) return res.status(400).json({message: "Invalid book object"});
    const {title, author, rating, status, photo, pages} = req.body.book
    const newBook = new Book ({
        title, author, rating, status, photo, pages
    })
    try {
        //Get list and check if exist
        const chosenList = await List.findById(req.params.listId); //here
        if(!chosenList) return res.status(400).json({message: "Invalid list chosen"});
        
        //if user doesn't own the list, fail
        if(req.userId !== chosenList.userId) return res.status(400).json({message: "Not authorized to add to chosen list"});

        //Save book
        const savedBook = await newBook.save();
        //push book _id to list in book list
        const updatedList = await chosenList.updateOne({$push: {books: savedBook._id}});
        res.status(201).json({updatedList})
    } catch (err) {
        res.status(500).json({message: "Failed to add book to list"});
    }
}


/**
 * @param {*} req.params: userId, bookId
 * @param {*} res: id of Removed Book
 */
export const removeBookIdFromListByUserId = async (req, res) => {
    if(!req.params.userId || !req.params.bookId) return res.status(400).json({message: "Invalid query"});
    try {
        const foundList = await List.findOne({userId: req.params.userId});
        if(foundList.userId !== req.userId) return res.status(400).json({message: "Not authorized to modify this list"});
        if(!foundList) return res.status(400).json({message: "No list belonging to said user"});

        const remainingBooks = await foundList.books.pull(req.params.bookId);
        foundList.save()

        res.status(201).json({message: remainingBooks});

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}