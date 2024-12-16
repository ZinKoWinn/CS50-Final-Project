import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Timestamp } from 'firebase/firestore';
import { find, Dictionary } from 'lodash';

import { selectAuthInfo } from '@selector/auth.selectors';
import { selectTeams } from '@selector/team.selectors';

import { UserService } from '@service/user.service';
import { AuthorizeService } from '@shared/services/authorize-service';

import { Team, defaultTeamData } from '@model/team';
import { AuthInfo, defaultAuthInfo } from '@model/auth.info';
import { MeetingNote } from '@model/meeting-note';
import { IAppState } from '@state/app.state';
import { Member, defaultMember } from '@model/member';
import { TabMenu } from '@shared/components/tab-menu/tab-menu.model';
import { DateUtils } from '@shared/utils/date.util';
import { APP_IMPORTS, COMPONENT_IMPORTS, PIPE_IMPORTS } from '@import';
import { selectMembers, selectUnSubmittedMembers } from '@selector/member.selectors';
import * as AuthActions from '@action/auth.actions'
import { AppTourService } from '@service/app.tour.service';
import { Images } from '@constant/images';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MeetingNotesService } from '@service/meeting.notes.service';
import { selectAllTeamsMembersMeetingNotes, selectWeeklyMeetingNote } from '@selector/meeting.notes.selectors';
import { User } from '@model/user';
import { MeetingNoteFormatter } from '@service/meeting.note.formatter';
import { initializedCurentTeamMember } from '@action/meeting.notes.actions';
import { ImagesService } from '@service/image.service';
import { UserProfileComponent } from '@shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-meeting-note',
  templateUrl: './meeting-note.component.html',
  styleUrls: ['./meeting-note.component.scss'],
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS, COMPONENT_IMPORTS]
})
export class MeetingNoteComponent implements OnInit, AfterViewInit {
  @ViewChild('myNotesContent', { read: TemplateRef }) myNotesContent!: TemplateRef<any>;
  @ViewChild('onBehalfOfContent', { read: TemplateRef }) onBehalfOfContent!: TemplateRef<any>;
  @ViewChild('teamMemberNotesContent', { read: TemplateRef }) teamMemberNotesContent!: TemplateRef<any>;
  @ViewChild('allMemberNotesContent', { read: TemplateRef }) allMemberNotesContent!: TemplateRef<any>;
  @ViewChild('meetingNoteHistoryContent', { read: TemplateRef }) meetingNoteHistoryContent!: TemplateRef<any>;
  @ViewChild('meetingNoteArchiveContent', { read: TemplateRef }) meetingNoteArchiveContent!: TemplateRef<any>;
  @ViewChild('saveQRCode', { static: false }) download!: ElementRef;

  Images = Images;

  isShowMeetingNoteHistory = false;

  teams: Team[] = [];
  members: Member[] = [];
  tabs: TabMenu[] = [];

  monthlyMeetingNoteHistory: MeetingNote[] = [];
  unsubmittedTeamMembers: Member[] = [];
  unsubmittedAllMembers: Member[] = [];

  authInfo: AuthInfo = { ...defaultAuthInfo };
  userTeam: Team = { ...defaultTeamData };
  member: Member = { ...defaultMember };

  currentTab: TabMenu;
  weeklyMeetingNote: MeetingNote;

  allTeamMemberNotes: Dictionary<MeetingNote[]> = {};
  teamMemberNotes: Dictionary<MeetingNote[]> = {};

  constructor(
    private store: Store<IAppState>,
    private userService: UserService,
    public authorizeService: AuthorizeService,
    private tourService: AppTourService,
    private cookieService: CookieService,
    private modalService: NzModalService,
    private formatter: MeetingNoteFormatter,
    protected changeDetectorRef: ChangeDetectorRef,
    private meetingNotesService: MeetingNotesService,
    public imageService: ImagesService
  ) { }

  ngOnInit() {
    this.setupPageViewAnalytics();
    this.setupData();
  }

  ngAfterViewInit(): void {
    if (this.authorizeService.isNotSuperAdmin) {
      this.showTourIfNeeded();
    }
    this.initializeTabs();
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

  onSelectTabChange(tab: TabMenu): void {
    this.currentTab = tab;
  }

  saveQRCOde(): void {
    const canvas = document.getElementById('saveQRCode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      this.download.nativeElement.href = canvas.toDataURL('image/png');
      this.download.nativeElement.download = 'meetingnote-viber-channel-qr';
      const event = new MouseEvent('click');
      this.download.nativeElement.dispatchEvent(event);
    }
  }

  showWeeklyMeetingNoteHistory(note: MeetingNote): void {
    this.weeklyMeetingNote = note;
    this.isShowMeetingNoteHistory = true;
  }

  formatNoteForSpecificUser(meetingNote: MeetingNote): void {
    let formattedNote = this.formatter.formatMeetingNoteDetails(meetingNote);
    this.formatter.copyToClipboard(formattedNote);
  }

  showProfile(): void {
    this.modalService.create({
      nzTitle: 'Profile',
      nzContent: UserProfileComponent,
      nzFooter: null
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  private setupPageViewAnalytics(): void {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Meeting Note', page_path: '/user/meeting-note' });
  }

  private initializeTabs(): void {
    const userAuthorized = this.isUserAuthorized();
    this.tabs = this.getTabs(userAuthorized);
    this.changeDetectorRef.detectChanges();
  }

  private isUserAuthorized(): boolean {
    return this.authorizeService.isUser || this.authorizeService.isTeamLead || this.authorizeService.isAdmin;
  }

  private getTabs(userAuthorized: boolean): TabMenu[] {
    const tabs: TabMenu[] = [];
    if (userAuthorized) {
      tabs.push({ name: 'My Note', icon: 'bi bi-person h5', order: 1, content: this.myNotesContent });
    }

    if (this.authorizeService.isAdmin) {
      tabs.push(
        { name: 'All Members Notes', icon: 'bi bi-journals h5', order: 4, content: this.allMemberNotesContent }
      );
    }

    if (this.authorizeService.isTeamLead || this.authorizeService.isAdmin) {
      tabs.push(
        { name: 'On Behalf Of', icon: 'bi bi-journal-text h5', order: 2, content: this.onBehalfOfContent },
        { name: 'Team Members Notes', icon: 'bi bi-people h5', order: 3, content: this.teamMemberNotesContent },
        { name: 'Meeting Note History', icon: 'bi bi-hourglass-split h5', order: 5, content: this.meetingNoteHistoryContent },
      );
    }
    return tabs;
  }

  private showTourIfNeeded(): void {
    setTimeout(() => {
      this.cookieService.set('introjs-dontShowAgain', 'false', 365);
      if (this.cookieService.get('meetingNoteTourDoNotShowAgain') !== 'true') {
        this.tourService.meetingNoteTour();
        this.setupTourDoNotShowAgainCheckbox();
      }
    }, 300);
  }

  private setupTourDoNotShowAgainCheckbox(): void {
    const checkbox = document.getElementById('introjs-dontShowAgain') as HTMLInputElement;
    checkbox.addEventListener('change', () => {
      this.cookieService.set('meetingNoteTourDoNotShowAgain', `${checkbox.checked}`, 365);
    });
  }

  private async setupData(): Promise<void> {
    this.authInfo = await firstValueFrom(this.store.select(selectAuthInfo));
    this.members = await firstValueFrom(this.store.select(selectMembers));
    this.teams = await firstValueFrom(this.store.select(selectTeams));

    this.member = find(this.members, { name: this.authInfo?.user?.name });
    this.userTeam = find(this.teams, { id: this.member?.teamId });

    this.store.dispatch(initializedCurentTeamMember({ teamMember: { member: this.member, team: this.userTeam } }));

    this.fetchAndOrganizeMeetingNotes();
    this.loadUnsubmittedMembers();
    setTimeout(() => {
      this.checkAndUpdateUserRoles();
    }, 10000)
  }

  private fetchAndOrganizeMeetingNotes(): void {
    this.store.select(selectAllTeamsMembersMeetingNotes).subscribe({
      next: (allTeamsMembersNotes: Dictionary<MeetingNote[]>) => {
        if (allTeamsMembersNotes) {
          this.allTeamMemberNotes = allTeamsMembersNotes;
          this.teamMemberNotes = this.userTeam?.name ? { [this.userTeam?.name]: this.allTeamMemberNotes[this.userTeam?.name] } : {};
        }
        this.retrieveMeetingNoteHistory();
      }
    });

    this.store.select(selectWeeklyMeetingNote).subscribe({
      next: (weeklyMeetingNote: MeetingNote) => {
        this.monthlyMeetingNoteHistory = this.monthlyMeetingNoteHistory.map((meetingNote: MeetingNote) => {
          if (meetingNote.id === weeklyMeetingNote.id) {
            return weeklyMeetingNote;
          }
          return meetingNote;
        });
      }
    })
  }

  private loadUnsubmittedMembers(): void {
    this.store.select(selectUnSubmittedMembers).subscribe({
      next: (members) => {
        this.unsubmittedAllMembers = members;
        this.unsubmittedTeamMembers = this.unsubmittedAllMembers.filter(m => m.teamId === this.userTeam?.id);
      }
    });
  }

  private retrieveMeetingNoteHistory(): void {
    this.meetingNotesService.queryByDateBetween('audit.createdDate', Timestamp.fromDate(DateUtils.firstDayOfMonth), Timestamp.fromDate(DateUtils.lastDayOfMonth)).subscribe((data) => {
      this.monthlyMeetingNoteHistory = data
        .map(mn => find(mn.meetingNotes, { teamMemberName: this.authInfo.user.name }))
        .filter(note => note && note.notes.length > 0 && !find(this.monthlyMeetingNoteHistory, { id: note.id }));
    });
  }

  private checkAndUpdateUserRoles(): void {
    this.userService.getOne(this.authInfo?.user?.uid).subscribe({
      next: (user) => {
        if (this.authInfo?.user.name === user.name && JSON.stringify(this.authInfo?.user.roles) !== JSON.stringify(user.roles)) {
          this.handleRoleChange();
        }
        this.updateAuthUser(user);
      }
    });
  }

  private handleRoleChange(): void {
    this.modalService.create({
      nzClosable: false,
      nzTitle: 'Reauthentication Required',
      nzContent: `We've noticed a change in your authorization status. To ensure security, please sign in again to continue using the system.`,
      nzCentered: true,
      nzMaskClosable: false,
      nzFooter: [
        {
          label: 'OK',
          type: 'primary',
          onClick: () => {
            this.logout();
            this.modalService.closeAll();
          }
        },
      ]
    });
  }

  private updateAuthUser(user: User): void {
    this.store.dispatch(AuthActions.updateAuthUser({ authInfo: { user: user, refreshToken: this.authInfo.refreshToken } }));
  }
}