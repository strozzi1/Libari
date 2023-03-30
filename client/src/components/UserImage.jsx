import { Avatar, Box } from "@mui/material"
import { height } from "@mui/system";

const UserImage = ({ imageUrl, size = "60px"}) => {

    if(!imageUrl){
        return (
            <Box width={size} height={size}>
                <Avatar sx={{height: size, width: size}}></Avatar>
            </Box>
        )
    }

    return (
        <Box width={size} height={size}>
            <img
                style={{objectFit: "cover", borderRadius: "50%"}}
                width={size}
                height={size}
                alt="user"
                src={imageUrl}
            />
        </Box>
    );
}

export default UserImage;