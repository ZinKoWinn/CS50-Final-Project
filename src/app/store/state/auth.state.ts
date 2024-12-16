import { AuthInfo } from "@model/auth.info";
export interface AuthState {
    authInfo: AuthInfo | undefined;
    error: { status: number, message: string } | undefined;
    loading: boolean;
}

export const initialAuthState: AuthState = {
    authInfo: undefined,
    error: undefined,
    loading: false,
};