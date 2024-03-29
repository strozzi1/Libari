import {
    ManageAccountsOutlined,
    LocationOnOutlined,
    PersonAddOutlined,
    PersonRemoveOutlined,
} from '@mui/icons-material'
import { Box, Typography, Divider, useTheme, IconButton, Modal, useMediaQuery } from '@mui/material'
import UserImage from '../../components/UserImage'
import FlexBetween from '../../components/FlexBetween'
import WidgetWrapper from '../../components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addRemoveFollowing } from "../../state";
import EditUserForm from './EditUserForm'
import { BASE_URL } from '../../env'
//const followingSig = signal([])

const UserWidget = ({username}) => {
    const [user, setUser] = useState(null);
    //rename follows -> authedUserFollowing, setAuthedUserFollowing
    const [follows, setFollows] = useState([])
    const [followingBool, setFollowingBool] = useState(false)
    const [isEditModal, setIsEditModal] = useState(false)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const loggedInUser = useSelector((state) => state.auth.user)
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main
    //const neutralLight = palette.neutral.light;
    const modalStyle = {
        position: 'absolute',
        top: useMediaQuery("(min-width:600px)") ? '50%' : '60%',
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

    const getUser = async () => {
        
        const response = await fetch(`${BASE_URL}/user/${username}`,
        {
            method: "GET",
            //headers: { Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        setUser(data.user);
        setFollowingBool(loggedInUser?.following?.includes(data.user?._id))
    }

    const handleAddRemove = async () => {
        //check if is in list
        if(follows?.includes(user._id)){
            await fetch(`${BASE_URL}/user/unfollowUser`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    userId: user._id
                }),

            })
            .then(dispatch(addRemoveFollowing({id: user._id})))
            .then(setFollows(follows.filter((id)=> id!== user._id)))
            .then(user.followers = user.followers.filter((id)=> id!== loggedInUser._id))
            .then(setFollowingBool(false))
            .catch((error)=> console.log(error))
            
        } else {
            
            await fetch(`${BASE_URL}/user/followUser`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    userId: user._id
                }),

            })
            .then(dispatch(addRemoveFollowing({id: user._id})))
            .then(setFollows(follows=>[...follows, user._id]))
            .then(user.followers.push(loggedInUser._id))
            .then(setFollowingBool(true))
            .catch((error) => console.log(error))
            
        }
        
    }

    useEffect(() => {
        getUser();
        setFollows(loggedInUser?.following)
        //can set dependency array to hold loggedInUser
    }, [username]) //eslint-disable-line react-hooks/exhaustive-deps

    //TODO: Handle loading state
    if(!user){
        return null;
    }

    const {
        location,
        image,
        //bio,
        followers,
        following,
        //role
    } = user;

    return (
        <WidgetWrapper>
            <Modal open={isEditModal} onClose={() => setIsEditModal(false)} sx={{overflow: "scroll", bgcolor: "rgba(0, 0, 0, 0.6)"}} >
                <Box sx={modalStyle} width={ isNonMobileScreens ? "50%" : "93%"}><EditUserForm user={user}/></Box>
            </Modal>
        <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
        >
        <FlexBetween gap="1rem" onClick={() => navigate(`/user/${username}`)}>
            <UserImage imageUrl={image} />
            <Box>
            <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                    "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                    },
                }}
            >
                {username}
            </Typography>
            <Typography minWidth="70px" color={medium}>{followers.length} followers</Typography>
            <Typography color={medium}>{following.length} following</Typography>
        </Box>
        
        </FlexBetween>
        
            {loggedInUser && (user?._id ===loggedInUser?._id  ? 
                <IconButton onClick={()=> setIsEditModal(true)}>
                    <ManageAccountsOutlined/>
                </IconButton> 
                : 
                <IconButton onClick={()=> handleAddRemove()}>
                    {followingBool ? 
                    <PersonRemoveOutlined/> 
                    : 
                    <PersonAddOutlined/>
                    }
                </IconButton>
            )}
        
    </FlexBetween>
    
    <Divider />

      {/* SECOND ROW */}
    <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
        </Box>
        
    </Box>
    </WidgetWrapper>
    )


}


export default UserWidget;