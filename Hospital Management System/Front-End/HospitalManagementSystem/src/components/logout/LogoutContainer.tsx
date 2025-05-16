
import { Card, CardContent } from "@mui/material";
import LogoutContent from "../../components/logout/LogoutMessage";

interface LogoutContainerProps {
    isAuthenticated: boolean;
    username: string | null;
    handleLogout: () => void;
    navigateToLogin: () => void;
}

const LogoutContainer: React.FC<LogoutContainerProps> = ({
    isAuthenticated,
    username,
    handleLogout,
    navigateToLogin,
}) => {
    return (
        <Card sx={{ maxWidth: 450, margin: "auto", mt: 5, p: 3, textAlign: "center", boxShadow: 3 }}>
            <CardContent>
                <LogoutContent
                    isAuthenticated={isAuthenticated}
                    username={username ?? ""}
                    handleLogout={handleLogout}
                    navigateToLogin={navigateToLogin}
                />
            </CardContent>
        </Card>
    );
};

export default LogoutContainer;
