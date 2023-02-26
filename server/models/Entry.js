import mongoose from "mongoose";

const EntrySchema = mongoose.Schema(
    {
        bookId:{
            type: Schema.Types.ObjectId, ref: 'Book',
            require: [true, 'Need a book Id in order to create new entry'],
        },
        rating: {
            type: Number,
            min: 0,
            max: 10,
            required: false
        },
        status: {
            type: String,
            enum: ['Completed', 'Planning', 'Reading', 'Dropped'],
            default: 'Planning'
        }, 
        startDate: {
            type: Date,
            require: false
        },
        endDate: {
            type: Date,
            require: false
        },
        review: {
            type: String,
            maxLength: 1000,
            require: false,
            default: ''
        }
    }, {timestamps: true}
)

const Entry = new mongoose.Model('Entry', EntrySchema)
export default Entry;