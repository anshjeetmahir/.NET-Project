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
import { fetchDoctorById } from "@/api/doctorApi";
import { IDoctor } from "@/context/types";

interface Props {
    doctorId: number;
    open: boolean;
    onClose: () => void;
}

const DoctorDetailDialog: React.FC<Props> = ({ doctorId, open, onClose }) => {
    const { data, isLoading, error } = useQuery<IDoctor, Error>({
        queryKey: ["doctor", doctorId],
        queryFn: () => fetchDoctorById(doctorId),
        enabled: open && doctorId > 0
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogContent dividers>
                {isLoading && <Typography>Loading…</Typography>}
                {error && <Typography color="error">{error.message}</Typography>}
                {data && (
                    <Box sx={{ display: "grid", gap: 1, pt: 1 }}>
                        <Typography><strong>Name:</strong> Dr. {data.firstName} {data.lastName}</Typography>
                        <Typography><strong>Email:</strong> {data.email}</Typography>
                        <Typography><strong>Experience:</strong> {data.yearsOfExperience} years</Typography>
                        <Typography><strong>Specialization:</strong> {data.specialization}</Typography>
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

export default DoctorDetailDialog;
