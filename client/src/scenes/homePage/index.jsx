import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import BookGridWidget from "../widgets/BookGridWidget";
import FollowingUpdates from "../widgets/FollowingUpdates";
import UserWidget from "../widgets/UserWidget";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const bookEntries = useSelector((state) => state.auth.entries)
    const {username} = useSelector((state) => state.auth.user)
    const navigate = useNavigate();
    const {palette} = useTheme()

    return (
        <Box>
        <Navbar />

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
                    //sx={{overflow: "hidden", textOverflow: "ellipsis"}}
                    maxWidth={isNonMobileScreens ? "42%" : undefined}
                >   
                    <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                    Following Updates:
                    </Typography>

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
                        <Typography
                        onClick={(e)=>navigate(`/user/${username}/list`)}
                        sx={{
                            paddingTop: "8px", 
                            fontSize: "13px", 
                            fontWeight: 400, 
                            opacity: "80%",
                            "&:hover": {
                                color: palette.primary.dark,
                                cursor: "pointer",
                            },
                        }}>
                            View Full Booklist &#8680;
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
export default HomePage;