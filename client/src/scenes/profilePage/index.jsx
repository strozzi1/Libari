import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar";
import BioWidget from "../widgets/BioWidget";
import BookGridWidget from "../widgets/BookGridWidget";
import UserUpdates from "../widgets/UserUpdates";
import UserWidget from "../widgets/UserWidget";
import { BASE_URL } from "../../env";
import WidgetWrapper from "../../components/WidgetWrapper";

const ProfilePage = () => {
    const params = useParams()
    const username = params.username
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    //const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [entries, setEntries] = useState([])

    const getUserData = async() => {
        const response = await fetch(`${BASE_URL}/user/${username}`,
            {
                method: "GET"
            });
        const data = await response.json();
        response.ok ? setUser(data) : setUser(null)
        
        console.log("DATA: ",data)
    }

    const getEntries = async() => {
        const response = await fetch(`${BASE_URL}/user/${username}/booklist`,
        {
            method: "GET"
        });
        const data = await response.json();
        setEntries(data.entries);
        console.log("Booklist: ",data)
    }

    useEffect(() => {
        getUserData()
        getEntries()
    },[params])

    if(!user){
        return (
            <Box>
                <Navbar />
                <WidgetWrapper>
                    <Typography>No such user "{username}" found...</Typography>
                </WidgetWrapper>
            </Box>
            
        )
    }

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
                    <Box>
                        <UserWidget username={username} />
                    </Box>
                    
                    <Box sx={{marginTop: 2}}>
                        <BioWidget user={user.user}/>
                    </Box>
                </Box>
                {/*Middle column */}
                <Box 
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                    maxWidth={isNonMobileScreens ? "42%" : undefined}
                >   
                    <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                    Recent Updates
                    </Typography>
                    <UserUpdates entries={entries}/>
                </Box>
                {/*Right column */}
                {isNonMobileScreens &&  (
                    <Box flexBasis='26%'>
                        <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                            Books in Progress
                        </Typography>
                        { entries &&
                        <BookGridWidget books={
                            entries.filter((entry)=> entry.status === 'Reading').map(entry => entry.book)
                        }/>
                        }
                    </Box>
                )}
            </Box>
        </Box>
    )
}
export default ProfilePage;