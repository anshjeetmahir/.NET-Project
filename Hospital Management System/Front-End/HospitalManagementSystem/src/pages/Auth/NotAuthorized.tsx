// pages/Auth/NotAuthorized.tsx
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import NotAuthorizedContent from "../../components/notauthorized/NotAuthorizedContent";

const NotAuthorized = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleGoHome = () => {

        logout();
        sessionStorage.clear();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <Container maxWidth="md">
            <NotAuthorizedContent handleGoHome={handleGoHome} />
        </Container>
    );
};

export default NotAuthorized;
