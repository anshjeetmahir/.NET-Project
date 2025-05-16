
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import LogoutContainer from "../../components/logout/LogoutContainer";

const Logout = () => {
    const { isAuthenticated, userName, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <LogoutContainer
            isAuthenticated={isAuthenticated}
            username={userName}
            handleLogout={handleLogout}
            navigateToLogin={() => navigate("/")}
        />
    );
};

export default Logout;
