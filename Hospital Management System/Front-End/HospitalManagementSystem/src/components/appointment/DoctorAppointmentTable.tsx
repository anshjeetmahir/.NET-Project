
import React from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button
} from "@mui/material";
import { IAppointment } from "@/context/types";


interface DoctorAppointmentTableProps {
    appointments: IAppointment[];
    onUpdateStatus: (appointmentId: number, newStatus: string) => void;
}

const ALLOWED_STATUSES = [
    "Scheduled",
    "Re-Schedule",
    "Completed",
    "Cancelled",
] as const;

const DoctorAppointmentTable: React.FC<DoctorAppointmentTableProps> = ({
    appointments,
    onUpdateStatus
}) => (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {appointments.map((appt) => {

                    const idx = ALLOWED_STATUSES.indexOf(appt.status as typeof ALLOWED_STATUSES[number]);

                    const nextStatus =
                        idx >= 0
                            ? ALLOWED_STATUSES[(idx + 1) % ALLOWED_STATUSES.length]
                            : ALLOWED_STATUSES[0];

                    return (
                        <TableRow key={appt.appointmentId} hover>
                            <TableCell>{appt.appointmentId}</TableCell>
                            <TableCell>{appt.patientName}</TableCell>
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
                                        onUpdateStatus(appt.appointmentId, nextStatus)
                                    }
                                >
                                    {`Set ${nextStatus}`}
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
);

export default DoctorAppointmentTable;
