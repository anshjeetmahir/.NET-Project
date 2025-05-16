
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
import { IDoctor } from "@/context/types";

interface Props {
    doctors: IDoctor[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const DoctorTable: React.FC<Props> = ({ doctors, onView, onEdit, onDelete }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Doctor ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {doctors.map((d) => (
                    <TableRow key={d.doctorId} hover>
                        <TableCell>{d.doctorId}</TableCell>
                        <TableCell>{`${d.firstName} ${d.lastName}`}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell>{d.specialization}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => onView(d.doctorId)}><Visibility /></IconButton>
                            <IconButton onClick={() => onEdit(d.doctorId)}><Edit /></IconButton>
                            <IconButton onClick={() => onDelete(d.doctorId)}><Delete /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default DoctorTable;
