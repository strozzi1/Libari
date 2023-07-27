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
            <Navbar page="booklist"/>
            <Box
                width="100%"
                padding="2rem 6%"
                //display={isNonMobileScreens ? "flex" : "block"}
                display="flex"
                flexDirection={isNonMobileScreens ? "row" : "column"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                {/*Left column */}
                <Box order={ isNonMobileScreens ?  0 : 1} flexBasis={isNonMobileScreens ? "70%" : undefined}>
                    <ListWidget username={params.username}/>

                </Box>
                {/*Right Column */}
                <Box 
                    order={isNonMobileScreens ?  1 : 0}
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