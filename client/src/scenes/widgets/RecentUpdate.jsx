import { Avatar, Box, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import FlexBetween from "../../components/FlexBetween";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateText = ({entry}) => {
    if( entry.updatedAt === entry.createdAt){
        return( 
            <Typography style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                Added {entry.book.title} as {entry.status} 
            </Typography>
        )
    } else {
        return (
            <Typography style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {entry.status} {entry.book.title}
            </Typography>
        )
    }   
}


const RecentUpdate = ({entry}) => { 
    //const navigate = useNavigate()
    //const params = useParams()
    const {palette} = useTheme()
    //const user = useSelector((state)=>state.user)
    
    const location = useLocation();
    const isHomepage = location.pathname === '/home'
    const navigate = useNavigate();
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main
    const today = new Date()

    //Default
    return (
        <>
            <Box sx={{backgroundColor: palette.background.alt, borderRadius: "3px"}} style={{position:"relative", width: "100%", height: "80px"}}> 
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
            >
                <FlexBetween>
                <Paper sx={{
                    backgroundImage: `url(${entry.book.photo})`, 
                    width: "60px",
                    height: "80px",
                    left: 0,
                    backgroundSize:"cover",
                    borderRadius: "3px 0px 0px 3px",
                    boxShadow: "none"
                }}
                >
                </Paper>
                { isHomepage ?
                <Box marginLeft="8px">
                    <Typography
                    onClick={()=>navigate(`/user/${entry.userId.username}`)}
                    variant="h6"
                    color={dark}
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                        },
                    }} 
                    >
                        {entry.userId.username}
                    </Typography>
                    <UpdateText entry={entry} />
                    <Avatar variant="rounded" sx={{width: "24px", height:"24px"}} src={entry.userId.image}></Avatar>
                </Box>
                :
                <Box marginLeft="8px">
                    
                    <UpdateText entry={entry} />
                </Box>
                }
                </FlexBetween>
                <FlexBetween>
                    {/*Right text go here */}
                </FlexBetween>
                </FlexBetween>
            </Box>
            
            </>

    )
}

export default RecentUpdate;