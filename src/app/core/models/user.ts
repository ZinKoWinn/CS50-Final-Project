import { Audit, defaultAudit } from "./audit";

export interface User {
    uid: string;
    name: string;
    email: string;
    emailVerified: boolean;
    roles: string[];
    audit: Audit;
}

export const defaultUser: User = {
    uid: '',
    name: '',
    email: '',
    emailVerified: false,
    roles: ['USER_ROLE'],
    audit: defaultAudit
}