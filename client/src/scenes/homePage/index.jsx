import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
//import state from "../../state";
//import {useDispatch, useSelector} from "react-redux";

const HomePage = () => {
    //const entries = useSelector((state) => state.entries)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const {_id, username} = useSelector((state) => state.user)
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
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget username={username} />

                </Box>
                {/*Middle column */}
                <Box 
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    
                </Box>
                {/*Right column */}
                {isNonMobileScreens && (
                    <Box flexBasis='26%'>
                        
                    </Box>
                )}
            </Box>
        </Box>
    )
}
export default HomePage;