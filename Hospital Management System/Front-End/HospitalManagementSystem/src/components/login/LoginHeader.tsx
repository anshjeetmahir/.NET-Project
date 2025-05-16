import { Avatar, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginHeader = () => {
    return (
        <>
            <Avatar sx={{ mx: "auto", bgcolor: "secondary.main", mb: 1 }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" align="center">
                Log In
            </Typography>
        </>
    );
};

export default LoginHeader;
