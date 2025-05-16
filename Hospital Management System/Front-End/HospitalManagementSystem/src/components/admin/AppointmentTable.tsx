
import React from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    IconButton
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { IAppointment } from "@/context/types";


interface Props {
    appointments: IAppointment[];
    onUpdateStatus: (appointmentId: number, newStatus: IAppointment["status"]) => void;
    onView: (id: number) => void;
    onDelete: (id: number) => void;
}

const ALLOWED_STATUSES = [
    "Scheduled",
    "Re-Schedule",
    "Completed",
    "Cancelled"
] as const;

const AppointmentTable: React.FC<Props> = ({
    appointments,
    onUpdateStatus,
    onView,
    onDelete
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
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {appointments.map((appt) => {
                    const idx = ALLOWED_STATUSES.indexOf(
                        appt.status as typeof ALLOWED_STATUSES[number]
                    );
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


                                <IconButton
                                    size="small"
                                    onClick={() => onView(appt.appointmentId)}
                                    sx={{ ml: 1 }}
                                >
                                    <Visibility />
                                </IconButton>


                                <IconButton
                                    size="small"

                                    onClick={() => onDelete(appt.appointmentId)}
                                    sx={{ ml: 1 }}
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
);

export default AppointmentTable;
