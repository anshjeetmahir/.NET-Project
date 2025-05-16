import { Typography, Button } from "@mui/material";

interface LogoutContentProps {
    isAuthenticated: boolean;
    username: string | null;
    handleLogout: () => void;
    navigateToLogin: () => void;
}

const LogoutMessage: React.FC<LogoutContentProps> = ({
    isAuthenticated,
    username,
    handleLogout,
    navigateToLogin,
}) => {
    return isAuthenticated ? (
        <>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "green" }}>
                ✅ You are already logged in!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                Welcome, <strong>{username ?? "Guest"}</strong>.
            </Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleLogout}>
                Logout
            </Button>
        </>
    ) : (
        <>
            <Typography variant="h5" color="error">
                ❌ Not Logged In
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={navigateToLogin}>
                Go to Login
            </Button>
        </>
    );
};

export default LogoutMessage;
