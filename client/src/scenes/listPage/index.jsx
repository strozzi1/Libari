import {Box, useMediaQuery } from "@mui/material";


import Navbar from "../navbar";
import { useParams } from "react-router-dom";
import UserWidget from "../widgets/UserWidget";
import ListWidget from "../widgets/ListWidget";


const ListPage = () => {
    const params = useParams()
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
                {/*Right Column */}
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