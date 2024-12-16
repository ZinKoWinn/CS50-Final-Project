import { createAction, props } from '@ngrx/store';
import { MeetingNote, MeetingNotes } from '@model/meeting-note';
import { Dictionary } from 'lodash';
import { TeamMember } from '@model/team-member';

export const loadMeetingNotes = createAction('[MeetingNotes] Load MeetingNotes');
export const loadMeetingNotesSuccess = createAction('[MeetingNotes] Load MeetingNotes Success', props<{ meetingNotes: MeetingNotes }>());
export const loadMeetingNotesFailure = createAction('[MeetingNotes] Load MeetingNotes Failure', props<{ error: any }>());

export const addAllTeamsMembersNotes = createAction('[MeetingNotes] Add All Teams Members Notes', props<{ allTeamMemberNotes: Dictionary<MeetingNote[]> }>());

export const addOrUpdateMeetingNote = createAction('[Meeting Note] Add Or Update Meeting Note', props<{ id: string, meetingNote: MeetingNote }>());

export const initializedCurentTeamMember = createAction('[Team] Initialized current user team and member', props<{ teamMember: TeamMember }>());