
import { Container, Paper, Typography } from "@mui/material";
import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";

const LoginContainer = () => {
    return (
        <Container maxWidth="xl">

            <Typography
                variant="h4"
                align="center"
                sx={{ marginTop: 5, fontWeight: "bold", color: "primary.main" }}
            >
                Hospital Management System
            </Typography>
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ marginTop: 15, padding: 3 }}>
                    <LoginHeader />
                    <LoginForm />
                </Paper>
            </Container>
        </Container>
    );
};

export default LoginContainer;
