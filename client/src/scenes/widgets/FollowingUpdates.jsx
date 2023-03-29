import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import useThrottle from "../../utils/useThrottle";
import RecentUpdate from "./RecentUpdate";

const FollowingUpdates = () => {
    const token = useSelector((state)=> state.token)
    const [hasQueried, setHasQueried] = useState(false)
    const [updatesList, setUpdatesList] = useState([])
    const fetchUpdates = async() => {
        try {
            const response = await fetch(`http://localhost:5001/entry/getUpdates`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            })
            const searchResults = await response.json();
            setUpdatesList(response.ok ? searchResults.entries : [])
        } catch (error) {
            setUpdatesList([])
            console.log(error)
        }
    }

    useEffect(() => {
        if(!hasQueried){
            fetchUpdates()
            setHasQueried(true)
        }
    }, [])

    if(!updatesList[0]){
        return (
            null
        )
    }

    return (
        
        <Grid spacing={1.0} container>
        {updatesList.map((currEntry) =>
        <Grid key={currEntry._id} item xs={12}>
            <RecentUpdate entry={currEntry}/>
        </Grid>
        )}
        </Grid>
    )
}

export default FollowingUpdates;