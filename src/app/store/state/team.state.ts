import { Team } from "@model/team";

export interface TeamState {
    teams: Team[];
    loading: boolean;
    error: any;
}

export const initialTeamState: TeamState = {
    teams: [],
    loading: false,
    error: null,
};
