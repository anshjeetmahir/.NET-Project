
import React from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { IPatient } from "@/context/types";


interface Props {
    patients: IPatient[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const PatientTable: React.FC<Props> = ({ patients, onView, onEdit, onDelete }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Patient ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {patients.map((p) => (
                    <TableRow key={p.patientId} hover>
                        <TableCell>{p.patientId}</TableCell>
                        <TableCell>{`${p.firstName} ${p.lastName}`}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell>{p.phoneNumber}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => onView(p.patientId)}><Visibility /></IconButton>
                            <IconButton onClick={() => onEdit(p.patientId)}><Edit /></IconButton>
                            <IconButton onClick={() => onDelete(p.patientId)}><Delete /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default PatientTable;
