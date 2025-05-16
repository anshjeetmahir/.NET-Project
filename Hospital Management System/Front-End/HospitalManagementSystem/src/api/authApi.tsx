
import { apiClient } from "./apiClient";   // 
import { LoginResponse } from "@/context/types";

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {

    const response = await apiClient.post("/Login", { username, password });

    const { token, expiresAt } = response.data.data;
    return {
        accessToken: token,
        expireTime: expiresAt,
    };
};
