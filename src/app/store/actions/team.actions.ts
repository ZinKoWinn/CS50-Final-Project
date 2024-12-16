
import { createAction, props } from '@ngrx/store';
import { Team } from '@model/team';

export const loadTeams = createAction('[Team] Load Teams');
export const loadTeamsSuccess = createAction('[Team] Load Teams Success', props<{ teams: Team[] }>());
export const loadTeamsFailure = createAction('[Team] Load Teams Failure', props<{ error: any }>());