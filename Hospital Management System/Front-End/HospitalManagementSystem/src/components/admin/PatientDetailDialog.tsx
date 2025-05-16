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
import { fetchPatientById } from "@/api/patientApi";
import { IPatient } from "@/context/types";

interface Props {
    patientId: number;
    open: boolean;
    onClose: () => void;
}

const PatientDetailDialog: React.FC<Props> = ({ patientId, open, onClose }) => {
    const { data, isLoading, error } = useQuery<IPatient, Error>({
        queryKey: ["patient", patientId],
        queryFn: () => fetchPatientById(patientId),
        enabled: open && patientId > 0
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogContent dividers>
                {isLoading && <Typography>Loading…</Typography>}
                {error && <Typography color="error">{error.message}</Typography>}
                {data && (
                    <Box sx={{ display: "grid", gap: 1, pt: 1 }}>
                        <Typography><strong>Name:</strong> {data.firstName} {data.lastName}</Typography>
                        <Typography><strong>DOB:</strong> {new Date(data.dateOfBirth).toLocaleDateString()}</Typography>
                        <Typography><strong>Email:</strong> {data.email}</Typography>
                        <Typography><strong>Phone:</strong> {data.phoneNumber}</Typography>
                        <Typography><strong>Address:</strong> {data.address}</Typography>
                        <Typography><strong>Username:</strong> {data.userName}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PatientDetailDialog;
