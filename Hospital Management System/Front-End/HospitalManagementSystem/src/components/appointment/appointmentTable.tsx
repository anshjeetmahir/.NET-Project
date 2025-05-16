
import React from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
    Alert,
    Button
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatients } from "@/api/patientApi";
import {
    fetchAppointments,
    updateAppointmentStatus,
} from "@/api/appointmentApi";
import { IAppointment, IPatient } from "@/context/types";

interface AppointmentTableProps {
    userId: number;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ userId }) => {
    const qc = useQueryClient();


    const {
        data: patients,
        isLoading: patientsLoading,
        error: patientsError
    } = useQuery<IPatient[], Error>({
        queryKey: ["patients"],
        queryFn: fetchPatients
    });


    const {
        data: appointments,
        isLoading: apptsLoading,
        error: apptsError
    } = useQuery<IAppointment[], Error>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments
    });


    const mutation = useMutation<
        void,
        Error,
        { id: number; status: string }
    >({
        mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
        }
    });


    if (patientsLoading || apptsLoading) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }
    if (patientsError) {
        return (
            <Alert severity="error">
                Error loading patients: {patientsError.message}
            </Alert>
        );
    }
    if (apptsError) {
        return (
            <Alert severity="error">
                Error loading appointments: {apptsError.message}
            </Alert>
        );
    }


    const me = (patients ?? []).find((p) => p.userId === userId);
    if (!me) {
        return (
            <Alert severity="error">
                No patient record found for the current user.
            </Alert>
        );
    }


    const myAppointments = (appointments ?? []).filter(
        (a) => a.patientId === me.patientId
    );
    if (myAppointments.length === 0) {
        return <Alert severity="info">You have no appointments.</Alert>;
    }


    return (
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Appointment ID</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {myAppointments.map((appt) => {

                        const nextStatus =
                            appt.status === "Scheduled" ? "Re-Schedule" : "Scheduled";

                        return (
                            <TableRow key={appt.appointmentId} hover>
                                <TableCell>{appt.appointmentId}</TableCell>
                                <TableCell>{appt.doctorName}</TableCell>
                                <TableCell>
                                    {new Date(appt.appointmentDate).toLocaleString()}
                                </TableCell>
                                <TableCell>{appt.purpose || "-"}</TableCell>
                                <TableCell>{appt.status}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            mutation.mutate({
                                                id: appt.appointmentId,
                                                status: nextStatus
                                            })
                                        }
                                    >
                                        {nextStatus === "Scheduled" ? "Schedule" : "Reschedule"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AppointmentTable;
