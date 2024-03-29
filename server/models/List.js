import mongoose from "mongoose"

const Schema = mongoose.Schema

const ListSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true
        },
        username:{
            type: String,
            require: true
        },
        // this is for holding user specific data for each book in the list
        entries: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
            default: []
        },
        private: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

const List = mongoose.model("List", ListSchema)
export default List;
