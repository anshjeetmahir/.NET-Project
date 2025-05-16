import { Box, Paper, Typography } from "@mui/material";
import { IPatient } from "@/api/patientApi";

interface PatientProfileProps {
    patient: IPatient;
}

const PatientProfile = ({ patient }: PatientProfileProps) => {
    return (



        <Box textAlign="center" p={3}>
            <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
                My Patient Profile
            </Typography>

            <Paper sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
                <Box
                    component="dl"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "max-content 1fr",
                        columnGap: 2,
                        rowGap: 1,
                        maxWidth: 600,
                        margin: "0 auto",
                        textAlign: "left",
                    }}
                >
                    <Typography component="dt" fontWeight="bold">
                        Patient ID:
                    </Typography>
                    <Typography component="dd">{patient.patientId}</Typography>

                    <Typography component="dt" fontWeight="bold">
                        First Name:
                    </Typography>
                    <Typography component="dd">{patient.firstName}</Typography>

                    <Typography component="dt" fontWeight="bold">
                        Last Name:
                    </Typography>
                    <Typography component="dd">{patient.lastName}</Typography>

                    <Typography component="dt" fontWeight="bold">
                        DOB:
                    </Typography>
                    <Typography component="dd">
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </Typography>

                    <Typography component="dt" fontWeight="bold">
                        Email:
                    </Typography>
                    <Typography component="dd">{patient.email}</Typography>

                    <Typography component="dt" fontWeight="bold">
                        Phone:
                    </Typography>
                    <Typography component="dd">{patient.phoneNumber}</Typography>

                    <Typography component="dt" fontWeight="bold">
                        Address:
                    </Typography>
                    <Typography component="dd">{patient.address}</Typography>
                </Box>
            </Paper>
        </Box>

    );
};

export default PatientProfile;
