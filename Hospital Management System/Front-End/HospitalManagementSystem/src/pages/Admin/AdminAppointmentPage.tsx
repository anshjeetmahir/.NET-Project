import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Typography
} from "@mui/material";
import {
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,

} from "@/api/appointmentApi";
import AppointmentTable from "@/components/admin/AppointmentTable";
import AppointmentFormDialog from "@/components/admin/AppointmentFormDialog";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AppointmentDetailDialog from "@/components/admin/AppointmentDetailDialog";
import { IAppointment } from "@/context/types";

const AdminAppointmentPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const qc = useQueryClient();


    const { data: appointments = [], isLoading, error } = useQuery<IAppointment[], Error>({
        queryKey: ["adminAppointments"],
        queryFn: fetchAppointments
    });


    const { mutate: mutateStatus } = useMutation<void, Error, { id: number; status: IAppointment["status"] }>({
        mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminAppointments"] });
        }
    });


    const { mutate: mutateDelete } = useMutation<void, Error, number>({
        mutationFn: (id) => deleteAppointment(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminAppointments"] });
            navigate("/admin/appointments");
        }
    });


    const isAdd = location.pathname.endsWith("/add");

    const deleteMatch = location.pathname.match(/\/delete\/(\d+)$/);
    const deleteId = deleteMatch ? Number(deleteMatch[1]) : undefined;

    const detailMatch = location.pathname.match(/\/admin\/appointments\/(\d+)$/);
    const detailId = detailMatch ? Number(detailMatch[1]) : undefined;

    if (isLoading) {
        return <CircularProgress sx={{ m: "auto", display: "block", mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error">Error loading appointments: {error.message}</Alert>;
    }

    return (
        <Box p={3}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 5 }}>
                Appointment Management
            </Typography>

            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate("/admin/appointments/add")}
            >
                Book Appointment
            </Button>

            <AppointmentTable
                appointments={appointments}
                onUpdateStatus={(id, newStatus) => mutateStatus({ id, status: newStatus })}
                onView={(id) => navigate(`/admin/appointments/${id}`)}
                onDelete={(id) => navigate(`/admin/appointments/delete/${id}`)}
            />


            {isAdd && (
                <AppointmentFormDialog
                    open
                    onClose={() => navigate("/admin/appointments")}
                />
            )}


            {deleteId != null && (
                <ConfirmDeleteDialog
                    open
                    title="Delete Appointment?"
                    onConfirm={() => mutateDelete(deleteId)}
                    onClose={() => navigate("/admin/appointments")}
                >
                    Are you sure you want to delete appointment #{deleteId}?
                </ConfirmDeleteDialog>
            )}


            {detailId != null && (
                <AppointmentDetailDialog
                    appointmentId={detailId}
                    open
                    onClose={() => navigate("/admin/appointments")}
                />
            )}

            <Outlet />
        </Box>
    );
};

export default AdminAppointmentPage;
