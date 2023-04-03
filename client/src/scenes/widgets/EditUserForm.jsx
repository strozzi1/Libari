import { Formik } from "formik"
import * as yup from "yup";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DropZone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { useSelector } from "react-redux";


const EditUserForm = ({user}) => {
    const {palette} = useTheme()
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const token = useSelector((state) => state.token)

    const initialUsernameValues = {
        username: user.username || ""
    }

    const initialPasswordValues = {
        password: "",
    }

    const initialProfileValues = {
        bio: user.bio,
        location: user.location,
        image: "",
    }

    const editUsernameSchema = yup.object().shape({
        username: yup.string().max(40),
    })

    const editPasswordSchema = yup.object().shape({
        password: yup.string().min(4).max(40),
    })

    const editProfileSchema = yup.object().shape({
        bio: yup.string().max(400),
        location: yup.string(),
        image: yup.string()
    })

    const handleSubmitUsername = (values, onSubmitProps) => {
        console.log(values)
        //dispatch()
    }

    const handleSubmitPassword = (values, onSubmitProps) => {
        console.log(values)
    }

    const handleSubmitProfile = async (values, onSubmitProps) => {
        const formData = new FormData();
        //const plainFormData = Object.fromEntries(formData.entries());
	    
        for(let value in values){
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture?.name);
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }

        const updatedUserResponse = await fetch(
            "http://localhost:5001/user/updateProfile",
            {
                method:"PATCH",
                headers: {
                    //"Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`
                },
                //body: JSON.stringify(values)
                body: formData
            }
        );
        const data = await updatedUserResponse.json();
        console.log("update user res.data: ", data)
    }

    return (
        <>
        <Formik
            onSubmit={handleSubmitUsername}
            initialValues={initialUsernameValues}
            validationSchema={editUsernameSchema}
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
                        marginBottom="30px"
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
                        sx={{mb: "1.5rem", gridColumn: "span 4"}}>
                            {user.username}
                        </Typography>
                        
                        <TextField
                        value={values.username || ''}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="username"
                        label="Username"
                        error={Boolean(touched.username) && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        sx={{gridColumn: "span 2",}}
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
                                gridColumn: "span 2"
                            }}
                        >
                            Update Username
                        </Button>
                    </Box>
                </form>
            )}

        </Formik>

        {/*Update Password */}
        <Formik
            onSubmit={handleSubmitPassword}
            validationSchema={editPasswordSchema}
            initialValues={initialPasswordValues}
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
                        marginBottom="30px"
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        
                        <TextField
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="password"
                        label="Password"
                        type="password"
                        error={Boolean(touched.password) && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{gridColumn: "span 2",}}
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
                                gridColumn: "span 2"
                            }}
                        >
                            Update Password
                        </Button>
                    </Box>
                </form>
            )}

        </Formik>

        {/* UPDATE PROFILE CONTENT */}
        <Formik
            onSubmit={handleSubmitProfile}
            validationSchema={editProfileSchema}
            initialValues={initialProfileValues}
            >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue
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
                        
                        <TextField
                        multiline
                        maxRows={4}
                        value={values.bio}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="bio"
                        label="Bio"
                        error={Boolean(touched.bio) && Boolean(errors.bio)}
                        helperText={touched.bio && errors.bio}
                        sx={{gridColumn: "span 4",}}
                        >
                        </TextField>

                        <TextField
                            label="location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location"
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                            sx={{gridColumn: "span 4"}}
                        />
                        <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                        >
                            <DropZone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) => 
                                    setFieldValue("picture", acceptedFiles[0])
                                }
                            >
                                {({ getRootProps, getInputProps}) => (
                                    <Box 
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{ "&:hover": { cursor: "pointer"}}}
                                    >
                                        <input {...getInputProps()} />
                                        {!values.picture ? 
                                            (
                                                <p>Add Picture Here</p>
                                            ) : (
                                                <FlexBetween>
                                                    <Typography>{values.picture.name}</Typography>
                                                    <EditOutlinedIcon/>
                                                </FlexBetween>
                                            )
                                        }
                                    </Box>
                                )}
                            </DropZone>
                        </Box>

                        
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "0.4rem 0", 
                                p: ".4rem", 
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": {color: palette.primary.main},
                                gridColumn: "span 4"
                            }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </form>
            )}

        </Formik>
        </>
    )
}

export default EditUserForm