import { Avatar, Box, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import FlexBetween from "../../components/FlexBetween";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { useSelector } from "react-redux";

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
    
    const location = useLocation();
    const isHomepage = location.pathname === '/home'
    const navigate = useNavigate();
    const {palette} = useTheme()
    const dark = palette.neutral.dark
    

    const bookLink = (entry) => {
        navigate(`/book/${entry.book.googleId}`, {
            state: {
                entryData: entry
            }
        })
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
                </Paper>
                </FlexBetween>
                </FlexBetween>
            </Box>
            
            </>

    )
}

export default RecentUpdate;