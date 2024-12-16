import { Project } from "src/app/core/models/project";
import { Team } from "src/app/core/models/team";
import { Audit, defaultAudit } from "./audit";
import { Timestamp } from "firebase/firestore";

export interface MeetingNotes {
    id: string;
    isArchived: boolean;
    meetingNotes: MeetingNote[];
    audit: Audit;
}

export const defaultMeetingNotes: MeetingNotes = {
    id: '',
    isArchived: false,
    meetingNotes: [],
    audit: defaultAudit
}

export interface MeetingNote {
    id: string;
    teamName: string;
    teamMemberName: string;
    submittedDate: Timestamp;
    notes: Note[];
    isAbsence: boolean;
    absenceReason: string;
    audit: Audit;
}

export const defaultMeetingNote: MeetingNote = {
    id: '',
    teamName: '',
    teamMemberName: '',
    submittedDate: Timestamp.now(),
    notes: [],
    isAbsence: false,
    absenceReason: '',
    audit: defaultAudit
}

export interface Note {
    id: number;
    meetingNoteId: string;
    projectName: string;
    descriptions: Description[];
}

export const defaultNote: Note = {
    id: 0,
    meetingNoteId: '',
    projectName: '',
    descriptions: []
}

export interface Description {
    id: number;
    noteId: number;
    value: string;
}

export interface TeamsAndProjects {
    teams: Team[];
    projects: Project[];
}