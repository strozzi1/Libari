import mongoose from "mongoose"

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
        books: {
            type: Array,
            default: []
        }
    },
    {timestamps: true}
)

const List = mongoose.model("List", ListSchema)
export default List;
