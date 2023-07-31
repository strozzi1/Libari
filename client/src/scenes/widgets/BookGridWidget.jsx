import { Grid, Paper, Typography, useTheme } from "@mui/material"
import WidgetWrapper from "../../components/WidgetWrapper"
import { useNavigate } from "react-router-dom";

const BookGridWidget = ({books}) => {
    //const {palette} = useTheme()
    const navigate = useNavigate();
    const currentlyReading = books.filter(book => Boolean(book.photo));
    //const primaryLight = palette.primary.light;
    
    const bookLink = (book) => {
        navigate(`/book/${book.googleId}`, {
            state: {
                bookData: book
            }
        })
    }

    if(!currentlyReading[0]){
        return (
            <WidgetWrapper>
                <Typography style={{paddingBottom:"8px", fontSize:"13px", fontWeight: 500, opacity: "80%"}}>
                    Looking pretty empty...
                </Typography>
            </WidgetWrapper>
        )
    }

    return (
        <WidgetWrapper>
            <Grid container spacing={1.0}>
                {books.filter(book => Boolean(book.photo)).map((book) => 
                <Grid item key={book._id} xs={4} lg={3} xl={2}>
                    <Paper 
                    onClick={()=>bookLink(book)}
                    sx={{
                        backgroundImage:`url(${book.photo || ''})`,
                        backgroundSize:"cover", 
                        minHeight: "90px", 
                        position: "relative",
                        "&:hover": {
                            cursor: "pointer",
                        }
                    }}>
                    </Paper>
                    
                </Grid>
                )}
            </Grid>
        </WidgetWrapper>
    )
}

export default BookGridWidget