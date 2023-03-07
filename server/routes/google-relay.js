
import express from "express";
//const rateLimit = require('express-rate-limit');
import axios from "axios";
import dotenv from 'dotenv-safe'
const router = express.Router()

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY



//app.use(limiter)
router.get('/', (req,res) => res.send("hello world!"));

// @route   GET api/gooble-books
// @desc    Google book search proxy
// @access  Public
router.get('/:query', async (req, res) =>{
    try{
        //const query = `https://www.googleapis.com/books/v1/volumes?q=${req.params.query}&key=${process.env.REACT_APP_GOOGLE_API_KEY || GOOGLE_API_KEY}`
        const search = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.query}&key=${GOOGLE_API_KEY}`);
        if(!search) throw Error('Google Book Search Failed')
        return res.status(200).send(search.data);
    } catch (error){
        return res.status(500).json({
            success: false,
            error
        })
    }
})


export default router;