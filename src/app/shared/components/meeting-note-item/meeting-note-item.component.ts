import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { MeetingNote } from '@model/meeting-note';
import { Member } from '@model/member';
import { Team } from '@model/team';
import { Store } from '@ngrx/store';
import { selectMembers } from '@selector/member.selectors';
import { getTeamById } from '@selector/team.selectors';
import { ImagesService } from '@service/image.service';
import { MeetingNoteFormatter } from '@service/meeting.note.formatter';
import { AuthorizeService } from '@shared/services/authorize-service';
import { IAppState } from '@state/app.state';
import { Dictionary, find, groupBy } from 'lodash';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-meeting-note-item',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './meeting-note-item.component.html',
  styleUrl: './meeting-note-item.component.scss'
})
export class MeetingNoteItemComponent {
  @Input('meetingNotes') meetingNotes: Dictionary<MeetingNote[]> = {};
  @Input('unsubmittedMembers') unsubmittedMembers: Member[] = [];

  @ViewChild('weeklyMeetingNote', { static: true }) templateRef: ElementRef;

  members: Member[] = [];

  constructor(
    private store: Store<IAppState>,
    private formatter: MeetingNoteFormatter,
    public authorizeService: AuthorizeService,
    public imageService: ImagesService
  ) {
    this.store.select(selectMembers).subscribe(members => this.members = members);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.unsubmittedMembers.length === 0) {
      this.updateUnsubmittedMembers();
    }
  }

  isSubmitted(meetingNote: MeetingNote): boolean {
    const isSubmit = meetingNote && (meetingNote.isAbsence || (meetingNote.notes &&
      meetingNote.notes.length > 0 && meetingNote.notes.some(note => note.descriptions && note.descriptions.length > 0)));
    return isSubmit;
  }

  get unSubmittedMembersByTeam(): Dictionary<Member[]> {
    return groupBy(this.unsubmittedMembers, 'teamId');
  }

  getTeamById(teamId: string): Observable<Team> {
    return this.store.select(getTeamById(teamId));
  }

  isEmptyDictionary(dictionary: Dictionary<any>): boolean {
    return Object.keys(dictionary).length === 0;
  }

  formatNote(meetingNotes: Dictionary<MeetingNote[]>): void {
    let formattedNotes = this.formatter.formatMeetingNotes(meetingNotes);
    console.log(formattedNotes);
    this.formatter.copyToClipboard(formattedNotes);
  }

  private async updateUnsubmittedMembers(): Promise<void> {
    const sortedMeetingNotes = Object.fromEntries(
      Object.entries(this.meetingNotes).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const memberPromises = this.members.map(async (member) => {
      const team = await firstValueFrom(this.store.select(getTeamById(member.teamId)));
      const note = find(sortedMeetingNotes[team.name], { teamMemberName: member.name });
      return note && note.notes.length === 0 && !note.isAbsence ? member : null;
    });

    this.unsubmittedMembers = (await Promise.all(memberPromises)).filter(Boolean) as Member[];
  }
}
