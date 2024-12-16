import { Audit, defaultAudit } from "./audit";
import { Member } from "./member";

export interface Team {
    id: string;
    name: string;
    displayName: string;
    members: Member[];
    leader: string;
    audit: Audit;
}

export const defaultTeamData: Team = {
    id: '',
    name: '',
    displayName: '',
    members: [],
    leader: '',
    audit: defaultAudit
}