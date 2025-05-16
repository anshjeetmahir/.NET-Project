import { IAppointment, IBookAppointment } from "@/context/types";
import { apiClient } from "./apiClient";



export const fetchAppointments = async (): Promise<IAppointment[]> => {
    const res = await apiClient.get<{
        message: string;
        data: IAppointment[];
    }>("/Appointments");
    return res.data.data;
};

export const fetchAppointmentById = async (
    id: number
): Promise<IAppointment> => {
    const res = await apiClient.get<IAppointment>(`/Appointments/${id}`);
    return res.data;
};

export const addAppointment = async (appt: IBookAppointment): Promise<IAppointment> => {
    const { data } = await apiClient.post<IAppointment>("/Appointments/add", appt);
    return data;
};



export const updateAppointmentStatus = async (
    appointmentId: number,
    status: string
): Promise<void> => {
    await apiClient.patch(`/Appointments/update/${appointmentId}`, { status });
};


export const deleteAppointment = async (
    appointmentId: number
): Promise<void> => {
    await apiClient.delete(`/Appointments/delete/${appointmentId}`);
};