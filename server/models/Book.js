import mongoose from "mongoose"
import uniqueValidator from 'mongoose-unique-validator';

const BookSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            require: false
        },
        title: {
            type: String,
            required: true, 
            //match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 200
        },
        author: {
            type: String,
            required: true, 
            //match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 50
        },
        readers: {
            type: Number,
            default: 0
        },
        photo: {
            type: String,
            required: false
        },
        pages: {
            type: Number,
            required: false
        },
        released: {
            type: Date,
            default: '1900-01-01'
        }
    },
    {timestamps: true}
)

BookSchema.plugin(uniqueValidator, {message: 'already exists in DB'});

const Book = mongoose.model("Book", BookSchema)
export default Book;