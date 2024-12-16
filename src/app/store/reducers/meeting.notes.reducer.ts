import { createReducer, on } from '@ngrx/store';
import * as meetingNotesActions from '@action/meeting.notes.actions';
import { initialMeetingNotesState } from '@state/meeting.notes.state';


export const meetingNotesServiceReducer = createReducer(
    initialMeetingNotesState,
    on(meetingNotesActions.loadMeetingNotes, (state) => ({ ...state, loading: true })),
    on(meetingNotesActions.loadMeetingNotesSuccess, (state, { meetingNotes }) => ({ ...state, meetingNotes, loading: false, error: null })),
    on(meetingNotesActions.loadMeetingNotesFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(meetingNotesActions.addAllTeamsMembersNotes, (state, { allTeamMemberNotes }) => ({ ...state, allTeamMemberNotes })),

    on(meetingNotesActions.addOrUpdateMeetingNote, (state, { id, meetingNote }) => {
        const meetingNotesIndex = state.meetingNotes.meetingNotes.findIndex(note => note.id === id);
        const updatedMeetingNotes = state.meetingNotes.meetingNotes.map((note, index) =>
            index === meetingNotesIndex ? { ...note, ...meetingNote } : note
        );
        return {
            ...state,
            meetingNotes: {
                ...state.meetingNotes,
                meetingNotes: updatedMeetingNotes,
            },
            weeklyMeetingNote: meetingNote
        };
    }),

    on(meetingNotesActions.initializedCurentTeamMember, (state, { teamMember }) => ({ ...state, teamMember })),
);
