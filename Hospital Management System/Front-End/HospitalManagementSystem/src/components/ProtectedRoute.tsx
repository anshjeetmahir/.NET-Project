
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const role = useAuthStore((s) => s.role);

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {

        return <Navigate to="/not-authorized" replace />;
    }


    return <Outlet />;
};

export default ProtectedRoute;
