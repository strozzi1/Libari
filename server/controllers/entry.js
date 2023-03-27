import Entry from "../models/Entry.js";
import User from "../models/User.js"
import List from "../models/List.js";
import mongoose from "mongoose";
import Book from "../models/Book.js";

//TODO: replace with query parameter based search (?username=[name]&book=[bookId]&title=[bookname])
//@endpoint /entry/:id
export const getEntryById = async (req, res) => {
    try {
        const foundEntry = await Entry.findOne({_id: req.params.id}).populate({path: 'book'});

        if (!foundEntry) return res.status(400).json({message: "No entry found with that id"})

        return res.status(200).json(foundEntry);
    } catch (err) {
        return res.status(500).json(err)
    }
}

//Get current auth'd user's following list, grab their entries by recent
export const getRecentFollowedUsersUpdates = async (req, res) => {
    try {
        //get current user's following list
        var page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;

        const followingList = await User.findById(req.userId)
        .select('following')
        .populate({
            path: 'following',
            select: '_id'
        })
        
        
        const count = await Entry.countDocuments({userId: {$in: followingList}});
        const lastPage = Math.ceil(count / pageSize);
        page = page > lastPage ? lastPage : page;
        page = page < 1 ? 1 : page;
        const offset = (page - 1) * pageSize;

        const entryList = await Entry.find({userId: {$in: followingList}})
        .populate({path: 'userId', select: 'username _id image'})
        .sort({updatedAt: -1})
        .skip(offset)
        .limit(pageSize)
        
        res.status(200).json({
            followingList, 
            entries: entryList,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: pageSize,
            totalCount: entryList.length
        })
        
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateEntryById = async (req,res) => {
    if(!req.body.entry) return res.status(404).json({
        message: "No update entry object provided",
        entry: {
            rating: "please", 
            status: "provide", 
            startDate: "update", 
            endDate: "entry", 
            review: "object"
        }
    })
    const { rating, status, startDate, endDate, review, page } = req.body.entry
    try {
        const existingEntry = await Entry.findById(req.params.id)
        if(!existingEntry) return res.status(404).json(
            {message: `No existing entry with ID: ${req.params.id}. Feel free to create a new book entry`}
        )
        const updates = {
            rating, status, startDate, endDate, review, page
        }
        const savedEntry = await Entry.findByIdAndUpdate(existingEntry._id, updates, { runValidators: true, new: true });

        res.status(201).json(savedEntry);

    } catch (error) {
        res.status(500).json(error)
    }
}

/* EXPECTED req.body:
body: {
    book: {
        _id?: ;lakjsdf;asdf,
        googleId?: 
        ...
    }
    entry: {

    }
}
*/
export const updateEntryByUserAndBook = async (req, res) => {
    if(!req.body.book || (!req.body.book._id && !req.body.book.googleId) || !req.body.entry) return res.status(404).json({message: "Invalid book object"})
    try {
        const {rating, review, status, startDate, endDate, page} = req.body.entry
        const userList = await List.findOne({userId: req.userId})
            .populate({
                path: 'entries', 
                populate: {path: 'book'}
            }).lean()
            
        const entryToEdit = userList.entries.filter(entry => entry.book._id.equals(req.body.book._id))
        if(!entryToEdit[0]) return res.status(404).json({message: "No entry containing provided book"})
        const updates = {
            rating,
            status,
            review,
            startDate,
            endDate,
            page
        }
        const updatedEntry = await Entry.findByIdAndUpdate(entryToEdit[0]._id, updates, {runValidators: true});
        res.status(201).json(updatedEntry);
    } catch (error) {
        res.status(500).json(error)
    }
}

//@endpoint
/*
expected req:
body: {
    book: {
        id?: string,  (might not exist, if so, add to db)
        googleId?: string
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

REQUIRE: Logged in User
*/
export const addNewBookEntryToList = async (req, res) => {
    if(!req.body.book || !req.body.entry) return res.status(400).json({message: "Invalid book entry object"});
    const {_id, googleId, title, author, photo, pages, readers, released} = req.body.book
    const {rating, status, startDate, endDate, review, page} = req.body.entry
    const newBook = new Book ({
        _id, googleId, title, author, photo, pages, readers, released
    })
    try {
        //Get list and check if exist
        const userList = await List.findOne({userId: req.userId}); 
        if(!userList) return res.status(400).json({message: "Invalid list chosen"});
        
        let existingBook
        if(googleId)
            existingBook = await Book.findOne({googleId: googleId});
        else if (_id){
            existingBook = await Book.findById(_id);
        }

        let savedBook;
        if(!existingBook){
            newBook.readers = 1
            savedBook = await newBook.save();
        } else {
            const listHoldingBook = await List.findOne({_id: userList._id}).populate({path: 'entries', match: {book: existingBook._id}})
            // TODO: make it so this goes to an Update entry function instead
            if(listHoldingBook.entries[0]) return res.status(400).json({message: "Book already in your list"});
            
            existingBook.readers +=1;
            savedBook = await existingBook.save()
        }
        
        const newEntry = new Entry({
            book: savedBook._id,
            userId: mongoose.Types.ObjectId(req.userId),
            rating,
            status,
            page,
            startDate,
            endDate,
            review
        })
        const savedEntry = await newEntry.save()
        //push book _id to list in book list
        const updatedList = await userList.updateOne({$push: {books: savedBook._id, entries: savedEntry._id}});
        
        res.status(201).json({updatedList, entry: newEntry, book: savedBook})
    } catch (error) {
        res.status(500).json(error);
    }
}

/*
req:
params: entryId: string
body: {}
*/
export const removeBookEntry = async (req, res) => {
    if(!req.params.id) return res.status(400).json({message: "Invalid book entry id"});
    if(!req.userId) return res.status(400).json({message: "Invalid user"});
    try {
        //const entryObjId = Mongoose.Types.ObjectId(req.params.id);
        
        const foundList = await List.findOne({userId: req.userId}).populate({path:'entries'});
        //const foundList = await List.findOne({userId: req.userId})
        
        if(!foundList) return res.status(400).json({message: "No list belonging to said user"});
        
        const foundEntry = await Entry.findById(req.params.id);
        
        if(!foundEntry) return res.status(400).json({message: "No such entry"});
        const entryBook = await Book.findById(foundEntry.book);
        
        //remove entry and book from list and save
        const updatedList = await foundList.updateOne({$pull: {entries: foundEntry._id}});
        
        entryBook.readers-=1
        entryBook.save()
        foundEntry.delete()
        return res.status(200).json(updatedList)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

