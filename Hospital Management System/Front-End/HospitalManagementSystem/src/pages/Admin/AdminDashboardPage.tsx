

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "@/api/patientApi";
import { fetchDoctors } from "@/api/doctorApi";
import { fetchAppointments } from "@/api/appointmentApi";
import AdminFormDialog from "../../components/admin/AdminFormDialog";

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [openAdminDialog, setOpenAdminDialog] = useState(false);

    const {
        data: patients,
        isLoading: patientsLoading,
        error: patientsError
    } = useQuery({ queryKey: ["patientsCount"], queryFn: fetchPatients });

    const {
        data: doctors,
        isLoading: doctorsLoading,
        error: doctorsError
    } = useQuery({ queryKey: ["doctorsCount"], queryFn: fetchDoctors });

    const {
        data: appointments,
        isLoading: apptsLoading,
        error: apptsError
    } = useQuery({ queryKey: ["appointmentsCount"], queryFn: fetchAppointments });

    useEffect(() => {
        if (location.pathname === "/admin/add") {
            setOpenAdminDialog(true);
        } else {
            setOpenAdminDialog(false);
        }
    }, [location.pathname]);

    const handleOpenDialog = () => navigate("/admin/add");
    const handleCloseDialog = () => navigate("/admin");

    if (patientsLoading || doctorsLoading || apptsLoading) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }

    if (patientsError || doctorsError || apptsError) {
        return <Alert severity="error">Error loading dashboard data.</Alert>;
    }

    const cards = [
        { label: "Patients", count: patients?.length ?? 0, path: "/admin/patients" },
        { label: "Doctors", count: doctors?.length ?? 0, path: "/admin/doctors" },
        { label: "Appointments", count: appointments?.length ?? 0, path: "/admin/appointments" }
    ];

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 5 }}>
                Admin Dashboard
            </Typography>

            <Box mb={3}>
                <Button variant="contained" onClick={handleOpenDialog}>
                    Add Admin
                </Button>
            </Box>

            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={4} key={card.label}>
                        <Card sx={{ p: 1, height: 140 }}>
                            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                                <Typography variant="h6">{card.label}</Typography>
                                <Typography variant="h4">{card.count}</Typography>
                                <Button size="small" sx={{ mt: 1 }} onClick={() => navigate(card.path)}>
                                    Manage
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <AdminFormDialog open={openAdminDialog} onClose={handleCloseDialog} />
        </Box>
    );
};

export default AdminDashboardPage;
