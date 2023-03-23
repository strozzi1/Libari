import { useEffect, useState } from "react";
import { AddCircle, LibraryBooksOutlined } from "@mui/icons-material";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Box, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTheme } from "@emotion/react";
const SearchResults = ({searchText}) => {
    const [resultsList, setResultsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const isNonMobileScreen = useMediaQuery("(min-width: 450px)");
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }

    const handleSearch = async (query) => {
        const response = await fetch(`http://localhost:5001/google-relay/${query}`,
        {
            method: "GET"
        })
        const searchResults = await response.json();
        setResultsList(searchResults.items)
        //Todo more flexability
        const userQuery = await fetch(`http://localhost:5001/user?username=${query}&page=${1}&pageSize=${10}`)
        const userResponse = await userQuery.json()
        setUsersList(userResponse.results)
    }

    useEffect(() => {
        handleSearch(searchText);
    },[searchText])

    return (
        
        <Grid container spacing={4} justifyContent="center" sx={{
            position: "absolute",
            top: "20%",
            paddingBottom: "20px"
        }}>
            <Grid item sm={8} md={5} xs={12}>
            <WidgetWrapper>
                {/*test with pure list*/}
                <List disablePadding>
                    { resultsList.map((book) =>
                    <ListItem disableGutters alignItems="flex-start" key={book.id} style={{maxHeight: "66px"}}>
                        <ListItemAvatar>
                            <Avatar alt={book.volumeInfo.title} src={book.volumeInfo.imageLinks?.smallThumbnail} variant="rounded"/>
                        </ListItemAvatar>
                        {isNonMobileScreen ?
                        <ListItemText
                        primary={book.volumeInfo.title}
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
                    )}
                </List>
            </WidgetWrapper>
            </Grid>
            <Grid item sm={8} md={5} xs={12}>
                {usersList.length > 0 && 
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
                </WidgetWrapper>}
            </Grid>
        </Grid>
        
    )
}

const SearchResultItem = ({book}) => {
    const {palette} = useTheme()
    return (
        <Grid container alignItems="center" spacing={1.0}>
            <Grid item xs={0} md={2} lg={1} sm={2}>
                <Avatar variant="rounded" src={book.volumeInfo?.imageLinks?.smallThumbnail} sx={{ bgcolor: palette.primary.main, "&:hover": {cursor: "pointer"} }}>
                    <LibraryBooksOutlined/>
                </Avatar>
            </Grid>
            <Grid item xs ><Box>{book.volumeInfo.title}</Box></Grid>
            
        </Grid>

    )
}
export default SearchResults;