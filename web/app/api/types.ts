import type { UserRole } from "~/types";

export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    success: boolean;
    userId: string;
    role: UserRole;
}

export type RegisterRequest = {
    email: string;
    password: string;
}

export type RegisterResponse = {
    success: boolean;
    userId: string;
    role: UserRole;
}