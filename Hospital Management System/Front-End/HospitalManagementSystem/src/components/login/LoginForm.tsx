
import {
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "./JWTPayload";
import { LoginFormInputs } from "@/context/types";
import { useState } from "react";

const LoginForm = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const setRole = useAuthStore((s) => s.setRole);

    const [availableRoles, setAvailableRoles] = useState<string[] | null>(null);
    const [chosenRole, setChosenRole] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    const navigateByRole = (role: string) => {
        switch (role) {
            case "Patient":
                navigate("/patient", { replace: true });
                break;
            case "Doctor":
                navigate("/doctor", { replace: true });
                break;
            case "Admin":
                navigate("/admin", { replace: true });
                break;
            default:
                navigate("/not-authorized", { replace: true });
        }
    };

    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ username, password }: LoginFormInputs) =>
            login(username, password),
        onSuccess: ({ accessToken, expireTime }) => {
            const expireTimeNum = typeof expireTime === "string"
                ? Number(expireTime)
                : expireTime;

            setAuth(accessToken, expireTimeNum);


            const rolesArray = getUserRole(accessToken);


            if (rolesArray.length === 1) {
                setRole(rolesArray[0]);
                navigateByRole(rolesArray[0]);
                return;
            }


            if (rolesArray.length > 1) {
                setAvailableRoles(rolesArray);
                return;
            }


            navigate("/not-authorized", { replace: true });
        },
        onError: (err) => {
            console.error("LOGIN ERROR:", err);
        }
    });

    const onSubmit = (data: LoginFormInputs) => {
        mutate(data);
    };

    const handleRoleConfirm = () => {
        setRole(chosenRole);
        navigateByRole(chosenRole);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 2, maxWidth: 360, mx: "auto" }}
        >
            <TextField
                label="Username"
                fullWidth
                {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "At least 3 characters" }
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            {availableRoles ? (
                <>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={chosenRole}
                            label="Select Role"
                            onChange={(e) => setChosenRole(e.target.value)}
                        >
                            {availableRoles.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleRoleConfirm}
                        disabled={!chosenRole}
                    >
                        Continue as {chosenRole}
                    </Button>
                </>
            ) : (
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={isPending}
                >
                    {isPending ? "Signing in…" : "Log In"}
                </Button>
            )}

            {error && (
                <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                    {(error as Error).message || "Login failed. Please try again."}
                </Typography>
            )}
        </Box>
    );
};

export default LoginForm;
