import { Member } from "./member";
import { Team } from "./team";

export interface TeamMember {
    team: Team;
    member: Member;
}

export const defaultTeamMember: TeamMember = {
    team: undefined,
    member: undefined
}