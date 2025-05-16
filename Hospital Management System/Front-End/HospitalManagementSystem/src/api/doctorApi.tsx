import { IDoctor } from "@/context/types";
import { apiClient } from "./apiClient";



export const fetchDoctors = async (): Promise<IDoctor[]> => {
    const res = await apiClient.get<{
        message: string;
        data: IDoctor[];
    }>("/Doctors");
    return res.data.data;
};

export const fetchDoctorById = async (id: number): Promise<IDoctor> => {
    const res = await apiClient.get(`/Doctors/${id}`);
    return res.data;
};


export const addDoctor = async (data: Omit<IDoctor, "doctorId">): Promise<IDoctor> => {
    const res = await apiClient.post<IDoctor>("/Doctors/add", data);
    return res.data;
};

export const updateDoctor = async (id: number, data: Omit<IDoctor, "doctorId">): Promise<IDoctor> => {
    const res = await apiClient.put<IDoctor>(`/Doctors/update/${id}`, data);
    return res.data;
};


export const deleteDoctor = async (id: number): Promise<void> => {
    await apiClient.delete(`/Doctors/delete/${id}`);
};