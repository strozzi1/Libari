import mongoose from "mongoose"


const BookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "can't be blank"], 
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 200
        },
        author: {
            type: String,
            required: [true, "can't be blank"], 
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
            min: 2,
            max: 50
        },
        rating: {
            type: Number,
            min: 0,
            max: 10,
        },
        status: {
            type: String,
            require: [true, "must have status"],
            enum: ['Completed', 'Planning', 'Reading', 'Dropped'],
            default: 'Planning'
        },
        photo: {
            type: String,
            require: false
        }
    },
    {timestamps: true}
)

const Book = mongoose.model("Book", BookSchema)
export default Book;