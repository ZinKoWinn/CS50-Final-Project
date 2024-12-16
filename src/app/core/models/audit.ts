import { Timestamp } from "firebase/firestore";

export interface Audit {
    createdDate: Timestamp;
    createdBy: string;
    updatedDate: Timestamp;
    updatedBy: string;
}

export const defaultAudit: Audit = {
    createdDate: Timestamp.now(),
    createdBy: '',
    updatedDate: null,
    updatedBy: ''
};