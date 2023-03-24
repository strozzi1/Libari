import { useEffect, useState } from "react";
import { AddCircle, LibraryBooksOutlined } from "@mui/icons-material";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Box, Typography, useMediaQuery, Skeleton } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTheme } from "@emotion/react";
const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

const SearchResults = ({searchText}) => {
    const [resultsList, setResultsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isNonMobileScreen = useMediaQuery("(min-width: 450px)");
    const theme = useTheme();
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
        //TODO can move this into .then()
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
                        <SearchResultBookItem book={book}/>
                    )}
                </List>
                :
                /** BELOW IS SKELETON CONTENT WHILE WE WAIT FOR BOOKS TO LOAD */
                [1,2,3,4,5].map(() =>
                <List>
                    <ListItem>
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
                <><Typography sx={{
                    color: theme.palette.modal.text,
                    fontSize: "16px",
                    fontWeight: 500,
                    marginBottom: "3px",
                    paddingLeft:"5px"
                }}>Users</Typography>
                <WidgetWrapper>
                <List disablePadding>
                    { usersList.map((user) =>
                    <ListItem disableGutters key={user._id}>
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
                </WidgetWrapper></>}
            </Grid>
        </Grid>
        
    )
}

const SearchResultBookItem = ({book}) => {
    const {palette} = useTheme()
    const neutralLight = palette.neutral.light;
    const dark = palette.neutral.dark;
    const isNonMobileScreen = useMediaQuery("(min-width: 450px)");
    return (
        <ListItem disableGutters alignItems="flex-start" key={book.id} style={{maxHeight: "66px"}}>
            <ListItemAvatar>
                <Avatar alt={book.volumeInfo.title} src={book.volumeInfo.imageLinks?.smallThumbnail} variant="rounded"/>
            </ListItemAvatar>
            {isNonMobileScreen ?
            <ListItemText
            primary={truncate(book.volumeInfo.title, 50)}
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
            <AddCircle 
                color={dark}
                sx={{
                margin: "10px",
                "&:hover": {
                    color: neutralLight,
                    cursor: "pointer"
                }
                }} 
                fontSize="large"/>
        </ListItem>

    )
}
export default SearchResults;