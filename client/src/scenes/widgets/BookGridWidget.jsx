import { Grid, Paper, useTheme } from "@mui/material"
import WidgetWrapper from "../../components/WidgetWrapper"

const BookGridWidget = ({books}) => {
    //const {palette} = useTheme()
    //const primaryLight = palette.primary.light;
    

    if(!books[0]){
        return null
    }
    return (
        <WidgetWrapper>
            <Grid container spacing={1.0}>
                {books.filter(book => Boolean(book.photo)).map((book) => 
                <Grid item key={book._id} xs={4} lg={3} xl={2}>
                    <Paper  sx={{backgroundImage:`url(${book.photo || ''})`,backgroundSize:"cover", minHeight: "90px", position: "relative"}}>
                    </Paper>
                    
                </Grid>
                )}
            </Grid>
        </WidgetWrapper>
    )
}

export default BookGridWidget