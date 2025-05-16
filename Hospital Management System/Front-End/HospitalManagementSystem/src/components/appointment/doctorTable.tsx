
import React from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import { IDoctor } from "@/context/types";


interface DoctorTableProps {
    doctors: IDoctor[];
    selectedDoctorId: number | null;
    onSelect: (doctorId: number) => void;
}

const DoctorTable: React.FC<DoctorTableProps> = ({
    doctors,
    selectedDoctorId,
    onSelect
}) => (
    <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
            maxHeight: 300,
            borderColor: "divider",
            mb: 2
        }}
    >
        <Table stickyHeader aria-label="doctors table">
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Speciality</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {doctors.map((d) => {
                    const isSelected = d.doctorId === selectedDoctorId;
                    return (
                        <TableRow
                            key={d.doctorId}
                            hover
                            onClick={() => onSelect(d.doctorId)}
                            sx={{
                                cursor: "pointer",
                                bgcolor: isSelected ? "green" : undefined
                            }}
                        >
                            <TableCell>{d.doctorId}</TableCell>
                            <TableCell>
                                {d.firstName} {d.lastName}
                            </TableCell>
                            <TableCell>{d.specialization}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
);

export default DoctorTable;
