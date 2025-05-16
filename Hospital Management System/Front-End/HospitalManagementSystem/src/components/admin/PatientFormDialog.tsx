
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
    ListItemText,
    FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchPatientById,
    addPatient,
    updatePatient,
} from "@/api/patientApi";
import { IPatient } from "@/context/types";

type Mode = "add" | "edit";

interface Props {
    mode: Mode;
    patientId?: number;
    open: boolean;
    onClose: () => void;
}


type FormValues = Omit<IPatient, "patientId"> & {
    password: string;
    roles: string[];
};

const ALL_ROLES = ["Patient", "Admin"];

const PatientFormDialog: React.FC<Props> = ({ mode, patientId, open, onClose }) => {
    const qc = useQueryClient();

    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            email: "",
            phoneNumber: "",
            address: "",
            userName: "",
            password: "",
            roles: ["Patient"],
        },
    });


    const { data } = useQuery<IPatient>({
        queryKey: ["patient", patientId],
        queryFn: () => fetchPatientById(patientId!),
        enabled: mode === "edit" && !!patientId,
    });





    const addMut = useMutation<IPatient, Error, FormValues>({
        mutationFn: addPatient,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminPatients"] });
            onClose();
        },
    });


    const updMut = useMutation<IPatient, Error, { id: number; vals: FormValues }>({
        mutationFn: ({ id, vals }) => updatePatient(id, vals),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["adminPatients"] });
            onClose();
        },
    });


    useEffect(() => {
        if (data && mode === "edit") {
            reset({
                ...data,
                password: "",
                roles: ["Patient"],
            });
        }
    }, [data, mode, reset]);


    const onSubmit = (vals: FormValues) => {
        const payload = {
            ...vals,
            roles: vals.roles.length ? vals.roles : ["Patient"],
        };

        if (mode === "add") {
            addMut.mutate(payload);
        } else {
            updMut.mutate({ id: patientId!, vals: payload });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {mode === "add" ? "Add Patient" : "Edit Patient"}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: "grid", gap: 2, mt: 1, width: 400 }}
                >

                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <TextField label="First Name" {...field} />
                        )}
                        rules={{ required: "First name is required." }}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <TextField label="Last Name" {...field} />
                        )}
                        rules={{ required: "Last name is required." }}
                    />
                    <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...field}
                            />
                        )}
                        rules={{ required: "Date of birth is required." }}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField label="Email" type="email" {...field} />
                        )}
                        rules={{ required: "Email is required." }}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField label="Phone Number" {...field} />
                        )}
                        rules={{ required: "Phone number is required." }}
                    />
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField label="Address" {...field} />
                        )}
                        rules={{ required: "Address is required." }}
                    />
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Username"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                        rules={{
                            required: "Username is required.",
                            minLength: { value: 4, message: "At least 4 characters." },
                        }}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Password"
                                type="password"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                        rules={{
                            required: "Password is required.",
                            minLength: { value: 6, message: "At least 6 characters." },
                        }}
                    />


                    <Controller
                        name="roles"
                        control={control}
                        rules={{ validate: val => val.length > 0 || "At least one role is required." }}
                        render={({ field, fieldState }) => (
                            <FormControl error={!!fieldState.error}>
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
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    {mode === "add" ? "Add" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PatientFormDialog;
