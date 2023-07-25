import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { Height } from "@mui/icons-material";


const BookPage = ({}) => {
    const params = useParams()
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const entryList = useSelector((state)=> state.auth.entries)
    const [currBook, setCurrBook]= useState({});
    const [currAuthor, setCurrAuthor] = useState({});
    const navigate = useNavigate();
    const bookIdParam = params.id
    const location = useLocation()
    const bookEntry = Array.from(entryList).filter((entry)=> entry.book.workId === bookIdParam)
    const {palette} = useTheme()
    const isInList = bookEntry.length > 0

    const fetchWork = async () => {
        //https://openlibrary.org/works/OL3511459W.json
        try {
            const response = await fetch(`https://openlibrary.org/works/${bookIdParam}.json`,
            {
                method: "GET"
            })
            const bookData = await response.json();
            console.log("work search results: ",bookData)
            const book = {
                photo: `https://covers.openlibrary.org/b/id/${bookData.covers ? bookData.covers[0] : ""}-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-lg.png`,
                workKey: bookData.key,
                authorKey: bookData.authors[0]?.author?.key ?? "",
                createdAd: bookData.first_publish_year,
                title: bookData.title, 
                description: bookData.description
            }
            setCurrBook(book)
            fetchAuthor(book.authorKey);
        } catch (error) {
            //setResultsList([])
            console.log(error)
        }

    }

    const fetchAuthor = async (author) => {

        if(currBook.authorKey === "") return

        const response = await fetch(`https://openlibrary.org${author}.json`,
        {
            method: "GET"
        })

        const authorData = await response.json();
        console.log("author data: ", authorData)
        setCurrAuthor(authorData)


    }

    useEffect(()=> {
        fetchWork();
        
    },[bookIdParam]);

    

    return (
        <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent={isNonMobileScreens ? "space-between" : "center"}>

                {/*Left column */}
                <Box sx={{
                    width: "200px",
                    height: "300px"
                }} 
                flexBasis={isNonMobileScreens ? "20%" : undefined}>
                    <Box>
                        <img src={currBook?.photo}/>
                    </Box>
                    

                </Box>


                {/*Right column */}
                <Box flexBasis={isNonMobileScreens ? "70%" : undefined}>
                    <Typography>{currBook.title}</Typography>
                    <Typography>{currAuthor?.name}</Typography>
                    <Typography>{currBook.description?.value ?? currBook.description}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default BookPage;