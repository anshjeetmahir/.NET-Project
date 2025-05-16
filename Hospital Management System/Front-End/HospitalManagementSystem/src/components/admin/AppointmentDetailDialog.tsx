
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointmentById } from "@/api/appointmentApi";
import { IAppointment } from "@/context/types";

interface Props {
    appointmentId: number;
    open: boolean;
    onClose: () => void;
}

const AppointmentDetailDialog: React.FC<Props> = ({
    appointmentId,
    open,
    onClose
}) => {
    const { data, isLoading, error } = useQuery<IAppointment, Error>({
        queryKey: ["appointment", appointmentId],
        queryFn: () => fetchAppointmentById(appointmentId),
        enabled: open && appointmentId > 0
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogContent dividers>
                {isLoading && <Typography>Loading…</Typography>}
                {error && <Typography color="error">{error.message}</Typography>}

                {data && (
                    <Box sx={{ display: "grid", gap: 1, pt: 1 }}>
                        <Typography>
                            <strong>Appointment ID:</strong> {data.appointmentId}
                        </Typography>
                        <Typography>
                            <strong>Patient:</strong> {data.patientName} (#{data.patientId})
                        </Typography>
                        <Typography>
                            <strong>Doctor:</strong> Dr. {data.doctorName} (#{data.doctorId})
                        </Typography>
                        <Typography>
                            <strong>Date:</strong> {new Date(data.appointmentDate).toLocaleString()}
                        </Typography>
                        <Typography>
                            <strong>Purpose:</strong> {data.purpose ?? "–"}
                        </Typography>
                        <Typography>
                            <strong>Status:</strong> {data.status}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppointmentDetailDialog;
