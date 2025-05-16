// components/notauthorized/NotAuthorizedContent.tsx
import { Box, Typography, Button } from "@mui/material";

interface NotAuthorizedContentProps {
    handleGoHome: () => void;
}

const NotAuthorizedContent: React.FC<NotAuthorizedContentProps> = ({ handleGoHome }) => {
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
                403
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
                You’re not authorized
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                You do not have permission to view this page.
            </Typography>
            <Button variant="contained" onClick={handleGoHome}>
                Go back to Home
            </Button>
        </Box>
    );
};

export default NotAuthorizedContent;
