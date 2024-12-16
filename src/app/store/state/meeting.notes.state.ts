import { defaultMeetingNote, defaultMeetingNotes, MeetingNote, MeetingNotes } from "@model/meeting-note";
import { TeamMember } from "@model/team-member";
import { cloneDeep, Dictionary } from "lodash";

export interface MeetingNotesState {
    meetingNotes: MeetingNotes;
    weeklyMeetingNote: MeetingNote;
    allTeamMemberNotes: Dictionary<MeetingNote[]>;
    teamMember: TeamMember;
    loading: boolean;
    error: any;
}

export const initialMeetingNotesState: MeetingNotesState = {
    meetingNotes: cloneDeep(defaultMeetingNotes),
    weeklyMeetingNote: cloneDeep(defaultMeetingNote),
    allTeamMemberNotes: {},
    teamMember: undefined,
    loading: false,
    error: null,
};
