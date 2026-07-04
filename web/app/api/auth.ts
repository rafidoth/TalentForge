import api from "./index";
import type { AuthInfo, LoginRequest, RegisterRequest } from "./types";

export function loginWithGoogle() {
    const returnUrl = encodeURIComponent(window.location.origin + "/");
    window.location.href = `${import.meta.env.VITE_API_URL}/users/login/google?provider=Google&returnUrl=${returnUrl}`;
}

export async function login(data: LoginRequest): Promise<void> {
    await api.post("/auth/login", data);
}

export async function register(data: RegisterRequest): Promise<void> {
    await api.post("/auth/register", data);
}

export async function fetchMe(): Promise<AuthInfo> {
    const res = await api.get("/auth/me");
    return res.data;
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout");
}