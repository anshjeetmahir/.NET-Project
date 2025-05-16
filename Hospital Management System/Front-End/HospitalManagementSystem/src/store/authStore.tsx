
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeToken } from "@/components/login/JWTPayload";
import { AuthState } from "@/context/types";



export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            expireTime: null,
            userName: null,
            roles: [],
            role: null,
            isAuthenticated: false,

            setAuth: (token, expireTime) => {

                const payload = decodeToken(token);
                const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                const rawRoles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                const rolesArray = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

                set({
                    token,
                    expireTime,
                    userName: name,
                    roles: rolesArray,

                    role: rolesArray.length === 1 ? rolesArray[0] : null,
                    isAuthenticated: true,
                });
            },

            setRole: (role) => {
                set({ role });
            },

            logout: () => {
                set({
                    token: null,
                    expireTime: null,
                    userName: null,
                    roles: [],
                    role: null,
                    isAuthenticated: false,
                });
                localStorage.removeItem("auth-storage");
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
