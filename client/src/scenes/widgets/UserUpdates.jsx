import { Grid } from "@mui/material"
import RecentUpdate from "./RecentUpdate"

const UserUpdates = ({entries}) => {

    if(!entries[0]){
        return (
            null
        )
    }

    console.log(entries)
    return (
        <Grid spacing={1.0} container>
        {entries.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((currEntry) =>
        <Grid key={currEntry._id} item xs={12}>
            <RecentUpdate entry={currEntry}/>
        </Grid>
        )}
        </Grid>
    )
}

export default UserUpdates;