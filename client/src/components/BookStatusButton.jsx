import * as React from 'react';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledMenu from './StyledMenu';
import {Box, Modal, Divider, MenuItem, Button, useTheme, useMediaQuery } from '@mui/material';
import AddEntryForm from '../scenes/widgets/AddEntryForm';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../utils/useNotification';
import { addNewEntry, updateEntry } from '../state';
import { Favorite } from '@mui/icons-material';



export default function BookStatusButton({googleBook}) {
    const { displayNotificationAction } = useNotification();
    const dispatch = useDispatch();
    const {palette} = useTheme();
    const [isBookModal, setIsBookModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const entries = useSelector((state)=> state.auth.entries)
    const token = useSelector((state)=> state.auth.token)
    const entry = entries.filter((entry)=> entry.book.googleId === googleBook.id)[0]
    
    const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
    
    const handleClick = (event) => {
        //TODO: Fix this hacky solution
        if(event.target.value !== "box") {
            setAnchorEl(event.currentTarget);
        } else {
            handleOpenEntryModal()
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleOpenEntryModal = () => {
        handleClose()
        setIsBookModal(true)
    }

    const handleCloseBookModal = (e) => {
        setIsBookModal(false)
    }

    const bookData = {
        googleId: googleBook.id,
        title: googleBook.volumeInfo.title,
        author: googleBook.volumeInfo.authors?.toString(),
        photo: googleBook.volumeInfo.imageLinks?.thumbnail,
        pages: googleBook.volumeInfo.pageCount,
        released: googleBook.volumeInfo.publishedDate
    }

    //TODO: Move to external file
    const handleUpdate = (update) => {
        if (entry){
            console.log("book is in list already")
            dispatch(updateEntry({entry:{...update, _id: entry._id}, token}))
            .then((res)=>{
                switch(res.type){
                    case "auth/updateEntry/fulfilled":
                        displayNotificationAction({message: `Successfully updated ${bookData.title}`, type: "success"})
                        
                        break;
                    case "auth/updateEntry/rejected":
                        displayNotificationAction({message: `Error occured when updating`, type: "error"})
                        break;
                    default:
                        displayNotificationAction({message: "Somethings went wrong", type: "warning"})
                }
            })
            .catch((err)=> displayNotificationAction({message: `${err.message}`, type: "error"}))
                
        } else {
            dispatch(addNewEntry({entry: update, book: bookData, token}))
            .then((res)=>{
                switch(res.type){
                    case "auth/addEntry/fulfilled":
                        displayNotificationAction({message: `Successfully added ${res.payload.book.title}`, type: "success"})
                        
                        break;
                    case "auth/addEntry/rejected":
                        displayNotificationAction({message: `Error occured`, type: "error"})
                        break;
                    default:
                        displayNotificationAction({message: "Somethings went wrong", type: "warning"})
                }
            })
            .catch((err)=> displayNotificationAction({message: `${err.message}`, type: "error"}))
            //use effect updates bookInList
        }

        handleClose();
    }

    const handleSelectStatus = (status) => {
        const update = {status: status}
        handleUpdate(update)
    }

    const handleFavorite = () => {
        
        if(entry){ 
            const update = {favorite: !Boolean(entry.favorite)}
            console.log(update)
            handleUpdate(update);
        }
        return
    }


    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: "9px",
        boxShadow: 24,
        p: 4,
        outline: 0,
        border: "none",
        "&:focus": {
            outline: 0,
            border: "none"
        }
    };

    useEffect(()=>{
        console.log("Initiating button")
    },[])

    return (
        <div style={{
            width: "100%",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-evenly"
        }}>
            <Modal 
                open={isBookModal}
                onClose={handleCloseBookModal}>
                <Box sx={modalStyle} width={isNonMobileScreen ? "50%" : "93%"}>
                    <AddEntryForm onSubmitCallback={handleCloseBookModal} googleBook={googleBook}/>
                </Box>
            </Modal>
            <Button
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            value="box"
            endIcon={isNonMobileScreen && <KeyboardArrowDownIcon value="arrow"/> }
            sx={{
                m: "0.4rem 0", 
                p: ".4rem", 
                width: "110px",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": {backgroundColor: palette.primary.dark},
                gridColumn: "span 1"
            }}
            >
                {entry ? entry.status : "Add book"}
            </Button>
            <Button key="favoriteButton"
            onClick={(e)=> handleFavorite()}
            sx={{
                minWidth: "40px", 
                width: "40px", 
                height: "33.8px", 
                color: entry && entry.favorite ? "white" : "rgb(254 202 202)", 
                backgroundColor: "rgb(239 68 68)", 
                borderRadius: "4px",
                "&:hover": {
                    backgroundColor: "rgb(239 68 68)"
                }
            }}>
                <Favorite/>
            </Button>
            
            <StyledMenu 
            id="demo-customized-menu"
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            >
                <MenuItem onClick={()=>handleSelectStatus("Reading")} disableRipple>
                    Set as Reading
                </MenuItem>
                <MenuItem onClick={()=>handleSelectStatus("Planning")} disableRipple>
                    Set as Planning
                </MenuItem>
                <MenuItem onClick={()=>handleSelectStatus("Completed")} disableRipple>
                    Set as Completed
                </MenuItem>
                <Divider light/>
                <MenuItem onClick={handleOpenEntryModal} disableRipple>
                    Open Edit Modal
                </MenuItem>
            </StyledMenu>
        </div>
    );
}