import Book from "../models/Book.js";


export const getBooks = async (req, res) => {

    try {

        const filter = Object.fromEntries(
            new URLSearchParams(req.query)
        )
        //const {id, googleId, title, author} = req.query
        var page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        /*const filter = {
            _id: id,
            googleId, title, author
        }*/
        const count = await Book.countDocuments();
        const lastPage = Math.ceil(count / pageSize);
        page = page > lastPage ? lastPage : page;
        page = page < 1 ? 1 : page;
        const offset = (page - 1) * pageSize;
        console.log(filter)
        const results = await Book.find(filter)
            .sort({ _id: 1 })
            .skip(offset)
            .limit(pageSize)
            //.toArray();
        
        res.status(200).json({
            results,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: pageSize,
            totalCount: results.length
        });
    } catch (error) {
        res.status(500).json(error)
    }
}