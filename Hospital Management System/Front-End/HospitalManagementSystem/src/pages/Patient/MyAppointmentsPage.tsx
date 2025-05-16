
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CircularProgress,
    Alert,
    Container,
    Typography
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { getUserId } from "@/components/login/JWTPayload";
import AppointmentTable from "../../components/appointment/appointmentTable";
import { fetchAppointments } from "@/api/appointmentApi";
import { IAppointment } from "@/context/types";

const MyAppointmentsPage: React.FC = () => {
    const token = useAuthStore((s) => s.token)!;
    const userId = Number(getUserId(token));

    const { isLoading, error } = useQuery<IAppointment[], Error>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments
    });

    if (isLoading) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }
    if (error) {
        return (
            <Alert severity="error">
                Error loading appointments: {error.message}
            </Alert>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 5 }}>
                My Appointments
            </Typography>

            <AppointmentTable userId={userId} />
        </Container>
    );
};

export default MyAppointmentsPage;
