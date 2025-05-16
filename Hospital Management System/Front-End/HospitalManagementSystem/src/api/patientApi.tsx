

import { IPatient } from "@/context/types";
import { apiClient } from "./apiClient";



export const fetchPatients = async (): Promise<IPatient[]> => {
    const { data } = await apiClient.get<{
        message: string;
        data: IPatient[];
    }>("/Patients");
    return data.data;
};

export const fetchPatientById = async (id: number): Promise<IPatient> => {
    const res = await apiClient.get<IPatient>(`/Patients/${id}`);
    return res.data;
};

export const addPatient = async (data: Omit<IPatient, "patientId">) => {
    const res = await apiClient.post<IPatient>("/Patients/add", data);
    return res.data;
};

export const updatePatient = async (id: number, data: Partial<IPatient>) => {
    const res = await apiClient.put<IPatient>(`/Patients/update/${id}`, data);
    return res.data;
};

export const deletePatient = async (id: number) => {
    await apiClient.delete(`/Patients/delete/${id}`);
};
