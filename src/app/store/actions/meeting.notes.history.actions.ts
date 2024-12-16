import { createAction, props } from '@ngrx/store';
import { MeetingNotes } from '@model/meeting-note';

export const loadMeetingNotesHistory = createAction('[MeetingNotes History] Load MeetingNotes History');
export const loadMeetingNotesHistorySuccess = createAction('[MeetingNotes History] Load MeetingNotes HistorySuccess', props<{ meetingNotesHistory: MeetingNotes[] }>());
export const loadMeetingNotesHistoryFailure = createAction('[MeetingNotes History] Load MeetingNotes HistoryFailure', props<{ error: any }>());