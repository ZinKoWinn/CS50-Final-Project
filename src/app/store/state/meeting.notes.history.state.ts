import { MeetingNotes } from "@model/meeting-note";

export interface MeetingNotesHistoryState {
    meetingNotesHistory: MeetingNotes[];
    loading: boolean;
    error: any;
}

export const initialMeetingNotesHistoryState: MeetingNotesHistoryState = {
    meetingNotesHistory: [],
    loading: false,
    error: null,
};
