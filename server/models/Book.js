import mongoose from "mongoose"



const BookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true, 
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 200
        },
        author: {
            type: String,
            required: true, 
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 50
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

const Book = mongoose.model("Book", BookSchema)
export default Book;