import { LibraryBooksOutlined, MoreHoriz } from "@mui/icons-material";
import { Grid, useTheme, Box, ListItem, List, Rating, Avatar, Tooltip, Modal, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WidgetWrapper from "../../components/WidgetWrapper";
import EditEntryForm from "../listPage/EditEntryForm";
import { updateEntry } from "../../state";



const ListWidget = ({username}) => {
    const {palette} = useTheme();
    const [list, setList] = useState(null);
    const authedUser = useSelector((state) => state.user)
    const authedList = useSelector((state) => state.entries)

    const updateEntry = (updatedEntry) => {
        const updatedList = list.map((entry) => entry._id === updatedEntry._id ? updatedEntry : entry)
        setList(updatedList)
    }

    const getList = async () => {
        if(authedUser && username === authedUser.username){
            setList(authedList)
        } else {
            const response = await fetch(`http://localhost:5001/user/${username}/booklist`,
            {
                method: "GET"
            });
            const data = await response.json();
            setList(data.entries);
        }
        
    }

    useEffect(() => {
        getList();
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    //TODO: Handle loading state (MUI SKELETON)
    if(!list){
        return null;
    }

    return (
        <WidgetWrapper>
            <List>
                <ListItem>
                    <Grid container spacing={1.0} fontWeight="bold">
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
    )

} 


const ListItemContent = ({entry, username, update}) => {
    const [rating, setRating] = useState(entry.rating)
    const {palette} = useTheme();
    const [hovering, setHovering] = useState(false)
    const [isEditModal, setIsEditModal] = useState(false);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const dispatch = useDispatch()
    const token = useSelector((state) => state.token)
    const authedUsername = useSelector((state)=>state.user?.username)
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
                        //handleEditedEntry({...entry, rating:newValue*2})
                        //TODO update DB
                    }}
                />
            </Grid>
            <Grid item xs={2}> 
            {entry.page > 0 &&
                <Box>{entry.page && entry.page} / {entry.book.pages && entry.book.pages}</Box>
            }
            </Grid>
            {/* Modal Content */}
            <Modal 
                open={isEditModal}
                onClose={handleCloseEditModal}>
                <Box sx={modalStyle} width={isNonMobileScreens ? "50%" : "93%"}>
                <WidgetWrapper >
                    <EditEntryForm entry={entry} close={handleEditedEntry}/>
                </WidgetWrapper>
                </Box>
            </Modal>
            {/* End of Modal Content */}
        </Grid>
    )
}

export default ListWidget;