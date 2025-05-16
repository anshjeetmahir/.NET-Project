
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Box
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { getUserId } from "@/components/login/JWTPayload";
import { fetchDoctors } from "@/api/doctorApi";
import { IDoctor } from "@/context/types";

const DoctorProfilePage: React.FC = () => {
    const token = useAuthStore((s) => s.token)!;
    const userId = parseInt(getUserId(token), 10);

    const {
        data: doctors = [],
        isLoading,
        error,
    } = useQuery<IDoctor[], Error>({
        queryKey: ["doctors"],
        queryFn: fetchDoctors,
    });

    if (isLoading)
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;

    if (error)
        return (
            <Alert severity="error">
                Error loading doctor profile: {error.message}
            </Alert>
        );

    const me = doctors.find((doc) => doc.userId === userId);

    if (!me) {
        return (
            <Alert severity="warning">
                No doctor profile found for your account.
            </Alert>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                My Profile
            </Typography>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Box mb={2}>
                    <Typography variant="h6">Name:</Typography>
                    <Typography>
                        {me.firstName} {me.lastName}
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Email:</Typography>
                    <Typography>{me.email}</Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Specialization:</Typography>
                    <Typography>{me.specialization}</Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Experience:</Typography>
                    <Typography>{me.yearsOfExperience} years</Typography>
                </Box>
                <Box>
                    <Typography variant="h6">Username:</Typography>
                    <Typography>{me.userName}</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default DoctorProfilePage;
