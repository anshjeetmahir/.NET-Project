
import { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Container
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { getUserId } from "@/components/login/JWTPayload";
import {
    fetchDoctors,

} from "@/api/doctorApi";
import {
    fetchPatients,

} from "@/api/patientApi";
import {
    addAppointment,

} from "@/api/appointmentApi";
import DoctorTable from "../../components/appointment/doctorTable";
import AppointmentForm from "../../components/appointment/appointmentForm";
import { IPatient, IDoctor, IAppointment, IBookAppointment } from "@/context/types";

const BookAppointmentPage: React.FC = () => {
    const token = useAuthStore((s) => s.token)!;

    const userId = parseInt(getUserId(token), 10);
    const qc = useQueryClient();


    const {
        data: patients = [],
        isLoading: patientsLoading,
        error: patientsError
    } = useQuery<IPatient[], Error>({
        queryKey: ["patients"],
        queryFn: fetchPatients
    });


    const me = patients.find((p) => p.userId === userId);
    const patientId = me?.patientId ?? null;


    const {
        data: doctors = [],
        isLoading: docsLoading,
        error: docsError
    } = useQuery<IDoctor[], Error>({
        queryKey: ["doctors"],
        queryFn: fetchDoctors
    });

    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [, setSelectedDocName] = useState<string>("");
    const [, setApptDate] = useState<string>("");
    const [success, setSuccess] = useState<IAppointment | null>(null);
    const [formKey, setFormKey] = useState(0);


    const addAppt = useMutation<IAppointment, Error, IBookAppointment>({
        mutationFn: addAppointment,
        onSuccess: (appt) => {
            setSuccess(appt);
            setSelectedDocId(null);
            setSelectedDocName("");
            setApptDate("");
            setFormKey((k) => k + 1);
            qc.invalidateQueries({ queryKey: ["appointments"] });
        }
    });


    if (patientsLoading || docsLoading) {
        return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;
    }
    if (patientsError) {
        return <Alert severity="error">Error loading your patient record.</Alert>;
    }
    if (!patientId) {
        return (
            <Alert severity="error" >
                No patient profile found for your account.
            </Alert>
        );
    }
    if (docsError) {
        return <Alert severity="error">Error loading doctors.</Alert>;
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Book Appointment
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Appointment booked !
                </Alert>
            )}

            <Container maxWidth="md">
                <Typography variant="h6" gutterBottom>
                    Select a Doctor:
                </Typography>

                <DoctorTable
                    doctors={doctors}
                    selectedDoctorId={selectedDocId}
                    onSelect={(id) => {
                        setSelectedDocId(id);
                        const doc = doctors.find((d) => d.doctorId === id);
                        setSelectedDocName(
                            doc ? `${doc.firstName} ${doc.lastName}` : ""
                        );
                    }}
                />

                <Box mt={4} width="100%">
                    <AppointmentForm
                        key={formKey}
                        patientId={patientId}
                        doctorId={selectedDocId}
                        onChangeDate={setApptDate}
                        onSubmit={(data) => {
                            setApptDate(data.appointmentDate);
                            addAppt.mutate(data);
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default BookAppointmentPage;
