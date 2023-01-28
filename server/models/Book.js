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
        rating: {
            type: Number,
            min: 0,
            max: 10,
            required: false
        },
        status: {
            type: String,
            required: false,
            enum: ['Completed', 'Planning', 'Reading', 'Dropped'],
            default: 'Planning'
        },
        photo: {
            type: String,
            required: false
        },
        pages: {
            type: Number,
            required: false
        }
    },
    {timestamps: true}
)

const Book = mongoose.model("Book", BookSchema)
export default Book;