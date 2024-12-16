import { User } from "@model/user";

export interface UserState {
    users: User[];
    loading: boolean;
    error: any;
}


export const initialUserState: UserState = {
    users: [],
    loading: false,
    error: null,
};