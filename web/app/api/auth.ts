import api from "./index";
import type { LoginRequest, LoginResponse } from "./types";

export function loginWithGoogle() {
    const returnUrl = encodeURIComponent(window.location.origin + "/");
    window.location.href = `${import.meta.env.VITE_API_URL}/login/google?provider=Google&returnUrl=${returnUrl}`;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post("/users/login", data);
    return res.data;
}

export async function register(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post("/users/register", data);
    return res.data;
}