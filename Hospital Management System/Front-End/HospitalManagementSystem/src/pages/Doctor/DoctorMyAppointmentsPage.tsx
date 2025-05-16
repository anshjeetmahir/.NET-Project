
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CircularProgress,
    Alert,
    Container,
    Typography
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { getUserId } from "@/components/login/JWTPayload";
import { fetchAppointments, updateAppointmentStatus } from "@/api/appointmentApi";
import { fetchDoctors } from "@/api/doctorApi";
import DoctorAppointmentTable from "@/components/appointment/DoctorAppointmentTable";
import { IAppointment, IDoctor } from "@/context/types";

const DoctorMyAppointmentsPage: React.FC = () => {
    const token = useAuthStore((s) => s.token)!;
    const userId = Number(getUserId(token));
    const qc = useQueryClient();


    const { data: doctors, isLoading: loadingDoctors } = useQuery<IDoctor[], Error>({
        queryKey: ["doctors"],
        queryFn: fetchDoctors
    });


    const { data: appointments, isLoading: loadingAppts, error: apptsErr } = useQuery<IAppointment[], Error>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments
    });


    const updateStatusMut = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            updateAppointmentStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
        }
    });

    if (loadingDoctors || loadingAppts) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }
    if (apptsErr) {
        return <Alert severity="error">Error loading appointments.</Alert>;
    }

    const me = (doctors ?? []).find((d) => d.userId === userId);
    if (!me) {
        return <Alert severity="error">Doctor profile not found.</Alert>;
    }

    const myAppointments = (appointments ?? []).filter(
        (a) => a.doctorId === me.doctorId
    );

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 5 }}  >
                My Appointments
            </Typography>

            {
                myAppointments.length === 0 ? (
                    <Alert severity="info">No appointments scheduled.</Alert>
                ) : (
                    <DoctorAppointmentTable
                        appointments={myAppointments}
                        onUpdateStatus={(id, status) =>
                            updateStatusMut.mutate({ id, status })
                        }
                    />
                )
            }
        </Container >
    );
};

export default DoctorMyAppointmentsPage;
