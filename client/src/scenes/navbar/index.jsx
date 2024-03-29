import { useEffect, useState } from "react";
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
    Button,
    Input,
    Modal
} from "@mui/material";
import {
    Search,
    DarkMode,
    LightMode,
    Menu,
    Close,
    Clear
} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {setMode, setLogout} from "../../state";
import {useLocation, useNavigate} from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import useDebounce from "../../utils/useDebounce";
import SearchResults from "./SearchResults";
import jwtDecode from "jwt-decode";

const Navbar = ({page = "home"}) => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const [isSearchModal, setIsSearchModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state)=> state.auth.token)
    const location = useLocation();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const modalStyle = {
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: "9px",
        boxShadow: 24,
        p: 4,
        outline: 0,
        border: "none",
        "&:focus": {
            outline: 0,
            border: "none"
        }
    };


    const userName = `${user?.username}`;
    const debouncedSearchTerm = useDebounce(searchText, 500);

    const handleLogout = () => {
        dispatch(setLogout())
        navigate("/home")
    }
    const handleOpenSearchModal = () => {
        setIsSearchModal(true)
    }
    const handleCloseSearchModal = () => {
        setIsSearchModal(false)
        setSearchText(null)
    }

    const handleSearchText = (e) => {
        setSearchText(e.target.value)
    }

    const handleKeydown = (e) => {
        if(e.key === "Escape"){
            handleCloseSearchModal()
        }
    }

    useEffect(() => {
        
        handleCloseSearchModal()
        if(token) {
            const decoded = jwtDecode(token);
            if(decoded.exp * 1000 < new Date().getTime()) {
                handleLogout()
            }
        }

        window.addEventListener('keydown', handleKeydown, {
            passive: true
        });

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [location]);



    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            {/* MODAL CONTENT */}
            <Modal 
                sx={{overflow: "scroll", bgcolor: "rgba(0, 0, 0, 0.6)"}} 
                open={isSearchModal} 
                onClose={handleCloseSearchModal} 
                disableEnforceFocus>
                <>
                <Input
                    type="text"
                    name="title"
                    id="search"
                    placeholder="Search Books and Users..."
                    autoComplete="off"
                    onChange={handleSearchText} 
                    style={modalStyle}
                    sx={{
                        backgroundColor: neutralLight,
                        p: "1.0rem",
                        width: "70%",
                        paddingLeft: "13px"
                    }}
                    disableUnderline
                    startAdornment={<Search/>}
                    
                    endAdornment={<Clear sx={{cursor: "pointer",}} onClick={()=> handleCloseSearchModal()}/>}
                >
                </Input>  
                    {debouncedSearchTerm &&
                    <SearchResults searchText={debouncedSearchTerm} />
                    }
                </>
            </Modal>
            {/* END OF MODAL CONTENT */}

            <FlexBetween gap="1.0rem">
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
                {true/*isNonMobileScreens*/ && (
                <FlexBetween
                    backgroundColor={neutralLight}
                    borderRadius="9px"
                    style={{
                        transition: "border-radius 0.5s"
                    }}
                    sx={{
                        "&:hover": {
                            borderRadius: "50%",
                        }
                    }}
                    >
                    {/*<InputBase placeholder="Search..." />*/}
                    <IconButton aria-label="Search" onClick={()=> handleOpenSearchModal()}>
                        <Search fontWeight="bold" fontSize="medium"/>
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
                            value={page} 
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
                            <MenuItem value="home" key="home" onClick={() => navigate("/home")}>
                                <Typography>{userName}</Typography>
                            </MenuItem>
                            <MenuItem value="profile" key="profile" onClick={() => navigate(`/user/${userName}`)}>Profile</MenuItem>
                            <MenuItem value="booklist" key="booklist" onClick={() => navigate(`/user/${userName}/list`)}>Booklist</MenuItem>
                            <MenuItem key="logout" onClick={() => handleLogout()}>Logout</MenuItem>
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
                            value={user ? page : "Log in"} 
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
                                <MenuItem key="home" value="home" onClick={()=>navigate("/home")}>
                                    <Typography>{userName}</Typography>
                                </MenuItem>
                                ,
                                <MenuItem key="profile" value="profile" onClick={() => navigate(`/user/${userName}`)}>Profile</MenuItem>,
                                <MenuItem key="booklist" value="booklist" onClick={() => navigate(`/user/${userName}/list`)} >Booklist</MenuItem>,
                                <MenuItem key="logout" onClick={() => handleLogout()}>Logout</MenuItem>
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