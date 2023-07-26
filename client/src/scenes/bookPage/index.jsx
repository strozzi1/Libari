import { Box, Grid, Rating, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Height } from "@mui/icons-material";
import { updateEntry } from "../../state";
//import { useQuery } from "react-query"


const BookPage = ({}) => {
    const params = useParams()
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const entryList = useSelector((state)=> state.auth.entries)
    const token = useSelector((state)=> state.auth.token)
    const isLoading = useRef(true);
    const [currAuthor, setCurrAuthor] = useState({});
    
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const bookIdParam = params.id
    //const location = useLocation()
    const bookEntry = Array.from(entryList).filter((entry)=> String(entry.book.openLibKey).split('/')[2] === bookIdParam)[0]
    const [rating, setRating] = useState(0)
    const [currBook, setCurrBook]= useState(bookEntry?.book);
    //const {palette} = useTheme()
    const isInList = bookEntry?.length > 0

    console.log("Is in list: ", isInList)

    const fetchWork = async () => {
        //https://openlibrary.org/works/OL3511459W.json
        try {
            const response = await fetch(`https://openlibrary.org/works/${bookIdParam}.json`,
            {
                method: "GET"
            })
            const bookData = await response.json();
            //console.log("work search results: ",bookData)
            const book = {
                photo: `https://covers.openlibrary.org/b/id/${bookData.covers ? bookData.covers[0] : ""}-M.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-lg.png`,
                workKey: bookData.key,
                authorKey: bookData.authors[0]?.author?.key ?? "",
                createdAd: bookData.first_publish_year,
                title: bookData.title, 
                description: bookData.description
            }
            setCurrBook(book)
            setRating(isInList ? bookEntry?.rating : (bookData.rating ?? 0))
            fetchAuthor(book.authorKey);
        } catch (error) {
            //setResultsList([])
            console.log(error)
        }

    }

    const fetchAuthor = async (author) => {

        if(currBook?.authorKey === "") return

        const response = await fetch(`https://openlibrary.org${author}.json`,
        {
            method: "GET"
        })

        const authorData = await response.json();
        //console.log("author data: ", authorData)
        setCurrAuthor(authorData)


    }

    useEffect(()=> {
        isLoading.current = true;
        fetchWork();
        isLoading.current = false;
    },[bookIdParam]);

    if(isLoading.current){
        return (
            <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between">

                {/*Left column */}
                <Box
                display="flex"
                justifyContent="center"
                flexBasis={isNonMobileScreens ? "20%" : undefined}>
                    <Box display="block" alignContent="center">
                        <Box>
                            <Skeleton width={200} height={300} variant="rectangle" animation="wave" style={{margin: "auto",}} />
                        </Box>
                        
                        <Box display={isNonMobileScreens ? "flex" : "block"} justifyContent="center" alignContent="center">
                        { isNonMobileScreens ?
                            <Box>

                            </Box>
                            : 
                            <Box display="flex" alignItems="center" flexDirection="column">
                                <Skeleton
                                variant="text"
                                animation="wave"
                                width={250}
                                    sx={{
                                        fontSize: "25px",
                                        fontWeight: "500"
                                    }}
                                />
                                <Skeleton
                                variant="text"
                                animation="wave"
                                width={200}
                                sx={{
                                    fontSize: "15px",
                                    fontStyle: "italic",
                                    marginBottom: "10px"
                                }}
                                />
                                <Rating size="large"
                                name="simple-controlled"
                                sx={{marginBottom: "15px"}}
                                title="Rating"
                                readOnly={isInList}
                                precision={0.5}
                                value={rating/2}
                                onChange={(event, newValue) => {
                                    setRating(newValue*2);
                                    dispatch(updateEntry({entry: {...bookEntry, rating: newValue*2}, token}))
                                    
                                }}/>
                            </Box>
                        }
                        </Box>
                    </Box>
                </Box>
                


                {/*Right column */}
                <Box flexBasis={isNonMobileScreens ? "70%" : undefined} sx={{opacity: "85%"}}>
                    { isNonMobileScreens ? 
                        <>
                            <Skeleton
                                animation="wave"
                                width={250}
                                variant="text"
                                sx={{
                                    fontSize: "25px",
                                    fontWeight: "500"
                                }}
                            />
                            <Skeleton
                            animation="wave"
                            variant="text"
                            width={200}
                            sx={{
                                fontSize: "15px",
                                fontStyle: "italic",
                                marginBottom: "10px"
                            }}
                            />
                        </>
                        : 
                        <>
                        </>
                    }
                    <Skeleton variant="text" sx={{fontSize: "1rem"}}/>
                    <Skeleton variant="text" sx={{fontSize: "1rem"}}/>
                    <Skeleton variant="text" sx={{fontSize: "1rem"}}/>
                    <Skeleton variant="text" sx={{fontSize: "1rem"}}/>
                </Box>
            </Box>
        </Box>


        )
    }
    

    return (
        <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between">

                {/*Left column */}
                <Box
                display="flex"
                justifyContent="center"
                flexBasis={isNonMobileScreens ? "20%" : undefined}>
                    <Box display="block" alignContent="center">
                        <Box>
                            <img style={{
                                margin: "auto",
                                width: "200px",
                                height: "300px"}}  
                            src={currBook?.photo}/>
                        </Box>
                        
                        <Box display={isNonMobileScreens ? "flex" : "block"} justifyContent="center" alignContent="center">
                        { isNonMobileScreens ?
                            <Box>

                            </Box>
                            : 
                            <Box display="flex" alignItems="center" flexDirection="column">
                                <Typography
                                    sx={{
                                        fontSize: "25px",
                                        fontWeight: "500"
                                    }}
                                >{currBook?.title}</Typography>
                                <Typography
                                sx={{
                                    fontSize: "15px",
                                    fontStyle: "italic",
                                    marginBottom: "10px"
                                }}
                                >{currAuthor?.name}</Typography>
                                <Rating size="large"
                                name="simple-controlled"
                                sx={{marginBottom: "15px"}}
                                title="Rating"
                                readOnly={isInList}
                                precision={0.5}
                                value={rating/2}
                                onChange={(event, newValue) => {
                                    setRating(newValue*2);
                                    dispatch(updateEntry({entry: {...bookEntry, rating: newValue*2}, token}))
                                    
                                }}/>
                            </Box>
                        }
                        </Box>
                    </Box>
                </Box>
                


                {/*Right column */}
                <Box flexBasis={isNonMobileScreens ? "70%" : undefined} sx={{opacity: "85%"}}>
                    { isNonMobileScreens ? 
                        <>
                            <Typography
                                sx={{
                                    fontSize: "25px",
                                    fontWeight: "500"
                                }}
                            >{currBook.title}</Typography>
                            <Typography
                            sx={{
                                fontSize: "15px",
                                fontStyle: "italic",
                                marginBottom: "10px"
                            }}
                            >{currAuthor?.name}</Typography>
                        </>
                        : 
                        <>
                        </>
                    }
                    <Typography>{currBook?.description?.value ?? currBook?.description}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default BookPage;