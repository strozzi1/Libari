import { Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import RecentUpdate from "./RecentUpdate";
import { BASE_URL } from "../../env";
import useThrottle from "../../utils/useThrottle";

const FollowingUpdates = () => {
    const token = useSelector((state)=> state.auth.token)
    //for first query
    const [hasQueried, setHasQueried] = useState(false)
    const [updatesList, setUpdatesList] = useState([])
    //for infinite scroll
    const [isFetching, setIsFetching] = useState(true);
    const pageCount = useRef(1)
    const page = useRef(1);
    

    const fetchUpdates = async () => {
        
        try {
            const response = await fetch(`${BASE_URL}/entry/getUpdates?page=${page.current}&pageSize=${10}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            })
            if(response.ok){
                const searchResults = await response.json();
                pageCount.current = searchResults.totalPages
                //setUpdatesList(response.ok ? (prevState)=> [...prevState, ...Array.from(searchResults.entries)] :(prevState) => [...prevState])
                
                return Array.from(searchResults.entries)
            } else {
                return []
            }
        } catch (error) {
            //setUpdatesList([])
            console.log(error)
            return [];
        };
    };

    //infinite
    const handlePageBottom = () => {
        if(pageCount.current === page.current){
            return;
        }
        setIsFetching(true)
        page.current = page.current + 1;
        const nextPage = fetchUpdates()
        nextPage.then((array) => {
            setUpdatesList((prevState)=> [...prevState, ...array]);
            setIsFetching(false)
        })

    }

    const throttleHandleBottom = useThrottle(handlePageBottom, 500)
    
    const handleScroll = () => {
        
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
    
        if (bottom) {
            
            //handlePageBottom()
            throttleHandleBottom();
            
        }
    };


    useEffect(() => {
        if(!hasQueried){
            const initialFetch = fetchUpdates()
            initialFetch.then((array)=> {
                setUpdatesList(array);
                setIsFetching(false)
            })
            setHasQueried(true)
        }

        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
    

    //Render Logic
    if(!updatesList[0]){
        return (
            null
        )
    }

    return (
        <>
        <Grid spacing={1.0} container>
            {updatesList.map((currEntry) =>
                <Grid 

                sx={{overflow: "hidden", textOverflow: "ellipsis"}}
                key={currEntry._id} item xs={12}>
                    <RecentUpdate entry={currEntry} />
                </Grid>
            )}
        </Grid>
        {isFetching && <Typography>Loading...</Typography>}
        </>
    )
}

export default FollowingUpdates;