import { useDispatch, useSelector } from "react-redux";

import {useTheme, Box, useMediaQuery } from "@mui/material";

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { LibraryBooks } from "@mui/icons-material";
import Navbar from "../navbar";
import { useParams } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import UserWidget from "../widgets/UserWidget";
import ListWidget from "../widgets/ListWidget";


const ListPage = () => {
    const params = useParams()
    const { palette } = useTheme();
    const entries = useSelector((state)=>state.entries)
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    
    return (
        <Box>
            <Navbar/>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                {/*Left column */}
                <Box flexBasis={isNonMobileScreens ? "70%" : undefined}>
                    <ListWidget username={params.username}/>

                </Box>
                {/*Middle column */}
                <Box 
                    flexBasis={isNonMobileScreens ? "26%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <UserWidget username={params.username}/>
                </Box>
                
            </Box>
        </Box>
    )
}


export default ListPage;