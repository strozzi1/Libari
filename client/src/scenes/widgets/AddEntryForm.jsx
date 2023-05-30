import { Box, Typography, MenuItem, Button, useMediaQuery, TextField, useTheme } from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import moment from "moment"
import {useSelector, useDispatch} from "react-redux"
import { useEffect, useState } from "react";
import { addNewEntry, deleteEntry, removeEntry, updateEntry } from "../../state";




const AddEntryForm = ({googleBook}) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const {palette} = useTheme();
    const token = useSelector((state) => state.token)
    const dispatch = useDispatch();
    const entriesInState = useSelector((state)=>state.entries)
    const [bookInList,setBookInList] = useState(entriesInState.filter((entry)=> googleBook.id === entry?.book?.googleId)[0])
    const bookData = {
        googleId: googleBook.id,
        title: googleBook.volumeInfo.title,
        author: googleBook.volumeInfo.authors?.toString(),
        photo: googleBook.volumeInfo.imageLinks?.thumbnail,
        pages: googleBook.volumeInfo.pageCount,
        released: googleBook.volumeInfo.publishedDate
    }
    
    const initialEntryValues = {
        review: bookInList ? bookInList.review : "",
        startDate: bookInList ? bookInList.startDate : undefined,
        endDate: bookInList ? bookInList.endDate : undefined,
        rating: bookInList ? bookInList.rating : 0,
        status: bookInList ? bookInList.status : 'Planning',
        page: bookInList ? bookInList.page : 0
    }

    useEffect(() => {
        setBookInList(entriesInState.filter((entry)=> googleBook.id === entry?.book?.googleId)[0])
    },[entriesInState])

    const addEntrySchema = yup.object().shape({
        review: yup.string().max(1000).nullable(true),
        startDate: yup.date().nullable(true).default(null).min(bookData.released || "1000-01-01", 
            "Start data can't be before publish date"),
        endDate: yup.date().nullable(true).default(null).min(
            yup.ref('startDate'),
            "End date can't be before start date"
            ),
        rating: yup.number().min(0).max(10).nullable(true),
        status: yup.string().oneOf(["Planning", "Completed", "Reading", "Dropped"]).nullable(false),
        page: yup.number().min(0).max(bookData.pages || 10000).typeError("Must be number").nullable(true)
    
    })

    /** if book is already in list, dispatch update instead */
    const handleSubmitEntry = (values, onSubmitProps) => {
        //console.log("Values: ",values, "Book Data: ", bookData, "Books in list: ", books, "Is book in list: ", Boolean(books.filter((book)=> book?.googleId === bookData.googleId)[0]))
        
        if (bookInList){
            console.log("book is in list already")
            dispatch(updateEntry({entry:{...values, _id: bookInList._id}, token}))
        } else {
            dispatch(addNewEntry({entry: values, book: bookData, token}))
            //use effect updates bookInList
        }
        
    }

    const handleDeleteEntry = (entry) => {
        console.log("Delete entry")
        dispatch(deleteEntry({entryId: entry._id, token}))
    }

    return (
        <Formik
            onSubmit={handleSubmitEntry}
            initialValues={initialEntryValues}
            validationSchema={addEntrySchema}
            >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        <Typography 
                        fontWeight="500" 
                        variant="h5" 
                        color={palette.primary.main}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        sx={{mb: "1.5rem", gridColumn: "span 4"}}>
                            {googleBook.volumeInfo.title}
                        </Typography>
                        <TextField select 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Rating"
                        value={values.rating || ''}
                        name="rating"
                        error={Boolean(touched.rating) && Boolean(errors.rating)}
                        helperText={touched.rating && errors.rating}
                        sx={{gridColumn: "span 2"}}
                        >
                            <MenuItem value={null}></MenuItem>
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </TextField>
                        <TextField select
                            label="status"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.status || ''}
                            name="status"
                            error={Boolean(touched.status) && Boolean(errors.status)}
                            helperText={touched.status && errors.status}
                            sx={{gridColumn: "span 2"}}
                        >
                            <MenuItem value={"Planning"}>Planning</MenuItem>
                            <MenuItem value={"Reading"}>Reading</MenuItem>
                            <MenuItem value={"Completed"}>Completed</MenuItem>
                            <MenuItem value={"Dropped"}>Dropped</MenuItem>
                        </TextField>
                        
                        <TextField
                            type="number"
                            value={values.page || ''}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="page"
                            label="Page"
                            error={Boolean(touched.page) && Boolean(errors.page)}
                            helperText={touched.page && errors.page}
                            sx={{gridColumn: "span 2"}}
                        >
                        </TextField>
                        <TextField
                        multiline
                        value={values.review || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="review"
                        label="Review"
                        error={Boolean(touched.review) && Boolean(errors.review)}
                        helperText={touched.review && errors.review}
                        sx={{gridColumn: "span 4",}}
                        maxRows={4}
                        >
                        </TextField>
                        {/* TODO: Change from text fields to DatePicker */}
                        <TextField
                            type="date"
                            InputLabelProps={{shrink: true}}
                            value={values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : undefined}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="startDate"
                            label="Start Date"
                            error={Boolean(touched.startDate) && Boolean(errors.startDate)}
                            helperText={touched.startDate && errors.startDate}
                            sx={{gridColumn: "span 2"}}
                        >
                        </TextField>
                        <TextField
                            type="date"
                            InputLabelProps={{shrink: true}}
                            value={values.endDate ? moment(values.endDate).format("YYYY-MM-DD"): undefined}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="endDate"
                            label="End Date"
                            error={Boolean(touched.endDate) && Boolean(errors.endDate)}
                            helperText={touched.endDate && errors.endDate}
                            sx={{gridColumn: "span 2"}}
                        >
                        </TextField>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "0.4rem 0", 
                                p: ".4rem", 
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": {color: palette.primary.main},
                                gridColumn: "span 1"
                            }}
                        >
                            Submit
                        </Button>
                        {//Display Delete button only if the book isn't already in book list */
                        bookInList &&
                        <Button
                            fullWidth
                            type="button"
                            onClick={() => handleDeleteEntry(bookInList)}
                            sx={{
                                m: "0.4rem 0", 
                                p: ".4rem", 
                                backgroundColor: palette.neutral.main,
                                color: palette.background.alt,
                                "&:hover": {
                                    color: "#FFFFFF",
                                    backgroundColor:"#FA2600"
                                },
                                gridColumn: "4",
                                justifySelf:"end"
                            }}
                        >
                            Delete
                        </Button>
                        }
                    </Box>
                </form>
            )}

        </Formik>
    )
}

export default AddEntryForm