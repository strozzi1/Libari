import { Box, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import BookGridWidget from "../widgets/BookGridWidget";
import FollowingUpdates from "../widgets/FollowingUpdates";
import UserWidget from "../widgets/UserWidget";

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const bookEntries = useSelector((state) => state.entries)
    const {username} = useSelector((state) => state.user)


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
                    <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                    Following Updates:
                    </Typography>
                    {/* TESTING PURPOSES 
                    <RecentUpdate entry={bookEntries[2]}/>*/}
                    <FollowingUpdates/>
                </Box>
                {/*Right column */}
                {isNonMobileScreens &&  (
                    <Box flexBasis='26%'>
                        <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                            Books in Progress
                        </Typography>
                        <BookGridWidget books={
                            bookEntries.filter((entry)=> entry.status === 'Reading').map(entry => entry.book)
                        }/>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
export default HomePage;