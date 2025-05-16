import { AdminRequestModel } from "@/context/types";
import { apiClient } from "./apiClient";



export const addAdmin = async (admin: AdminRequestModel): Promise<void> => {
    await apiClient.post("/Admins/add", admin);
};
