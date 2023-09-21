import { Avatar, Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import FlexBetween from "../../components/FlexBetween";
import { useNotification } from "../../utils/useNotification";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { BASE_URL } from "../../env";
import { useSelector } from "react-redux";
import { Favorite } from "@mui/icons-material";
import { useState } from "react";

const UpdateText = ({entry}) => {
    const navigate = useNavigate();
    const {palette} = useTheme()
    

    const bookLink = (entry) => {
        navigate(`/book/${entry.book.googleId}`, {
            state: {
                entryData: entry
            }
        })
    }

    
    return( 
        <Typography onClick={()=>bookLink(entry)} sx={{
            whiteSpace: 'nowrap',
            fontSize:"0.9rem",
            "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
            },
        }}>
            { entry.updatedAt === entry.createdAt ? 
            `Added ${entry.book.title} as ${entry.status}` 
            : 
            `${entry.status} ${entry.book.title}`} 
        </Typography>
    )
    
}


const RecentUpdate = ({entry}) => { 
    const {user, token} = useSelector((state)=> state.auth)
    const location = useLocation();
    const isHomepage = location.pathname === '/home'
    const navigate = useNavigate();
    const {palette} = useTheme()
    const dark = palette.neutral.dark
    const [likes, setLikes] = useState(entry.likes)
    const { displayNotificationAction } = useNotification();

    const bookLink = (entry) => {
        navigate(`/book/${entry.book.googleId}`, {
            state: {
                entryData: entry
            }
        })
    }
    
    const handleLike = async () => {
        const response = await fetch(`${BASE_URL}/entry/${entry._id}/like`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${token}`
            }
            
        });

        if(!response.ok){
            const {message} = await response.json()
            console.log(message)
            //handleUpdateMessage({message: message, severity: "error"})
            displayNotificationAction({ message: message, type: "error" })
            return;
        }
        const data = await response.json();
        setLikes(data.result.likes)
        console.log(data)
    }

    if(!entry){
        return (
            <>Loading</>
        )
    }
    //Default
    return (
        <>
            <Box sx={{backgroundColor: palette.background.alt, borderRadius: "3px"}} 
                style={{
                    position:"relative", 
                    width: "100%", 
                    height: "5.7rem", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                }}> 
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
            >
                <FlexBetween>
                {/* UPDATE BOOK THUMBNAIL */}
                <Paper
                onClick={()=>bookLink(entry)}
                sx={{
                    backgroundImage: `url(${entry.book.photo})`, 
                    width: "3.8rem",
                    height: "5.7rem",
                    left: 0,
                    backgroundSize:"cover",
                    borderRadius: "3px 0px 0px 3px",
                    boxShadow: "none",
                    "&:hover": {
                        cursor: "pointer",
                    },
                }}
                >
                </Paper>
                
                { isHomepage ?
                <Box marginLeft="0.7rem">
                    <Typography
                    onClick={()=>navigate(`/user/${entry.userId.username}`)}
                    variant="h6"
                    color={dark}
                    fontSize="0.9rem"
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.dark,
                            cursor: "pointer"
                        },
                    }} 
                    >
                        {entry.userId.username}
                    </Typography>
                    <UpdateText entry={entry} />
                    <Avatar onClick={()=>navigate(`/user/${entry.userId.username}`)} 
                    variant="rounded" 
                    sx={{
                        width: "1.8rem", 
                        height:"1.8rem",
                        "&:hover":{
                            cursor: "pointer"
                        }
                    }} 
                    src={entry.userId.image}>
                    </Avatar>
                </Box>
                :
                <Box marginLeft="8px">
                    <UpdateText entry={entry} />
                </Box>
                }
                </FlexBetween>

                {/* RIGHT SIDE */}
                <FlexBetween>
                    
                    <Paper sx={{
                    //backgroundImage: `url(${entry.book.photo})`,
                    position: "absolute" ,
                    background: `linear-gradient(to right, rgba(0,0,0,0), ${palette.background.alt} 100%)`,
                    width: "6rem",
                    height: "6rem",
                    right: 0,
                    backgroundSize:"cover",
                    borderRadius: "3px 0px 0px 3px",
                    boxShadow: "none"
                }}
                >
                    <Typography 
                        sx={{
                            fontSize: ".7rem",
                            opacity: "70%",
                            textAlign: "right",
                            padding: ".5rem"
                            
                        }}
                    >{moment(entry.updatedAt).fromNow()}</Typography>
                    <Box sx={{
                        position: "absolute",
                        right: 5,
                        bottom: 5,
                        fontSize: ".8rem"
                    }}> 
                        {likes.length > 0 && likes.length}
                        <IconButton size="small" onClick={()=> handleLike()}>
                            <Favorite htmlColor={likes.includes(user._id) && "rgb(239 68 68)"}/>
                        </IconButton>
                    </Box>
                </Paper>
                </FlexBetween>
                </FlexBetween>
            </Box>
            
            </>

    )
}

export default RecentUpdate;