import { addOrUpdateMeetingNote } from '@action/meeting.notes.actions';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { Description, MeetingNote, MeetingNotes, Note, defaultMeetingNote, defaultMeetingNotes } from '@model/meeting-note';
import { Member } from '@model/member';
import { Team } from '@model/team';
import { TeamMember } from '@model/team-member';
import { Store } from '@ngrx/store';
import { selectMeetingNotes, selectTeamAndMembers } from '@selector/meeting.notes.selectors';
import { ImagesService } from '@service/image.service';
import { MeetingNotesService } from '@service/meeting.notes.service';
import { MeetingNoteCommonComponent } from '@shared/components/meeting-note-common/meeting-note-common.component';
import { AuthorizeService } from '@shared/services/authorize-service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { IAppState } from '@state/app.state';
import { Timestamp } from 'firebase/firestore';
import { cloneDeep, find, remove } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-on-behalf-of-note',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './on-behalf-of-note.component.html',
  styleUrl: './on-behalf-of-note.component.scss'
})
export class OnBehalfOfNoteComponent extends MeetingNoteCommonComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @ViewChild('oboForm') oboForm: ElementRef | undefined;
  onBehalfOfNoteForm: FormGroup;

  meetingNotes: MeetingNotes = cloneDeep(defaultMeetingNotes);
  meetingNote: MeetingNote = cloneDeep(defaultMeetingNote);

  tempDes: { isUpdateDescription: boolean, description: Description | undefined } = { isUpdateDescription: false, description: undefined };
  isAlreadyExist = false;

  filteredTeams: Team[] = [];

  controlDependencyMap: Record<string, string[]> = {
    team: ['member'],
    member: ['projectName', 'isAbsence'],
    projectName: ['description'],
    isAbsence: ['absenceReason']
  };

  constructor(
    private fb: FormBuilder,
    private authorizeService: AuthorizeService,
    public override store: Store<IAppState>,
    public meetingNotesService: MeetingNotesService,
    public msgService: ToastMessageService,
    public imageService: ImagesService
  ) {
    super(store);
  }

  ngOnInit(): void {
    this.initializeOnBehalfOfNotesForm();
    this.initializeControlDependencies();
    this.initializedSpecificTeam();
    this.subscribeToMeetingNotes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeOnBehalfOfNotesForm(): void {
    this.onBehalfOfNoteForm = this.fb.group({
      team: ['', [Validators.required]],
      member: [{ value: '', disabled: true }, [Validators.required]],
      projectName: [{ value: '', disabled: true }, [Validators.required]],
      description: [{ value: '', disabled: true }, [Validators.required]],
      isAbsence: [{ value: false, disabled: true }],
      absenceReason: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  private initializeControlDependencies(): void {
    Object.keys(this.controlDependencyMap).forEach(triggerControl => {
      this.controlDependencyMap[triggerControl].forEach(dependentControl => {
        this.toggleControlBasedOnValue(triggerControl, dependentControl);
      });
    });
  }

  private initializedSpecificTeam(): void {
    if (this.authorizeService.isTeamLead && !this.authorizeService.isAdmin) {
      this.store.select(selectTeamAndMembers).pipe(takeUntil(this.unsubscribe$)).subscribe((teamMember: TeamMember) => {
        this.filteredTeams = this.teams.filter(team => team.id == teamMember?.team?.id);
        this.onBehalfOfNoteForm.patchValue({
          team: teamMember?.team
        });
      });
      this.onBehalfOfNoteForm.get('team').disable();
    } else {
      this.filteredTeams = this.teams;
      this.onBehalfOfNoteForm.get('team').enable();
    }
  }

  private toggleControlBasedOnValue(controlToWatch: string, controlToToggle: string): void {
    this.onBehalfOfNoteForm.get(controlToWatch)?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        const control = this.onBehalfOfNoteForm.get(controlToToggle);
        value ? control?.enable() : control?.disable();
      });
  }

  private subscribeToMeetingNotes(): void {
    this.store.select(selectMeetingNotes).pipe(takeUntil(this.unsubscribe$)).subscribe((meetingNotes) => {
      this.meetingNotes = cloneDeep(meetingNotes);
    });
  }

  onTeamChange(team: Team): void {
    if (team && this.meetingNote.teamName !== team.name) {
      this.onBehalfOfNoteForm.get('member')?.setValue(undefined);
    }
  }

  onMemberChange(member: Member): void {
    if (member) {
      const userId = this.extractIdFromUser(member?.name);
      this.meetingNote = find(this.meetingNotes.meetingNotes, { id: userId }) || cloneDeep(defaultMeetingNote);

      this.isAlreadyExist = !!(this.meetingNote.isAbsence || this.meetingNote.absenceReason || this.meetingNote.notes?.length);

      this.onBehalfOfNoteForm.patchValue({
        isAbsence: this.meetingNote.isAbsence,
        absenceReason: this.meetingNote.absenceReason
      });
    }
  }

  get team(): Team {
    return this.getFormControlValue<Team>('team');
  }

  get member(): Member {
    return this.getFormControlValue<Member>('member');
  }

  get projectName(): string {
    return this.getFormControlValue<string>('projectName');
  }

  get description(): string {
    return this.getFormControlValue<string>('description');
  }

  get isAbsence(): boolean {
    return this.getFormControlValue<boolean>('isAbsence');
  }

  get absenceReason(): string {
    return this.getFormControlValue<string>('absenceReason');
  }

  private getFormControlValue<T>(controlName: string): T {
    return this.onBehalfOfNoteForm.get(controlName)?.value;
  }

  public cancel(): void {
    this.resetForm(this.onBehalfOfNoteForm);
  }

  public addOrUpdateOnBehalfOfNote(): void {
    this.updateFormValidators();
    this.markInvalidControls(this.onBehalfOfNoteForm);

    if (this.onBehalfOfNoteForm.invalid) {
      return;
    }

    this.isAbsence ? this.handleAbsenceNote() : this.handleNonAbsenceNote();
    this.meetingNote = { ...this.meetingNote, isAbsence: this.isAbsence };
    this.save();
  }

  private handleAbsenceNote(): void {
    this.meetingNote = { ...this.meetingNote, isAbsence: this.isAbsence, absenceReason: this.absenceReason };
  }

  private handleNonAbsenceNote(): void {
    const existingNote = this.findExistingNote();
    const newDescription = this.createNewDescription(existingNote);

    if (existingNote) {
      this.updateExistingNoteDescriptions(existingNote, newDescription);
    } else {
      this.addNewNoteWithDescription(newDescription);
    }
  }

  private createNewDescription(existingNote: Note | undefined): Description {
    const descriptionId = this.tempDes.description?.id || (existingNote ? existingNote.descriptions.length + 1 : 1);
    return { id: descriptionId, value: this.description, noteId: existingNote ? existingNote.id : 1 };
  }

  private findExistingNote(): Note | undefined {
    return this.meetingNote.notes.find(note => note.projectName === this.projectName);
  }

  private updateExistingNoteDescriptions(existingNote: Note, newDescription: Description): void {
    const updatedDescriptions = this.tempDes.isUpdateDescription
      ? existingNote.descriptions.map(desc => desc.id === newDescription.id ? newDescription : desc)
      : [...existingNote.descriptions, newDescription];

    const updatedNote = { ...existingNote, descriptions: updatedDescriptions };

    this.meetingNote = {
      ...this.meetingNote,
      notes: this.meetingNote.notes.map(note => note.id === existingNote.id ? updatedNote : note)
    };

    this.tempDes = { isUpdateDescription: false, description: undefined };
    this.isAlreadyExist = true;
  }

  private addNewNoteWithDescription(newDescription: Description): void {
    const noteId = this.meetingNote.notes.length + 1;
    const note: Note = {
      id: noteId,
      meetingNoteId: this.meetingNote.id,
      projectName: this.projectName,
      descriptions: [newDescription]
    };

    this.meetingNote.notes.push(note);
    this.isAlreadyExist = false;
  }

  public editDescription(description: Description): void {
    const note = find(this.meetingNote.notes, { id: description.noteId });

    if (note) {
      this.onBehalfOfNoteForm.setValue({
        projectName: note.projectName,
        team: find(this.teams, { value: this.meetingNote.teamName }),
        member: find(this.members, { name: this.meetingNote.teamMemberName }),
        description: description.value,
        isAbsence: this.meetingNote.isAbsence,
        absenceReason: this.meetingNote.absenceReason
      });

      this.tempDes = { isUpdateDescription: true, description: description };
      this.scrollToTop(this.oboForm);
    }
  }

  public deleteDescription(note: Note, description: Description): void {
    remove(note.descriptions, d => d.id === description.id);
    this.save(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.currentTab?.name === 'On Behalf Of') {
      if (event.ctrlKey && event.key === 'Enter') {
        this.addOrUpdateOnBehalfOfNote();
      }

      if (event.ctrlKey && event.key.toUpperCase() === 'Q') {
        this.cancel();
      }
    }
  }

  private save(isDelete: boolean = false): void {
    if (!isDelete) {
      this.updateAuditInfo();
    }

    const noteId = this.extractIdFromUser(this.member.name);
    this.store.dispatch(addOrUpdateMeetingNote({ id: noteId, meetingNote: this.meetingNote }));

    this.meetingNotesService.save(this.weeklyMeetingNoteId, this.meetingNotes).then(() => {
      this.handleSaveSuccess(isDelete);
    });
  }

  private handleSaveSuccess(isDelete: boolean): void {
    const action = isDelete ? 'deleted' : this.isAlreadyExist ? 'updated' : 'created';
    const successMessage = `The weekly meeting note has been ${action} successfully.`;
    this.msgService.success(successMessage);
    this.meetingNote = cloneDeep(defaultMeetingNote);
    this.resetForm(this.onBehalfOfNoteForm);
  }

  private updateAuditInfo(): void {
    const timestamp = Timestamp.now();
    this.meetingNote.audit = this.isAlreadyExist
      ? { ...this.meetingNote.audit, updatedDate: timestamp, updatedBy: this.authInfo.user.name }
      : { ...this.meetingNote.audit, createdDate: timestamp, createdBy: this.authInfo.user.name };
    this.meetingNote.submittedDate = this.isAlreadyExist ? this.meetingNote.submittedDate : timestamp;
  }

  private updateFormValidators(): void {
    if (!this.isAbsence) {
      this.onBehalfOfNoteForm.get('absenceReason').removeValidators(Validators.required);
      this.onBehalfOfNoteForm.get('projectName').addValidators(Validators.required);
      this.onBehalfOfNoteForm.get('description').addValidators(Validators.required);
    } else {
      this.onBehalfOfNoteForm.get('absenceReason').addValidators(Validators.required);
      this.onBehalfOfNoteForm.get('projectName').removeValidators(Validators.required);
      this.onBehalfOfNoteForm.get('description').removeValidators(Validators.required);
    }
  }
}