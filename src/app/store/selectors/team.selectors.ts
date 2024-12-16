import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamState } from '@state/team.state';

export const selectTeamState = createFeatureSelector<TeamState>('teams');

export const selectTeams = createSelector(selectTeamState, (state) => state.teams);
export const selectTeamsLoading = createSelector(selectTeamState, (state) => state.loading);
export const selectTeamsError = createSelector(selectTeamState, (state) => state.error);

export const getTeamById = (teamId: string) => createSelector(
    selectTeamState,
    (state) => state.teams.find((team) => team.id === teamId)
);

export const selectTeamByName = (teamName: string) => createSelector(
    selectTeamState,
    (state) => state.teams.find(team => team.name === teamName)
  );