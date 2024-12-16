import { Inject, Injectable } from "@angular/core";
import { MeetingNote, Note } from "@model/meeting-note";
import { ToastMessageService } from "@shared/services/toast-message.service";
import { cloneDeep, Dictionary } from "lodash";

@Injectable({
    providedIn: 'root'
})
export class MeetingNoteFormatter {
    constructor(
        private msgService: ToastMessageService,
        @Inject('Navigator') private navigator: Navigator,
    ) { }

    formatMeetingNotes(meetingNotes: Dictionary<MeetingNote[]>): string {
        const sortedMeetingNotes = this.sortMeetingNotesByTeam(meetingNotes);
        return Object.entries(sortedMeetingNotes)
            .map(([team, notes]) => `Team: ${team}\n${this.formatMeetingNotesForTeam(notes)}`)
            .join('----------------------------------------------------------------------------------------------------------------------------------\n');
    }

    formatMeetingNoteDetails(meetingNote: MeetingNote): string {
        const { teamMemberName, notes, isAbsence, absenceReason } = meetingNote;
        let result = `Team Member Name: ${teamMemberName}\n`;

        if (isAbsence) {
            result += `Absence (The whole week)\n\t\t\t- ${absenceReason}\n`;
        } else {
            const sortedNotes = notes.sort((a, b) => a.projectName.toLowerCase().localeCompare(b.projectName.toLowerCase()));
            result += sortedNotes.map(note => this.formatNoteDetails(note)).join('');
        }

        return result + '\n';
    }

    private sortMeetingNotesByTeam(meetingNotes: Dictionary<MeetingNote[]>): Dictionary<MeetingNote[]> {
        let datas = cloneDeep(meetingNotes);
        return Object.fromEntries(Object.entries(datas).sort(([a], [b]) => a.localeCompare(b)));
    }

    private formatMeetingNotesForTeam(meetingNotesForTeam: MeetingNote[]): string {
        const sortedTeamNotes = this.sortTeamNotes(meetingNotesForTeam);
        return sortedTeamNotes.map(note => this.formatMeetingNoteDetails(note)).join('');
    }

    private sortTeamNotes(meetingNotesForTeam: MeetingNote[]): MeetingNote[] {
        const teamLeader = meetingNotesForTeam.filter(m => m.teamMemberName === m.teamName);
        const teamMembers = meetingNotesForTeam.filter(m => m.teamMemberName !== m.teamName).sort((m1, m2) => m1.teamMemberName.localeCompare(m2.teamMemberName));
        return [...teamLeader, ...teamMembers];
    }

    private formatNoteDetails(note: Note): string {
        if (!note?.descriptions?.length) return '';

        const sortedDescriptions = note.descriptions.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
        const descriptions = sortedDescriptions.map(description =>
            description.value.trim().split('\n').map(desc => 
                desc ? `\t\t\t- ${desc}\n` : ''
            ).join('')
        ).join('');
        
        return `Project: ${note.projectName}\n${descriptions}\n`;
    }

    copyToClipboard(content: string): void {
        this.navigator.clipboard.writeText(content)
            .then(() => this.msgService.success("Copied"))
            .catch(err => {
                console.error(err);
                this.msgService.error('Unable to copy text to clipboard');
            });
    }
}