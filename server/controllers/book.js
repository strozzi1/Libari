import Book from "../models/Book.js";


export const getBooks = async (req, res) => {

    try {
        let filter = {}
        const qParams = Object.fromEntries(
            new URLSearchParams(req.query)
        )
        //const {id, googleId, title, author} = req.query
        var page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        
        if(qParams.title) filter.title = { $regex: '.*' + qParams.title + '.*', $options: 'i' }
        if(qParams.author) filter.author = { $regex: '.*' + qParams.author + '.*', $options: 'i'}
        if(qParams.googleId) filter.googleId = qParams.googleId
        if(qParams.id) filter._id = qParams.id
        const count = await Book.countDocuments(filter);
        const lastPage = Math.ceil(count / pageSize);
        page = page > lastPage ? lastPage : page;
        page = page < 1 ? 1 : page;
        const offset = (page - 1) * pageSize;
        
        const results = await Book.find(filter)
            .sort({ _id: 1 })
            .skip(offset)
            .limit(pageSize)
        
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