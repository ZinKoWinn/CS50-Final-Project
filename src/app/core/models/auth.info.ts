import { User, defaultUser } from "./user";

export interface AuthCredential {
    email: string;
    password: string;
}

export interface AuthInfo {
    user: User;
    refreshToken: string;
}

export const defaultAuthInfo: AuthInfo = {
    user: defaultUser,
    refreshToken: ''
}
