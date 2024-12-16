import { AuthState } from "./auth.state";
import { GeneralSettingState } from "./general-setting.state";
import { MeetingNotesHistoryState } from "./meeting.notes.history.state";
import { MeetingNotesState } from "./meeting.notes.state";
import { MemberState } from "./member.state";
import { ProjectState } from "./project.state";
import { TeamState } from "./team.state";
import { UserState } from "./user.state";

export interface IAppState {
    authInfo: AuthState,
    users: UserState,
    teams: TeamState,
    members: MemberState,
    projects: ProjectState,
    meetingNotes: MeetingNotesState,
    generalSetting: GeneralSettingState,
    meetingNotesHistory: MeetingNotesHistoryState
}
