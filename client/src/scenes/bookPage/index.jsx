import { Box, Button, ButtonGroup, Divider, FormControl, IconButton, InputBase, MenuItem, Paper, Rating, Select, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { updateEntry } from "../../state";
import BookStatusButton from "../../components/BookStatusButton";
import { Favorite, FavoriteBorder, HeartBroken } from "@mui/icons-material";
//TODO: use dompurify to sanitize html from googleBooks API (Description)
//import DOMPurify from "dompurify";  
//import { useQuery } from "react-query"



const BookPage = ({}) => {
    const params = useParams();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const entryList = useSelector((state)=> state.auth.entries);
    const token = useSelector((state)=> state.auth.token);
    const dispatch = useDispatch();
    const location = useLocation();
    const isLoading = useRef(true);
    const navigate = useNavigate();
    const {palette} = useTheme();
    const neutralLight = palette.neutral.light;
    //const regex = /(<([^>]+)>)/gi;
    

    const bookIdParam = params.id;
    const bookEntry = Array.from(entryList).filter((entry)=> entry.book.googleId === bookIdParam)[0];
    const [rating, setRating] = useState(0);
    //TODO: Review below
    const [currBook, setCurrBook]= useState(bookEntry?.book);
    const [googleResult, setGoogleResult] = useState({})
    

    const fetchWork = async () => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookIdParam}`,
            {
                method: "GET"
            });
            const bookData = await response.json();
            setGoogleResult(bookData);
            console.log("work search results: ",bookData);
            const book = {
                photo: bookData.volumeInfo.imageLinks ? ( bookData.volumeInfo.imageLinks.large ?? bookData.volumeInfo.imageLinks.thumbnail ?? bookData.volumeInfo.imageLinks.smallThumbnail) : "",
                googleId: bookData.id,
                author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : "",
                createdAt: bookData.volumeInfo.publishedAt,
                title: bookData.volumeInfo.title, 
                description: bookData.volumeInfo.description ?? "No description provided for this work",
                averageRating: bookData.volumeInfo.averageRating,
                pageCount: bookData.volumeInfo.pageCount ?? "N/A"
            };
            setCurrBook(book)
            setRating(bookEntry ? bookEntry?.rating : (book.averageRating*2 ?? 0))
            //fetchAuthor(book.authorKey);
        } catch (error) {
            //setResultsList([])
            console.log(error)
        }

    }

    useEffect(()=> {
        isLoading.current = true
        fetchWork();
        isLoading.current = false
        //console.log("Is in list: ", bookEntry)
    },[location]);


    //PAGE IS LOADING CONTENT
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
                                readOnly={bookEntry === {}}
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
                justifyContent="space-evenly">

                {/*Left column */}
                <Box
                display="flex"
                justifyContent="center"
                flexBasis={isNonMobileScreens ? "20%" : undefined}>
                    <Box display="block" alignContent="center">
                        <Box display="flex" justifyContent="space-evenly">
                            <Paper sx={{
                                    backgroundImage: `url(${currBook.photo})`,
                                    backgroundPosition: "center",
                                    width: isNonMobileScreens ? "16rem" : "20vh",
                                    height: isNonMobileScreens ? "24rem" : "30vh",
                                    marginRight: "1rem",
                                    backgroundSize: "cover",
                                    filter: "drop-shadow(0 0.2rem 0.8rem rgba(0, 0, 0, 0.2))",
                                    //borderRadius: "0 6% 6% 0/4%"
                                }}
                            ></Paper>
                        </Box>
                        <Box display={isNonMobileScreens ? "flex" : "block"} justifyContent="center" alignContent="center">
                        { isNonMobileScreens ?
                            <Box marginTop="1rem" 
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "space-evenly"

                            }}>
                                { token ?
                                    
                                <BookStatusButton key="statusMenuButton" googleBook={googleResult}/>
                                    
                                :
                                <Button onClick={()=> navigate("/home")}>Log In</Button>
                                }
                            </Box>
                            : 
                            <Box display="flex" alignItems="center" flexDirection="column">
                                <Typography
                                    sx={{
                                        fontSize: "1.6rem",
                                        fontWeight: "500"
                                    }}
                                >{currBook?.title}</Typography>
                                <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontStyle: "italic",
                                    marginBottom: ".6rem"
                                }}
                                >{currBook?.author}</Typography>
                                { token ?
                                    
                                <BookStatusButton key="statusMenuButton" googleBook={googleResult}/>
                                    
                                :
                                <Button onClick={()=> navigate("/home")}>Log In</Button>
                                }
                                <Rating size="large"
                                name="simple-controlled"
                                sx={{marginBottom: "1rem"}}
                                title="Rating"
                                readOnly={bookEntry === undefined}
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
                


                {/*Right column / Bottom */}
                <Box flexBasis={isNonMobileScreens ? "70%" : undefined} sx={{opacity: "85%"}}>

                    { isNonMobileScreens &&
                        <>
                            <Typography
                                sx={{
                                    fontSize: "2.0rem",
                                    fontWeight: "500"
                                }}
                            >{currBook?.title}</Typography>
                            <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontStyle: "italic",
                                marginBottom: "0.6rem"
                            }}
                            >{currBook?.author}</Typography>
                            <Typography fontSize="15px" style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '1.0rem',
                            fontSize: '1.5rem',
                            fontWeight: '500',
                            }}>
                                <Rating size="large"
                                    name="simple-controlled"
                                    title="Rating"
                                    readOnly={bookEntry === undefined}
                                    precision={0.5}
                                    sx={{marginRight: "0.5rem"}}
                                    value={rating/2}
                                    onChange={(event, newValue) => {
                                        setRating(newValue*2);
                                        dispatch(updateEntry({entry: {...bookEntry, rating: newValue*2}, token}))
                                        
                                }}/> <span style={{opacity: "70%"}}>{[NaN, null, undefined].includes(rating) ? 0.0 : (rating/2.0).toPrecision(2)}</span>
                            </Typography>
                        </>
                        
                    }
                    {/*<Typography>{currBook?.description?.value ?? currBook?.description}</Typography>*/}
                    
                    <div style={{fontSize: "1.0rem", textAlign: !isNonMobileScreens && "center"}} dangerouslySetInnerHTML={{__html: currBook?.description?.value ?? currBook?.description}}/>
                    
                </Box>
            </Box>
        </Box>
    )
}

export default BookPage;