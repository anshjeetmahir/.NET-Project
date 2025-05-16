import { Box, Typography, Button } from "@mui/material";

interface NotFoundContentProps {
    handleGoHome: () => void;
}

const NotFoundContent: React.FC<NotFoundContentProps> = ({ handleGoHome }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh",
                textAlign: "center",
            }}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary">
                Page not found
            </Typography>
            <Typography variant="body1" color="textSecondary" >
                The page you are looking for does not exist or has been moved.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go back to Home
            </Button>
        </Box>
    );
};

export default NotFoundContent;
