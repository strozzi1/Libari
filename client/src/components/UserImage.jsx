import { Box } from "@mui/material"

const UserImage = ({ imageUrl, size = "60px"}) => {
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