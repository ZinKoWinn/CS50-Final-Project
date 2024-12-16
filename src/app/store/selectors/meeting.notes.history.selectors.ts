import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingNotesHistoryState } from '@state/meeting.notes.history.state';

export const selectMeetingNotesHistoryState = createFeatureSelector<MeetingNotesHistoryState>('meetingNotesHistory');

export const selectMeetingNotesHistory = createSelector(selectMeetingNotesHistoryState, (state) => state.meetingNotesHistory);
export const selectMeetingNotesHistoryLoading = createSelector(selectMeetingNotesHistoryState, (state) => state.loading);
export const selectMeetingNotesHistoryError = createSelector(selectMeetingNotesHistoryState, (state) => state.error);