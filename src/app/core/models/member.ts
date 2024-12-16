import { Audit, defaultAudit } from "./audit";
export interface Member {
    id: string;
    name: string;
    teamId: string;
    isTeamLeader: boolean;
    description: string;
    audit: Audit;
}

export const defaultMember = {
    id: '',
    name: '',
    teamId: '',
    isTeamLeader: false,
    description: '',
    audit: defaultAudit
}