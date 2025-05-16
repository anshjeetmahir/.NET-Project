import { PaletteMode } from "@mui/material";


export interface ThemeContextType {
    toggleColorMode: () => void;
    mode: PaletteMode;
}

export interface ThemeState {
    darkMode: boolean;
    toggleTheme: () => void;
}

export interface LoginFormInputs {
    username: string;
    password: string;
}

export interface AuthState {
    token: string | null;
    expireTime: number | null;
    userName: string | null;
    roles: string[];
    role: string | null;
    isAuthenticated: boolean;
    setAuth: (token: string, expireTime: number) => void;
    setRole: (role: string) => void;
    logout: () => void;
}
export interface IAppointment {
    appointmentId: number;
    patientName: string;
    patientId: number;
    doctorName: string;
    doctorId: number;
    appointmentDate: string;
    purpose?: string;
    status: string;
}

export interface IBookAppointment {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    purpose?: string;
}


export interface LoginResponse {
    accessToken: string;
    expireTime: string;

}

export interface IDoctor {
    doctorId: number;
    firstName: string;
    lastName: string;
    specialization: string;
    yearsOfExperience: number;
    email: string;
    userName: string;
    userId: number;
}

export interface IPatient {
    patientId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: string;
    userName: string;
    userId: number;
}

export interface AdminRequestModel {
    userName: string;
    password: string;
    roles: string[];
}