
import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchDoctorById,
    addDoctor,
    updateDoctor
} from "@/api/doctorApi";
import { IDoctor } from "@/context/types";

type Mode = "add" | "edit";

interface Props {
    mode: Mode;
    doctorId?: number;
    open: boolean;
    onClose: () => void;
}


type FormValues = Omit<IDoctor, "doctorId"> & { password: string; roles: string[] };

const ALL_ROLES = ["Doctor", "Admin"];

const DoctorFormDialog: React.FC<Props> = ({ mode, doctorId, open, onClose }) => {
    const qc = useQueryClient();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            specialization: "",
            yearsOfExperience: 0,
            userName: "",
            password: "",
            roles: []
        }
    });

    const { data } = useQuery<IDoctor, Error>({
        queryKey: ["doctor", doctorId],
        queryFn: () => fetchDoctorById(doctorId!),
        enabled: mode === "edit" && !!doctorId
    });

    const addMut = useMutation<IDoctor, Error, FormValues>({
        mutationFn: addDoctor,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminDoctors"] });
            onClose();
        },
    });

    const updMut = useMutation<IDoctor, Error, FormValues>({
        mutationFn: (vals) => updateDoctor(doctorId!, vals),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminDoctors"] });
            onClose();
        },
    });

    useEffect(() => {
        if (data && mode === "edit") {
            reset({
                ...data,
                password: "",
                roles: ["Doctor"],
            });
        }
    }, [data, mode, reset]);

    const onSubmit = (vals: FormValues) => {
        if (mode === "edit" && vals.password.trim() === "") {
            const { password, ...rest } = vals;
            updMut.mutate(rest as FormValues);
        } else {
            mode === "add" ? addMut.mutate(vals) : updMut.mutate(vals);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{mode === "add" ? "Add Doctor" : "Edit Doctor"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{
                                required: "Doctor's First Name is required.",
                                minLength: { value: 3, message: "First Name must be at least 3 characters." },
                                maxLength: { value: 20, message: "First Name must not exceed 20 characters." },
                                pattern: { value: /^[^\d]+$/, message: "First Name should not contain numbers." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="First Name"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="lastName"
                            control={control}
                            rules={{
                                minLength: { value: 3, message: "Last Name must be at least 3 characters." },
                                maxLength: { value: 20, message: "Last Name must not exceed 20 characters." },
                                pattern: { value: /^[^\d]*$/, message: "Last Name should not contain numbers." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Last Name"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email must be valid." },
                                minLength: { value: 5, message: "Email must be at least 5 characters." },
                                maxLength: { value: 100, message: "Email must not exceed 100 characters." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Email"
                                    type="email"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="specialization"
                            control={control}
                            rules={{
                                required: "Specialization is required.",
                                minLength: { value: 3, message: "Specialization must be at least 3 characters." },
                                maxLength: { value: 50, message: "Specialization must not exceed 50 characters." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Specialization"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="yearsOfExperience"
                            control={control}
                            rules={{
                                min: { value: 0, message: "Years of Experience must be 0 or more." },
                                max: { value: 60, message: "Years of Experience must be realistic (<= 60)." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Years of Experience"
                                    type="number"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="userName"
                            control={control}
                            rules={{
                                required: "Username is required.",
                                minLength: { value: 4, message: "Username must be at least 4 characters." },
                                maxLength: { value: 50, message: "Username must not exceed 50 characters." }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Username"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required.",
                                minLength: { value: 6, message: "Password must be at least 6 characters." },
                                maxLength: { value: 100, message: "Password must not exceed 100 characters." },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                    message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit."
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Password"
                                    type="password"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />


                        <Controller
                            name="roles"
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <InputLabel id="roles-label">Roles</InputLabel>
                                    <Select
                                        labelId="roles-label"
                                        multiple
                                        {...field}
                                        renderValue={(selected) => (selected as string[]).join(", ")}
                                    >
                                        {ALL_ROLES.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                <Checkbox checked={field.value.includes(role)} />
                                                <ListItemText primary={role} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {mode === "add" ? "Add" : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DoctorFormDialog;
