
import React, { useMemo } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, CircularProgress, Alert, Typography } from "@mui/material";
import { fetchDoctors, deleteDoctor } from "@/api/doctorApi";
import DoctorTable from "../../components/admin/DoctorTable";
import DoctorDetailDialog from "../../components/admin/DoctorDetailDialog";
import DoctorFormDialog from "../../components/admin/DoctorFormDialog";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { IDoctor } from "@/context/types";

const AdminDoctorPage: React.FC = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const params = useParams<{ id?: string }>();
    const location = useLocation();

    const { data: doctors, isLoading, error } = useQuery<IDoctor[], Error>({
        queryKey: ["adminDoctors"],
        queryFn: fetchDoctors
    });

    const deleteMut = useMutation<void, Error, number>({
        mutationFn: (id) => deleteDoctor(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminDoctors"] });
            navigate("/admin/doctors");
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
    if (error) return <Alert severity="error">Error loading doctors: {error.message}</Alert>;

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 5 }}>
                Doctor Management
            </Typography>
            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate("/admin/doctors/add")}
            >
                Add Doctor
            </Button>

            <DoctorTable
                doctors={doctors ?? []}
                onView={(id) => navigate(`/admin/doctors/${id}`)}
                onEdit={(id) => navigate(`/admin/doctors/edit/${id}`)}
                onDelete={(id) => navigate(`/admin/doctors/delete/${id}`)}
            />

            {mode === "detail" && params.id && (
                <DoctorDetailDialog
                    doctorId={Number(params.id)}
                    open
                    onClose={() => navigate("/admin/doctors")}
                />
            )}

            {(mode === "add" || (mode === "edit" && params.id)) && (
                <DoctorFormDialog
                    key={mode + params.id}
                    mode={mode}
                    doctorId={params.id ? Number(params.id) : undefined}
                    open
                    onClose={() => navigate("/admin/doctors")}
                />
            )}

            {mode === "delete" && params.id && (
                <ConfirmDeleteDialog
                    open
                    title="Delete Doctor?"
                    onConfirm={() => deleteMut.mutate(Number(params.id))}
                    onClose={() => navigate("/admin/doctors")}
                >
                    Are you sure you want to delete doctor #{params.id}?
                </ConfirmDeleteDialog>
            )}

            <Outlet />
        </Box>
    );
};

export default AdminDoctorPage;
