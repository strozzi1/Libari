import * as React from 'react';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledMenu from './StyledMenu';
import {Box, Modal, Divider, MenuItem, Button, useTheme, useMediaQuery } from '@mui/material';
import AddEntryForm from '../scenes/widgets/AddEntryForm';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';


export default function BookStatusButton({googleBook}) {
    const {palette} = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isBookModal, setIsBookModal] = useState(false);
    const entries = useSelector((state)=> state.auth.entries)
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
        <div>
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
            endIcon={<KeyboardArrowDownIcon value="arrow"/>}
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
            
            <StyledMenu 
            id="demo-customized-menu"
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            >
                <MenuItem value="Reading" onClick={handleClose} disableRipple>
                    Set as Reading
                </MenuItem>
                <MenuItem value="Planning" onClick={handleClose} disableRipple>
                    Set as Planning
                </MenuItem>
                <MenuItem value="Completed" onClick={handleClose} disableRipple>
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