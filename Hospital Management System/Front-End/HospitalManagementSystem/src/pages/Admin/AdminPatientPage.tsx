
import React, { useMemo } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, CircularProgress, Alert, Typography } from "@mui/material";
import { fetchPatients, deletePatient } from "@/api/patientApi";
import PatientTable from "../../components/admin/PatientTable";
import PatientDetailDialog from "../../components/admin/PatientDetailDialog";
import PatientFormDialog from "../../components/admin/PatientFormDialog";
import ConfirmDeleteDialog from "../../components/admin/ConfirmDeleteDialog";
import { IPatient } from "@/context/types";

const AdminPatientPage: React.FC = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const params = useParams<{ id?: string }>();
    const location = useLocation();


    const { data: patients, isLoading, error } = useQuery<IPatient[], Error>({
        queryKey: ["adminPatients"],
        queryFn: fetchPatients
    });


    const deleteMut = useMutation<void, Error, number>({
        mutationFn: (id) => deletePatient(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminPatients"] });
            navigate("/admin/patients");
        }
    });


    const mode = useMemo<"detail" | "add" | "edit" | "delete" | null>(() => {
        if (location.pathname.endsWith("/add")) return "add";
        if (location.pathname.includes("/edit/")) return "edit";
        if (location.pathname.includes("/delete/")) return "delete";
        if (params.id) return "detail";
        return null;
    }, [location.pathname, params.id]);

    if (isLoading) return <CircularProgress sx={{ m: "auto", display: "block", mt: 4 }} />;
    if (error) return <Alert severity="error">Error loading patients: {error.message}</Alert>;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 5 }}>
                Patient Management
            </Typography>
            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate("/admin/patients/add")}
            >
                Add Patient
            </Button>

            <PatientTable
                patients={patients ?? []}
                onView={(id) => navigate(`/admin/patients/${id}`)}
                onEdit={(id) => navigate(`/admin/patients/edit/${id}`)}
                onDelete={(id) => navigate(`/admin/patients/delete/${id}`)}
            />


            {mode === "detail" && params.id && (
                <PatientDetailDialog
                    patientId={Number(params.id)}
                    open
                    onClose={() => navigate("/admin/patients")}
                />
            )}


            {(mode === "add" || (mode === "edit" && params.id)) && (
                <PatientFormDialog
                    key={mode + params.id}
                    mode={mode}
                    patientId={params.id ? Number(params.id) : undefined}
                    open
                    onClose={() => navigate("/admin/patients")}
                />
            )}


            {mode === "delete" && params.id && (
                <ConfirmDeleteDialog
                    open
                    title="Delete Patient?"
                    onConfirm={() => deleteMut.mutate(Number(params.id))}
                    onClose={() => navigate("/admin/patients")}
                >
                    Are you sure you want to delete patient #{params.id}?
                </ConfirmDeleteDialog>
            )}

            <Outlet />
        </Box>
    );
};

export default AdminPatientPage;
