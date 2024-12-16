import { Audit } from "./audit";
export interface Project {
    id: number;
    documentId: string;
    label: string;
    value: string;
    description: string;
    audit: Audit;
}

export const defaultProject: Project = {
    id: 0,
    documentId: '',
    label: '',
    value: '',
    description: '',
    audit: null
}