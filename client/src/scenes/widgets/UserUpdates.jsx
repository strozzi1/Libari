import { Grid } from "@mui/material"
import RecentUpdate from "./RecentUpdate"

const UserUpdates = ({entries}) => {


    return (
        
        <Grid spacing={1.0} container>
        {entries.map((currEntry) =>
        <Grid key={currEntry._id} item xs={12}>
            <RecentUpdate entry={currEntry}/>
        </Grid>
        )}
        </Grid>
    )
}

export default UserUpdates;