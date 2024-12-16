import { createReducer, on } from '@ngrx/store';
import * as teamActions from '@action/team.actions';
import { initialTeamState } from '@state/team.state';


export const teamReducer = createReducer(
    initialTeamState,
    on(teamActions.loadTeams, (state) => ({ ...state, loading: true })),
    on(teamActions.loadTeamsSuccess, (state, { teams }) => ({ ...state, teams, loading: false, error: null })),
    on(teamActions.loadTeamsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);