import { useState } from "react";
import { 
    Box, 
    IconButton, 
    InputBase, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    useTheme, 
    useMediaQuery, 
    Button
} from "@mui/material";
import {
    Search,
    DarkMode,
    LightMode,
    Menu,
    Close
} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {setMode, setLogout} from "../../state";
import {useNavigate} from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const userName = `${user?.username}`

    const handleLogout= () => {
        dispatch(setLogout())
        navigate("/home")
    }

    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography 
                fontWeight="bold" 
                fontSize="clamp(1rem, 2rem, 2.25rem)" 
                color="primary" 
                onClick={() => navigate("/home")}
                sx={{
                    "&:hover" : {
                        color: primaryLight,
                        cursor: "pointer"
                    }
                }}>
                    Libari
                </Typography>
                {isNonMobileScreens && (
                <FlexBetween
                    backgroundColor={neutralLight}
                    borderRadius="9px"
                    gap="3rem"
                    padding="0.1rem 1.5rem">
                    
                    <InputBase placeholder="Search..." />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
                )}
            </FlexBetween>

            {/** DesktopNav */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{fontSize: "25px"}} />
                        ) : (
                            <LightMode sx={{color: dark, fontSize: "25px"}} />
                        )}
                    </IconButton>
                    { user ?
                    <FormControl variant="standard" value={userName}>
                        <Select 
                            value={userName} 
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem"
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight
                                }
                            }}
                            input={<InputBase/>}
                        >
                            <MenuItem value={userName}>
                                <Typography>{userName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                        </Select>
                    </FormControl>
                    :
                    <Button onClick={()=> navigate("/home")}>Log In</Button>
                    }
                </FlexBetween>
            ) : (
                <IconButton 
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu/>
                </IconButton>
            )}

            {/** Mobile Nav */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="200px"
                    backgroundColor={background}>
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                                <Close />
                            </IconButton>
                    </Box>
                    
                    {/* MENU ITEMS */}
                    <FlexBetween 
                        display="flex" 
                        flex-direction="column" 
                        justifyContent="center"
                        alignItems="center" 
                        gap="1rem"
                    >
                        <IconButton 
                            onClick={() => dispatch(setMode())}
                            sx={{fontSize: "25px"}}>
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{fontSize: "25px"}} />
                            ) : (
                                <LightMode sx={{color: dark, fontSize: "25px"}} />
                            )}
                        </IconButton>
                    <FormControl variant="standard" value={userName}>
                        <Select 
                            value={user ? userName : "Log in"} 
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem"
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight
                                }
                            }}
                            input={<InputBase/>}>
                            {user ? 
                            [
                                <MenuItem value={userName} key="userName">
                                    <Typography>{userName}</Typography>
                                </MenuItem>,
                                <MenuItem onClick={() => handleLogout()} key="Logout">Logout</MenuItem>
                            ]
                            : <MenuItem value="Log in" onClick={()=> navigate("/home")}><Typography>Log in</Typography></MenuItem>
                            }   
                        </Select>
                    </FormControl>
                </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    )
}
export default Navbar;