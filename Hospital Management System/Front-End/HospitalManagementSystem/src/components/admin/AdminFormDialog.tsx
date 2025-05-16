
import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAdmin } from "@/api/adminApi";
interface AdminRequestModel {
    userName: string;
    password: string;
    roles: string[];
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const AdminFormDialog: React.FC<Props> = ({ open, onClose }) => {
    const qc = useQueryClient();

    const { control, handleSubmit, reset } = useForm<AdminRequestModel>({
        defaultValues: {
            userName: "",
            password: "",
            roles: ["Admin"]
        }
    });

    const mutation = useMutation({
        mutationFn: addAdmin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admins"] });
            onClose();
        }
    });

    const onSubmit = (data: AdminRequestModel) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        if (open) {
            reset({ userName: "", password: "", roles: ["Admin"] });
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Admin</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <Controller
                            name="userName"
                            control={control}
                            rules={{ required: "Username is required." }}
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
                                minLength: { value: 6, message: "Password must be at least 6 characters." }
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Add</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AdminFormDialog;
