import { LibraryBooksOutlined } from "@mui/icons-material";
import { Grid, useTheme, Box, ListItem, List, Rating, Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";


const ListWidget = ({username}) => {
    const {palette} = useTheme()
    const [list, setList] = useState(null)
    const getList = async () => {
        
        const response = await fetch(`http://localhost:5001/user/${username}/booklist`,
        {
            method: "GET",
            //headers: { Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        setList(data.entries);
    }

    useEffect(() => {
        getList();
        
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    //TODO: Handle loading state
    if(!list){
        return null;
    }

    return (
        <WidgetWrapper>
            <List>
                <ListItem>
                    <Grid container spacing={1.0}>
                        <Grid item xs={1}>
                            <Box></Box>
                        </Grid>
                        <Grid item xs={5}>
                            <Box>Title</Box>
                        </Grid>
                        
                        <Grid item xs={2}>
                            <Box>Status</Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box>Rating</Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box>Progress</Box>
                        </Grid>
                    </Grid>
                </ListItem>
                {list.map((entry) =>
                    <ListItem key={entry._id}>
                        <ListItemContent entry={entry}/>
                    </ListItem>
                )}
                
            </List>
        </WidgetWrapper>
    )

} 


const ListItemContent = ({entry}) => {
    const [value, setValue] = useState(0)
    const {palette} = useTheme();
    
    return (
        <Grid container spacing={1.0} alignItems="center">
            <Grid item xs={1}>
                <Avatar sx={{ bgcolor: palette.primary.main }} variant="rounded" src={entry.book.photo}>
                    <LibraryBooksOutlined />
                </Avatar>
            </Grid>
            <Grid item xs={5}>
                <Box>{entry.book.title}</Box>
            </Grid>
            
            <Grid item xs={2}>
                <Box>{entry.status}</Box>
            </Grid>
            <Grid item xs={2}>
                <Rating
                    size="small"
                    name="simple-controlled"
                    precision={0.5}
                    value={entry.rating/2}
                    onChange={(event, newValue) => {
                        console.log(newValue)
                        setValue(newValue);
                    }}
                />
            </Grid>
            <Grid item xs={2}>
                <Box>{entry.page && entry.page} / {entry.book.pages && entry.book.pages}</Box>
            </Grid>
        </Grid>
    )
}

export default ListWidget;