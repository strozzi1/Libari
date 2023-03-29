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
                <Grid item key={book._id} xs={4}>
                    <Paper  sx={{backgroundImage:`url(${book.photo || ''})`,backgroundSize:"cover", minHeight: "90px", position: "relative"}}>
                        {/* BELOW is experimental
                        <div style={{position: "absolute", borderRadius: "0 0 3px 3px", display:"inline-block", color:primaryLight, left:0, bottom: 0, width:"100%", height:"30px", backgroundColor: "rgba(0,0,0,0.5)", textAlign: "center"}}></div>*/}
                    </Paper>
                    
                </Grid>
                )}
            </Grid>
        </WidgetWrapper>
    )
}

export default BookGridWidget