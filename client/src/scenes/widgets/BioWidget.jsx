import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";


const BioWidget = ({user}) =>{
    const {palette} = useTheme()
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium

    if(!user){
        return null
    }

    return (
        <WidgetWrapper>
            <Typography
                variant="h5"
                color={dark}
                fontWeight="500"
                sx={{
                    "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                    },
                }}
            > 
            Bio
            </Typography>
            <Typography color={medium}>{user.bio}</Typography>
        </WidgetWrapper>
    )
}

export default BioWidget;