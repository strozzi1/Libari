import { LibraryBooksOutlined, MoreHoriz } from "@mui/icons-material";
import { Grid, useTheme, Box, ListItem, List, Rating, Avatar, Tooltip, Modal, useMediaQuery, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WidgetWrapper from "../../components/WidgetWrapper";
import EditEntryForm from "../listPage/EditEntryForm";
import { updateEntry } from "../../state";
import { BASE_URL } from "../../env";
import FlexBetween from "../../components/FlexBetween";
import {useLocation} from 'react-router-dom';


const ListWidget = ({username}) => {
    const {palette} = useTheme();
    const isBiggerThanTablet = useMediaQuery("(min-width:650px)")
    const [list, setList] = useState(null);
    const authedUser = useSelector((state) => state.auth.user)
    const authedList = useSelector((state) => state.auth.entries)
    const location = useLocation();

    const updateEntry = (updatedEntry) => {
        const updatedList = list.map((entry) => entry._id === updatedEntry._id ? updatedEntry : entry)
        setList(updatedList)
    }

    const getList = async () => {
        if(authedUser && username === authedUser.username){
            setList(authedList)
        } else {
            const response = await fetch(`${BASE_URL}/user/${username}/booklist`,
            {
                method: "GET"
            });
            const data = await response.json();
            setList(data.entries);
        }
        
    }

    useEffect(() => {
        getList();
    }, [authedList, location]); //eslint-disable-line react-hooks/exhaustive-deps

    //TODO: Handle loading state (MUI SKELETON)
    if(!list){
        return null;
    }

    return (
        <>
            <ListFragment list={list.filter((item)=> item.status === "Reading")} username={username} status="Reading"/>
            <ListFragment list={list.filter((item)=> item.status === "Planning")} username={username} status="Planning"/>
            <ListFragment list={list.filter((item)=> item.status === "Completed")} username={username} status="Completed"/>
            <ListFragment list={list.filter((item)=> item.status === "Dropped")} username={username} status="Dropped"/>
        </>
    )

} 

const ListFragment = ({list, username, status}) => {
    const {palette} = useTheme();
    const isBiggerThanTablet = useMediaQuery("(min-width:650px)")

    if(!list[0]){
        return null;
    }

    const sortedRatingList = Array.from(list).sort((a, b)=> b.rating - a.rating)
    

    return(
        <>
        <Typography sx={{
                paddingBottom: "5px",
                paddingLeft: "20px",
                paddingTop: status === "Reading" ? "0px" : "20px" ,
                fontSize: "20px",
                opacity: "80%"
            }}>{status}</Typography>
        <WidgetWrapper>
            <List> {isBiggerThanTablet &&
                <ListItem>
                    <Grid container spacing={1.0} fontWeight="bold">
                        <Grid item xs={1}>
                            <Box></Box>
                        </Grid>
                        <Grid sx={{cursor: "pointer"}} item xs={5}>
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
                </ListItem> }
                {sortedRatingList.map((entry) =>
                    <ListItem 
                    key={entry._id} 
                    sx={{
                        "&:hover": {
                            bgcolor: palette.primary.light,
                        },
                    }}>
                        <ListItemContent entry={entry} username={username} update={updateEntry}/>
                    </ListItem>
                )}
            </List>
        </WidgetWrapper>
        </>
    )
}


const ListItemContent = ({entry, username, update}) => {
    const [rating, setRating] = useState(entry.rating)
    const {palette} = useTheme();
    const [hovering, setHovering] = useState(false)
    const [isEditModal, setIsEditModal] = useState(false);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    //const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const isBiggerThanTablet = useMediaQuery("(min-width:650px)")
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token)
    const authedUsername = useSelector((state)=>state.auth.user?.username)
    const handleOpenEditModal = () => {
        setIsEditModal(true);
    }
    const handleCloseEditModal = () => {
        setIsEditModal(false)
        setHovering(false)
    };
    
    const handleEditedEntry = (updatedEntry) => {
        setIsEditModal(false)
        setHovering(false)
        setRating(updatedEntry.rating)
        update(updatedEntry)
    }
    
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



    return (
        <>
        { 
        isBiggerThanTablet ?
        <Grid container spacing={1.0} alignItems="center" onMouseOver={()=>setHovering(true)} onMouseOut={()=>setHovering(false)}>
            <Grid item xs={1}>
                
                <Avatar sx={{ bgcolor: palette.primary.main, "&:hover": {cursor: "pointer"} }} variant="rounded" src={!hovering ? entry.book?.photo : undefined}>
                    
                    {(hovering && username===authedUsername) ? 
                        <Tooltip title="Edit Book Entry" placement="right">
                            <MoreHoriz fontSize="large" onClick={()=>handleOpenEditModal()}/> 
                        </Tooltip>
                        : 
                        <LibraryBooksOutlined /> 
                    }
                </Avatar>
            </Grid>
            <Grid item xs={5}>
                <Box style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{entry.book?.title}</Box>
            </Grid>
            
            <Grid item xs={2}>
                <Box>{entry.status}</Box>
            </Grid>
            <Grid item xs={2}>
                <Rating
                    readOnly={authedUsername !== username}
                    size="small"
                    name="simple-controlled"
                    precision={0.5}
                    value={rating/2}
                    onChange={(event, newValue) => {
                        setRating(newValue*2);
                        dispatch(updateEntry({entry: {...entry, rating: newValue*2}, token}))
                        
                    }}
                />
            </Grid>
            <Grid item xs={2}> 
            {entry.page > 0 &&
                <Box>{entry.page && entry.page} / {entry.book.pages && entry.book.pages}</Box>
            }
            </Grid>
            {/* Modal Content */}
            
            {/* End of Modal Content */}
        </Grid>
        :
        <Grid container 
            spacing={0.5} alignItems="center" 
            onMouseOver={()=>setHovering(true)} 
            onMouseOut={()=>setHovering(false)}
            style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
        <FlexBetween>
            <Avatar sx={{ bgcolor: palette.primary.main, "&:hover": {cursor: "pointer"} }} variant="rounded" src={!hovering ? entry.book?.photo : undefined}>
                    
                    {(hovering && username===authedUsername) ? 
                        <Tooltip title="Edit Book Entry" placement="right">
                            <MoreHoriz fontSize="large" onClick={()=>handleOpenEditModal()}/> 
                        </Tooltip>
                        : 
                        <LibraryBooksOutlined /> 
                    }
                </Avatar>
                <Box style={{
                    paddingLeft: '7px'
                }}>
                <Typography noWrap>{ entry.book?.title}</Typography>
                </Box>
                
        </FlexBetween>
        <FlexBetween>

        </FlexBetween>
        </Grid>
        }
        <Modal 
            open={isEditModal}
            onClose={handleCloseEditModal}>
            <Box sx={modalStyle} width={isNonMobileScreens ? "50%" : "93%"}>
            <WidgetWrapper >
                <EditEntryForm entry={entry} close={handleEditedEntry}/>
            </WidgetWrapper>
            </Box>
        </Modal>
        </>
    )
}

export default ListWidget;