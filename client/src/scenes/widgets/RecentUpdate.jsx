import { Avatar, Box, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import FlexBetween from "../../components/FlexBetween";



const RecentUpdate = ({entry}) => { 
    const {palette} = useTheme()
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main
    const today = new Date()

    //TODO
    //Turn this into a function that creates a string based on entry data 
    //rather than an entirely different render 
    if( entry.updatedAt === entry.createdAt){
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
                <Box marginLeft="8px">
                    <Typography
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
                    <Typography style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        Added {entry.book.title} as {entry.status} 
                    </Typography>
                    <Avatar variant="rounded" sx={{width: "24px", height:"24px"}} src={entry.userId.image}></Avatar>
                </Box>
                </FlexBetween>
                
                </FlexBetween>
            </Box>
            
            </>
        )
    }
    


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
                <Box marginLeft="8px">
                    <Typography
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
                    <Typography style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {entry.status} {entry.book.title}
                    </Typography>
                    <Avatar variant="rounded" sx={{width: "24px", height:"24px"}} src={entry.userId.image}></Avatar>
                </Box>
                </FlexBetween>
                <FlexBetween>
                </FlexBetween>
                </FlexBetween>
            </Box>
            
            </>

    )
}

export default RecentUpdate;