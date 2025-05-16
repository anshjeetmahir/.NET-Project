
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import NotFoundContent from "../../components/notfound/NotFoundContent";

const NotFound = () => {
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
            <NotFoundContent handleGoHome={handleGoHome} />
        </Container>
    );
};

export default NotFound;
