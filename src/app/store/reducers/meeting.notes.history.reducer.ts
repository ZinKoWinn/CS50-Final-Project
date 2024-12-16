import { createReducer, on } from '@ngrx/store';
import * as meetingNotesHistoryActions from '@action/meeting.notes.history.actions';
import { initialMeetingNotesHistoryState } from '@state/meeting.notes.history.state';

export const meetingNotesHistoryReducer = createReducer(
    initialMeetingNotesHistoryState,
    on(meetingNotesHistoryActions.loadMeetingNotesHistory, (state) => ({ ...state, loading: true })),
    on(meetingNotesHistoryActions.loadMeetingNotesHistorySuccess, (state, { meetingNotesHistory }) => ({ ...state, meetingNotesHistory, loading: false, error: null })),
    on(meetingNotesHistoryActions.loadMeetingNotesHistoryFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
