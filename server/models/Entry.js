import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EntrySchema = new mongoose.Schema(
    {
        book:{
            type: Schema.Types.ObjectId, ref: 'Book',
            require: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 10,
            require: false,
            default: 0
        },
        status: {
            type: String,
            enum: ['Completed', 'Planning', 'Reading', 'Dropped'],
            default: 'Planning'
        }, 
        startDate: {
            type: Date,
            require: false,
            default: ''
        },
        endDate: {
            type: Date,
            require: false,
            default: ''
        },
        review: {
            type: String,
            maxLength: 1000,
            required: false,
            default: ''
        }
    }, 
    {timestamps: true}
)

const Entry = mongoose.model("Entry", EntrySchema)
export default Entry;