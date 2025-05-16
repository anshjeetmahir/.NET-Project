

import { useQuery } from "@tanstack/react-query";
import { Box, Typography, CircularProgress } from "@mui/material";
import { fetchPatients } from "../../api/patientApi";
import { useAuthStore } from "../../store/authStore";
import { getUserId } from "../../components/login/JWTPayload";
import PatientProfile from "../../components/patient/patientProfile";
import { IPatient } from "@/context/types";

const PatientPage = () => {
    const token = useAuthStore(state => state.token);
    const userId = token ? parseInt(getUserId(token), 10) : null;

    const { data: patients = [], isLoading, error } = useQuery<IPatient[]>({
        queryKey: ["patients"],
        queryFn: fetchPatients,
        enabled: userId !== null,
    });

    if (isLoading) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }

    if (error) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography color="error">Error loading patients.</Typography>
            </Box>
        );
    }

    const me = patients.find(p => p.userId === userId);

    if (!me) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography color="error">
                    No patient record found for your account.
                </Typography>
            </Box>
        );
    }

    return <PatientProfile patient={me} />;
};

export default PatientPage;
