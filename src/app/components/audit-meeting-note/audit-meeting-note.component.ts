import { Component, OnInit } from '@angular/core';
import { APP_IMPORTS, COMPONENT_IMPORTS } from '@import';
import { MeetingNote, MeetingNotes } from '@model/meeting-note';
import { Member } from '@model/member';
import { Team } from '@model/team';
import { Store } from '@ngrx/store';
import { selectMeetingNotesHistory } from '@selector/meeting.notes.history.selectors';
import { selectMembers } from '@selector/member.selectors';
import { selectTeams } from '@selector/team.selectors';
import { DateUtils } from '@shared/utils/date.util';
import { IAppState } from '@state/app.state';
import { Timestamp } from 'firebase/firestore';
import { cloneDeep, Dictionary, groupBy } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-audit-meeting-note',
  standalone: true,
  imports: [APP_IMPORTS, COMPONENT_IMPORTS],
  templateUrl: './audit-meeting-note.component.html',
  styleUrl: './audit-meeting-note.component.scss'
})
export class AuditMeetingNoteComponent implements OnInit {
  weeklyMeetingNoteId = DateUtils.formatDate(DateUtils.firstDayOfWeek, 'ddMMyyyy') + DateUtils.formatDate(DateUtils.lastDayOfWeek, 'ddMMyyyy');

  teams: Team[] = [];
  members: Member[] = [];
  meetingNotes: { id: string, notes: Dictionary<MeetingNote[]> }[] = [];

  constructor(
    private store: Store<IAppState>,
  ) {
  }

  ngOnInit(): void {
    this.prepareMeetingNotes();
  }

  private async prepareMeetingNotes(): Promise<void> {
    try {
      this.members = await firstValueFrom(this.store.select(selectMembers));
      this.teams = await firstValueFrom(this.store.select(selectTeams));
      this.store.select(selectMeetingNotesHistory).subscribe(notes => {
        this.meetingNotes = cloneDeep(notes)
          .sort((m1, m2) => {
            const date1 = m1.audit.createdDate instanceof Timestamp ? m1.audit.createdDate.toDate() : new Date(m1.audit.createdDate);
            const date2 = m2.audit.createdDate instanceof Timestamp ? m2.audit.createdDate.toDate() : new Date(m2.audit.createdDate);
            return date2.getTime() - date1.getTime();
          })
          .map(m => {
            return {
              id: m.id,
              notes: this.groupByTeamName(m)
            };
          });
      });
    } catch (error) {
      console.error('Error preparing meeting notes:', error);
    }
  }

  groupByTeamName(notes: MeetingNotes): Dictionary<MeetingNote[]> {
    return groupBy(notes.meetingNotes, 'teamName')
  }

  formatDateRange(dateString: string): string {
    const formatDatePart = (datePart: string): string => `${datePart.substring(0, 2)}-${datePart.substring(2, 4)}-${datePart.substring(4)}`;
    const startDate = formatDatePart(dateString.substring(0, 8));
    const endDate = formatDatePart(dateString.substring(8));

    return `${startDate} to ${endDate}`;
  }
}
