import { useEffect, useState } from "react";
import { AddCircle } from "@mui/icons-material";
import { 
    Avatar, 
    Grid, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Modal,
    Box, 
    Typography, 
    useMediaQuery, 
    Skeleton } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddEntryForm from "../widgets/AddEntryForm";
import { useSelector } from "react-redux";
/**TODO: Handle click to close modal if in blank space part of grid */

//Move to Utils?
const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

const SearchResults = ({searchText}) => {
    const [resultsList, setResultsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const isNonMobileScreen = useMediaQuery("(min-width: 450px)");
    const theme = useTheme();
    const navigate = useNavigate();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const handleSearch = async (query) => {
        setIsLoading(true);
        //TODO: Clean up fetch logic
        try {
            const response = await fetch(`http://localhost:5001/google-relay/${query}`,
            {
                method: "GET"
            })
            const searchResults = await response.json();
            setResultsList(response.ok ? searchResults.items : [])
        } catch (error) {
            setResultsList([])
            console.log(error)
        }
        //TODO more flexability...page size and query logic
        try {
            const userQuery = await fetch(`http://localhost:5001/user?username=${query}&page=${1}&pageSize=${10}`)
            const userResponse = await userQuery.json()
            setUsersList(userQuery.ok ? userResponse.results : [])
        } catch (error) {
            setUsersList([])
            console.log(error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        handleSearch(searchText);
    },[searchText])

    return (
        
        <Grid container spacing={4} justifyContent="center" sx={{
            position: "absolute",
            top: "15%",
            paddingBottom: "20px"
        }}>
            <Grid item sm={8} md={5} xs={12}>
            <Typography sx={{
                color: theme.palette.modal.text,
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "3px",
                paddingLeft:"5px"
            }}>Books</Typography>
            <WidgetWrapper>
                { !isLoading ?
                <List disablePadding>
                    { resultsList.map((book) =>
                        <SearchResultBookItem key={book.id} book={book}/>
                    )}
                </List>
                :
                /** BELOW IS SKELETON CONTENT WHILE WE WAIT FOR BOOKS TO LOAD */
                [1,2,3,4,5].map((num) =>
                <List key={num} disablePadding>
                    <ListItem disableGutters>
                        <ListItemAvatar>
                            <Skeleton variant="rounded"><Avatar/></Skeleton>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Skeleton/>}
                            secondary={<Skeleton width="30%"/>}
                        ></ListItemText>
                    </ListItem>
                </List>
                )}
            </WidgetWrapper>
            </Grid>
            <Grid item sm={8} md={5} xs={12}>
            
                {usersList.length > 0 && 
                <>
                    <Typography sx={{
                        color: theme.palette.modal.text,
                        fontSize: "16px",
                        fontWeight: 500,
                        marginBottom: "3px",
                        paddingLeft:"5px"
                    }}>Users</Typography>
                    <WidgetWrapper>
                    <List disablePadding>
                        { usersList.map((user) =>
                        <ListItem 
                        disableGutters 
                        key={user._id}
                        onClick={()=>navigate(`/user/${user.username}`)}
                        sx={{
                            maxHeight: "66px",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: neutralLight
                            }
                        }}>
                            <ListItemAvatar>
                                <Avatar alt={user.username} src={user.image} variant="rounded"/>
                            </ListItemAvatar>
                            <ListItemText
                            primary={user.username}
                            secondary={
                                <>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    textOverflow="ellipsis"
                                >
                                    {
                                    truncate(user.bio, 40)
                                    }
                                </Typography>
                                </>
                            }
                            /> 
                        </ListItem>
                        )}
                    </List>
                    </WidgetWrapper>
                </>
                }
            </Grid>
        </Grid>
        
    )
}

//Each item listed in the search results
const SearchResultBookItem = ({book}) => {
    const {palette} = useTheme()
    const neutralLight = palette.neutral.light;
    const dark = palette.neutral.dark;
    const authedUser = useSelector((state)=> state.user)
    const [isHovering, setIsHovering] = useState(false)
    const [isBookModal, setIsBookModal] = useState(false);
    const isNonMobileScreen = useMediaQuery("(min-width: 450px)");
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 0,
        borderRadius: "9px",
        border: "none",
        "&:focus": {
            outline: 0,
            border: "none"
        }
    };

    const handleOpenEntryModal = (book) => {
        setIsBookModal(true)
        console.log("ADD BOOK: ", book)
    }

    const handleCloseBookModal = () => {
        setIsBookModal(false)
    }

    return (
        <>
        <Modal 
            open={isBookModal}
            onClose={handleCloseBookModal}>
            <Box sx={modalStyle} width={isNonMobileScreen ? "50%" : "93%"}>
            <WidgetWrapper >
                <AddEntryForm googleBook={book}/>
            </WidgetWrapper>
            </Box>
        </Modal>
        <ListItem 
            disableGutters 
            alignItems="flex-start" 
            sx={{
                maxHeight: "66px",
                "&:hover": {
                    backgroundColor: neutralLight
                }
            }}
            onMouseOver = {() => setIsHovering(true)}
            onMouseOut = {()=> setIsHovering(false)}
            >
            <ListItemAvatar>
                <Avatar alt={book.volumeInfo.title} src={book.volumeInfo.imageLinks?.smallThumbnail} variant="rounded"/>
            </ListItemAvatar>
            {isNonMobileScreen ?
            <ListItemText
            primary={book.volumeInfo.title}
            primaryTypographyProps={{ 
                style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }
            }}
            secondary={
                <>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    textOverflow="ellipsis"
                >
                    {
                    truncate(Array(book.volumeInfo.authors).toString(), 33)
                    }
                </Typography>
                </>
            }
            /> 
            : 
            <ListItemText primary={truncate(book.volumeInfo.title, 40)}/>
            }
            { isHovering && authedUser &&
            <AddCircle
                onClick={() =>handleOpenEntryModal(book)}
                sx={{
                transition: "visibility 0.3s",
                margin: "10px",
                "&:hover": {
                    color: dark,
                    cursor: "pointer"
                }
                }} 
                fontSize="large"/> }
        </ListItem>
        </>
    )
}
export default SearchResults;