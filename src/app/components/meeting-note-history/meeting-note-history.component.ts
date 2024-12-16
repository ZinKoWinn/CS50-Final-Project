import { Component, OnInit } from '@angular/core';
import { APP_IMPORTS, COMPONENT_IMPORTS, PIPE_IMPORTS } from '@import';
import { MeetingNote, MeetingNotes } from '@model/meeting-note';
import { MeetingNoteFormatter } from '@service/meeting.note.formatter';
import { MeetingNotesService } from '@service/meeting.notes.service';
import { cloneDeep, Dictionary, groupBy } from 'lodash';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { DateUtils } from '@shared/utils/date.util';
import { IAppState } from '@state/app.state';
import { Store } from '@ngrx/store';
import { selectMeetingNotesHistory } from '@selector/meeting.notes.history.selectors';
import { AuthorizeService } from '@shared/services/authorize-service';
import { selectTeamAndMembers } from '@selector/meeting.notes.selectors';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-meeting-note-history',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS, COMPONENT_IMPORTS],
  templateUrl: './meeting-note-history.component.html',
  styleUrl: './meeting-note-history.component.scss'
})
export class MeetingNoteHistoryComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  meetingNotes: MeetingNotes[] = [];

  initLoading = true;
  isShowMeetingNoteHistory = false;

  meetingNoteHistory: { id: string, notes: Dictionary<MeetingNote[]> };
  weeklyMeetingNoteId = DateUtils.formatDate(DateUtils.firstDayOfWeek, 'ddMMyyyy') + DateUtils.formatDate(DateUtils.lastDayOfWeek, 'ddMMyyyy');

  constructor(
    private store: Store<IAppState>,
    private formatter: MeetingNoteFormatter,
    private messageService: ToastMessageService,
    private meetingNoteService: MeetingNotesService,
    public authorizeService: AuthorizeService
  ) { }

  ngOnInit(): void {
    this.prepareMeetingNotes();
  }

  private prepareMeetingNotes(): void {
    try {
      this.store.select(selectMeetingNotesHistory).subscribe(notes => {
        this.meetingNotes = notes.sort((m1, m2) => m2.audit.createdDate.toMillis() - m1.audit.createdDate.toMillis());
        this.initLoading = false;
      })
    } catch (error) {
      console.error('Error preparing meeting note:', error);
    }
  }

  formatDateRange(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const formatDatePart = (datePart: string): string => `${datePart.substring(0, 2)}-${datePart.substring(2, 4)}-${datePart.substring(4)}`;
    const startDate = formatDatePart(dateString.substring(0, 8));
    const endDate = formatDatePart(dateString.substring(8));

    return `${startDate} to ${endDate}`;
  }

  timeStampToDate(meetingNote: MeetingNotes): Date {
    const createdDate: any = cloneDeep(meetingNote.audit.createdDate);

    if (createdDate instanceof Timestamp) {
      return createdDate.toDate();
    }

    if (createdDate.seconds && createdDate.nanoseconds) {
      return new Date(createdDate.seconds * 1000 + createdDate.nanoseconds / 1000000);
    }

    if (createdDate instanceof Date) {
      return createdDate;
    }

    throw new Error('Invalid date format');
  }
  
  delete(meetingNotes: MeetingNotes): void {
    this.meetingNoteService.delete(meetingNotes.id).then(() => {
      const message = `${this.formatDateRange(meetingNotes.id)} has been deleted successfully.`;
      this.messageService.success(message);
    });
  }

  async showMeetingNoteHistory(notes: MeetingNotes): Promise<void> {
    this.store.select(selectTeamAndMembers).pipe(takeUntil(this.unsubscribe$)).subscribe(tm => {
      const meetingNoteHistory = this.authorizeService.isAdmin ? notes.meetingNotes : notes.meetingNotes.filter(m => m.teamName === tm?.team?.name);
      this.meetingNoteHistory = { id: notes.id, notes: groupBy(meetingNoteHistory, 'teamName') };
      this.isShowMeetingNoteHistory = true;
    });
  }

  private convertToFile(meetingNotes: MeetingNotes): Blob {
    const allTeamMemberNotes: Dictionary<MeetingNote[]> = groupBy(meetingNotes.meetingNotes, 'teamName');
    const formattedNote = this.formatter.formatMeetingNotes(allTeamMemberNotes);
    const file = new Blob([formattedNote], { type: 'application/octet-stream' });
    return file;
  }
}
