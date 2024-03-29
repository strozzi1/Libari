import { Formik } from "formik"
import * as yup from "yup";
import { Box, Button, Modal, TextField, Typography, Alert, Snackbar, useMediaQuery, useTheme } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DropZone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { updateUsername } from "../../state";
import { BASE_URL } from "../../env";
import { useState } from "react";
import { setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/useNotification";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: "9px",
    width: '50%',
    boxShadow: 24,
    textAlign: 'center',
    p: 4,
    outline: 0,
    border: "none",
    "&:focus": {
        outline: 0,
        border: "none"
    }
}

const EditUserForm = ({user}) => {
    const {palette} = useTheme()
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token)
    const navigate = useNavigate();
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    //const [isMessage, setIsMessage] = useState(false);
    //const [message, setMessage] = useState({message: "", severity: ""});
    const { displayNotificationAction } = useNotification();

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
    
    //TODO: make this into a redux action
    const handleSubmitUsername = async (values, onSubmitProps) => {
        console.log(values)
        const updatedUserResponse = await fetch(
            `${BASE_URL}/user/updateUsername`,
            {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(values)
                
            }
        );

        if(!updatedUserResponse.ok){
            const {message} = await updatedUserResponse.json()
            console.log(message)
            //handleUpdateMessage({message: message, severity: "error"})
            displayNotificationAction({ message: message, type: "error" })
            return;
        }
        //align the current state data with this new data 
        //so that the site doesn't display stale data
        dispatch(updateUsername({username: values.username}))
        displayNotificationAction({message: `Successfully updated username to ${values.username}`, type: "success"})
    }

    //works
    const handleSubmitPassword = async (values, onSubmitProps) => {
        values._id = user._id
        console.log(values)
        
        //updatePassword
        const updatedPasswordResponse = await fetch(
            `${BASE_URL}/user/updatePassword`,
            {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(values)
            }
        );
        
        if(!updatedPasswordResponse.ok){
            const {message} = await updatedPasswordResponse.json()
            console.log(message)
            displayNotificationAction({message: message, type: "error"})
            return;
        }
        displayNotificationAction({message: `Successfully updated password`, type: "success"})
    
    }

    const handleSubmitProfile = async (values, onSubmitProps) => {
        const formData = new FormData();
        //Allows us to send image
        for(let value in values){
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture?.name);
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }

        const updatedUserResponse = await fetch(
            `${BASE_URL}/user/updateProfile`,
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

        if(!updatedUserResponse.ok){
            const message = await updatedUserResponse.json()
            console.log(message)
            displayNotificationAction({message: message, type: "error"})
            return;
        }

        
        displayNotificationAction({message: `Successfully updated profile`, type: "success"})
        
        //align the current state data with this new data 
        //so that the site doesn't display stale data
        const data = await updatedUserResponse.json();
    }


    const handleDeleteAccount = async () => {
        const deleteUserResponse = await fetch(
            `${BASE_URL}/user/${user.username}`,
            {
                method:"DELETE",
                headers: {
                    //"Content-Type": "multipart/form-data",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`
                },
            }
        );

        if(!deleteUserResponse.ok){
            const message = await deleteUserResponse.json()
            console.log(message)
            displayNotificationAction({message: message.message, type: "error"})
            return;
        }
        dispatch(setLogout());
        navigate("/home");
        
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
                        paddingTop="10px"
                        fontWeight="500" 
                        variant="h5" 
                        color={palette.primary.main}
                        sx={{mb: "1.5rem", gridColumn: isNonMobile ? "span 3" : "span 2"}}>
                            {user.username}
                        </Typography>

                        <Button
                            onClick={()=>setIsDeleteModal(true)}
                            sx={{
                                m: "0.4rem 0", 
                                p: ".4rem", 
                                backgroundColor: palette.neutral.medium,
                                color: palette.background.alt,
                                "&:hover": {backgroundColor: 'red'},
                                gridColumn: isNonMobile ? "span 1" : "span 2"
                            }}
                        >Delete Account</Button>

                        <Modal open={isDeleteModal} onClose={()=>setIsDeleteModal(false)}>
                            <Box sx={modalStyle}>
                                    <Typography
                                        fontWeight="500" 
                                        variant="h5" 
                                        color={palette.primary.main}
                                        sx={{mb: "1.5rem", gridColumn: "span 3"}}
                                    >Are you sure?</Typography>
                                    <Button
                                        onClick={handleDeleteAccount}
                                        sx={{
                                            m: "0.4rem 0", 
                                            p: ".4rem", 
                                            backgroundColor: palette.neutral.medium,
                                            color: palette.background.alt,
                                            "&:hover": {backgroundColor: 'red'},
                                            gridColumn: "span 1"
                                        }}
                                    >Delete</Button>
                            </Box>
                        </Modal>
                        
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
                                gridColumn: isNonMobile ? "span 2" : "span 4"
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
                                gridColumn: isNonMobile ? "span 2" : "span 4"
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