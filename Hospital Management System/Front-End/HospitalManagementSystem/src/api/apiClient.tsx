
import axios from "axios";

const authJson = localStorage.getItem("auth-storage");
let token: string | null = null;

if (authJson) {
    try {
        const persisted = JSON.parse(authJson) as { state?: { token?: string } };
        token = persisted.state?.token ?? null;
    } catch {
        console.warn("Could not parse auth-storage from localStorage");
    }
}

export const apiClient = axios.create({
    baseURL: "https://localhost:7037/api",
    headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
});


apiClient.interceptors.request.use((config) => {
    const authJson = localStorage.getItem("auth-storage");
    if (authJson) {
        try {
            const persisted = JSON.parse(authJson) as { state?: { token?: string } };
            const fresh = persisted.state?.token;
            if (fresh && config.headers) {
                config.headers.Authorization = `Bearer ${fresh}`;
            }
        } catch { }
    }
    return config;
});
