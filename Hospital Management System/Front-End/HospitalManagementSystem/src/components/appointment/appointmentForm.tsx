import React from "react";
import {
    Box,
    Button,
    TextField,
    FormHelperText
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { IBookAppointment } from "@/context/types";

interface AppointmentFormProps {
    patientId: number;
    doctorId: number | null;
    onChangeDate: (date: string) => void;
    onSubmit: (data: IBookAppointment) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
    patientId,
    doctorId,
    onChangeDate,
    onSubmit,
}) => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            date: "",
            purpose: "",
        },
    });

    const watchDate = watch("date");

    const isSubmitDisabled =
        !doctorId || !!errors.date || !!errors.purpose || !watchDate;

    const submitForm = (data: { date: string; purpose: string }) => {
        if (doctorId) {
            onChangeDate(data.date);
            onSubmit({
                patientId,
                doctorId,
                appointmentDate: data.date,
                purpose: data.purpose,
            });
        }
    };

    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
            }}
        >
            <Controller
                name="date"
                control={control}
                rules={{
                    required: "Appointment date is required",
                    validate: (value) => {
                        const selected = new Date(value);
                        const now = new Date();
                        return selected > now || "Appointment date must be in the future.";
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Appointment Date"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date}
                        fullWidth
                    />
                )}
            />
            {errors.date && (
                <FormHelperText error>{errors.date.message}</FormHelperText>
            )}

            <Controller
                name="purpose"
                control={control}
                rules={{
                    maxLength: {
                        value: 200,
                        message: "Purpose must not exceed 200 characters.",
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Purpose (optional)"
                        multiline
                        minRows={2}
                        error={!!errors.purpose}
                        fullWidth
                    />
                )}
            />
            {errors.purpose && (
                <FormHelperText error>{errors.purpose.message}</FormHelperText>
            )}

            <Button
                variant="contained"
                onClick={handleSubmit(submitForm)}
                disabled={isSubmitDisabled}
                fullWidth
            >
                Book Appointment
            </Button>
        </Box>
    );
};

export default AppointmentForm;
