import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingNotesState } from '@state/meeting.notes.state';

export const selectMeetingNotesState = createFeatureSelector<MeetingNotesState>('meetingNotes');

export const selectMeetingNotes = createSelector(selectMeetingNotesState, (state) => state.meetingNotes);
export const selectMeetingNotesLoading = createSelector(selectMeetingNotesState, (state) => state.loading);
export const selectMeetingNotesError = createSelector(selectMeetingNotesState, (state) => state.error);

export const selectAllTeamsMembersMeetingNotes = createSelector(selectMeetingNotesState, (state) => state.allTeamMemberNotes);
export const selectWeeklyMeetingNote = createSelector(selectMeetingNotesState, (state) => state.weeklyMeetingNote);

export const selectTeamAndMembers = createSelector(selectMeetingNotesState, (state) => state.teamMember);