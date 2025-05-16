
import { jwtDecode } from "jwt-decode";




export interface JWTPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string | string[];
    UserId: string;
}



export function decodeToken(token: string): JWTPayload {
    return jwtDecode<JWTPayload>(token);
}

export function getUserName(token: string): string {
    const payload = decodeToken(token);
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
}

export function getUserRole(token: string): string[] {
    const payload = decodeToken(token);
    const roles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return Array.isArray(roles) ? roles : [roles];
}

export function getUserId(token: string): string {

    const payload = decodeToken(token);
    return payload["UserId"];
}
