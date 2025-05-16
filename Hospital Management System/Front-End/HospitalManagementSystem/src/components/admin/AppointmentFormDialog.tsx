
import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addAppointment,

} from "@/api/appointmentApi";
import { fetchDoctors } from "@/api/doctorApi";
import { fetchPatients } from "@/api/patientApi";
import { IAppointment, IBookAppointment } from "@/context/types";

interface Props {
    open: boolean;
    onClose: () => void;
}

type FormValues = IBookAppointment;

const AppointmentFormDialog: React.FC<Props> = ({ open, onClose }) => {
    const qc = useQueryClient();
    const { control, handleSubmit, reset } = useForm<FormValues>();


    const { data: doctors = [], isLoading: doctorsLoading } = useQuery<
        { doctorId: number; firstName: string; lastName: string }[],
        Error
    >({
        queryKey: ["doctors"],
        queryFn: fetchDoctors
    });


    const { data: patients = [], isLoading: patientsLoading } = useQuery<
        { patientId: number; firstName: string; lastName: string }[],
        Error
    >({
        queryKey: ["patients"],
        queryFn: fetchPatients
    });


    const { mutate, status: mutateStatus } = useMutation<
        IAppointment,
        Error,
        IBookAppointment
    >({
        mutationFn: addAppointment,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminAppointments"] });
            onClose();
        }
    });


    useEffect(() => {
        if (open) {
            reset({ patientId: 0, doctorId: 0, appointmentDate: "", purpose: "" });
        }
    }, [open, reset]);

    const onSubmit = (vals: FormValues) => mutate(vals);

    const loading =
        mutateStatus === "pending" || doctorsLoading || patientsLoading;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Book Appointment</DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: "grid", gap: 2, mt: 1 }}
                >
                    <Controller
                        name="patientId"
                        control={control}
                        defaultValue={0}
                        rules={{ required: "Patient is required" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                select
                                label="Patient"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                disabled={patientsLoading}
                            >
                                {patients.map((p) => (
                                    <MenuItem key={p.patientId} value={p.patientId}>
                                        {p.firstName} {p.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="doctorId"
                        control={control}
                        defaultValue={0}
                        rules={{ required: "Doctor is required" }}
                        render={({ field, fieldState }) => (
                            <TextField
                                select
                                label="Doctor"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                disabled={doctorsLoading}
                            >
                                {doctors.map((d) => (
                                    <MenuItem key={d.doctorId} value={d.doctorId}>
                                        Dr. {d.firstName} {d.lastName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="appointmentDate"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Date & time required",
                            validate: (value) => {
                                const selected = new Date(value);
                                return (
                                    selected > new Date() ||
                                    "Appointment date must be in the future."
                                );
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Date & Time"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="purpose"
                        control={control}
                        defaultValue=""
                        rules={{
                            maxLength: {
                                value: 200,
                                message: "Purpose must not exceed 200 characters."
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Purpose"
                                multiline
                                rows={2}
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={loading}
                >
                    {mutateStatus === "pending" ? "Booking…" : "Book"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppointmentFormDialog;
