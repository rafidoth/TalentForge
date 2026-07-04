export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    location: string;
}


export type AuthInfo = {
    userId: string;
    email: string;
    role: string;
}