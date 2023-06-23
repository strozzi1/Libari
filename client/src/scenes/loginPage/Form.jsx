import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Snackbar,
    Alert
} from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {Formik} from "formik"
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLogin} from "../../state";
import DropZone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { BASE_URL } from "../../env";
import { useNotification } from "../../utils/useNotification";

const registerSchema = yup.object().shape({
    username: yup.string().required("required"),
    email: yup.string().required("required"),
    password: yup.string().required("required"),
    location: yup.string(),
    image: yup.string(),
})

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required")
})

const initialValuesRegister = {
    username:"", 
    email: "",
    password: "",
    location: "",
    image: ""
}

const initialValuesLogin = {
    email: "",
    password: ""
}

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType ==="register";
    const { displayNotificationAction } = useNotification();

    
    
    //TODO: MOVE THESE TO SEPARATE API FILE
    const register = async (values, onSubmitProps) => {
        
        //this allows us to send form info with image
        const formData = new FormData();
        for(let value in values){
            formData.append(value, values[value])
        }
        if(values.picture){
            formData.append('imagePath', values.picture.name);
        }
        /*for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }*/

        const savedUserResponse = await fetch(
            `${BASE_URL}/auth/register`,
            {
                method:"POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: formData
            }
        );

        if(!savedUserResponse.ok){
            const message = await savedUserResponse.json()
            console.log(message)
            displayNotificationAction({message: message.error, type: 'error'})
            return;
        }

        const savedUser = await savedUserResponse.json();
        
        onSubmitProps.resetForm();

        if (savedUser) {
            
            //setPageType("login");
            dispatch(
                setLogin({
                    user: savedUser.user,
                    token: savedUser.token,
                    list: []
                })
            )
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInUserResponse = await fetch(
            `${BASE_URL}/auth/login`,
            {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(values)
            }
        );
        
        if(!loggedInUserResponse.ok){
            const message = await loggedInUserResponse.json()
            console.log(message)
            displayNotificationAction({message: message.message, type: "error"})
            return;
        }

        const loggedIn = await loggedInUserResponse.json();
        onSubmitProps.resetForm();

        if(loggedIn){
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                    list: loggedIn.list.entries
                })
            );
            navigate("/home");
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        if(isLogin) await login(values, onSubmitProps);
        if(isRegister) await register(values, onSubmitProps);
    }

    return (
        <>
        <Formik 
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
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
                        {isRegister && (
                            <>
                                
                                <TextField
                                label="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name="username"
                                error={Boolean(touched.username) && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                sx={{gridColumn: "span 4"}}
                                />
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
                                        label="image"
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
                            </>
                        )}
                        <TextField
                            label="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            type="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{gridColumn: "span 4"}}
                        />
                        <TextField
                            label="password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{gridColumn: "span 4"}}
                        />
                    </Box>

                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0", 
                                p: "1rem", 
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": {color: palette.primary.main}
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register": "login");
                                resetForm()
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                }
                            }}
                        >
                            {isLogin ? "Don't have an account? Sign Up Here." : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
        {/*<Snackbar open={isRegisterError} autoHideDuration={6000} onClose={handleCloseRegisterError}>
            <Alert onClose={handleCloseRegisterError} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
        </Snackbar>*/}
        </>
    )

}

export default Form