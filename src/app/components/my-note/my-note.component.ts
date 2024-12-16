import { addOrUpdateMeetingNote } from "@action/meeting.notes.actions";
import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environment";
import { APP_IMPORTS, PIPE_IMPORTS } from "@import";
import { Description, MeetingNote, MeetingNotes, Note, defaultMeetingNote, defaultMeetingNotes } from "@model/meeting-note";
import { Member, defaultMember } from "@model/member";
import { Team, defaultTeamData } from "@model/team";
import { Store } from "@ngrx/store";
import { selectMeetingNotes } from "@selector/meeting.notes.selectors";
import { MeetingNoteFormatter } from "@service/meeting.note.formatter";
import { MeetingNotesService } from "@service/meeting.notes.service";
import { MeetingNoteCommonComponent } from "@shared/components/meeting-note-common/meeting-note-common.component";
import { ToastMessageService } from "@shared/services/toast-message.service";
import { IAppState } from "@state/app.state";
import { Timestamp } from "firebase/firestore";
import { cloneDeep, find, remove } from "lodash";
import { filter, from, switchMap, take, tap } from "rxjs";

@Component({
  selector: 'app-my-note',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './my-note.component.html',
  styleUrl: './my-note.component.scss'
})
export class MyNoteComponent extends MeetingNoteCommonComponent implements OnInit {
  @ViewChild('mtnForm') mtnForm: ElementRef | undefined;

  meetingNoteForm: FormGroup;
  meetingNote: MeetingNote = { ...defaultMeetingNote };
  meetingNotes: MeetingNotes = { ...defaultMeetingNotes };
  userTeam: Team = { ...defaultTeamData };
  member: Member = { ...defaultMember };

  tempDes: { isUpdateDescription: boolean, description: Description | undefined } = { isUpdateDescription: false, description: undefined };
  isAlreadyExist = false;

  constructor(
    private fb: FormBuilder,
    private msgService: ToastMessageService,
    private formatter: MeetingNoteFormatter,
    private meetingNoteService: MeetingNotesService,
    public override store: Store<IAppState>,
  ) {
    super(store);
  }

  ngOnInit(): void {
    this.initializeMyNotesForm();
    this.initializeUserTeam();
    this.subscribeToMeetingNotes();
  }

  private initializeMyNotesForm(): void {
    this.meetingNoteForm = this.fb.group({
      projectName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  private initializeUserTeam(): void {
    this.member = find(this.members, { name: this.authInfo?.user?.name });
    this.userTeam = find(this.teams, { id: this.member?.teamId });
  }

  get projectName(): string {
    return this.meetingNoteForm.get('projectName')?.value;
  }

  get description(): string {
    const desc: string = this.meetingNoteForm.get('description')?.value;
    return desc.replaceAll(/[-]+/g, '');
  }

  private findExistingNote(): Note | undefined {
    return this.meetingNote.notes.find(note => note.projectName === this.projectName);
  }

  private createNewDescription(existingNote: Note | undefined): Description {
    const descriptionId = this.tempDes.description?.id || (existingNote ? existingNote.descriptions.length + 1 : 1);
    return { id: descriptionId, value: this.description, noteId: existingNote ? existingNote.id : this.meetingNote.notes.length + 1 };
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
  }

  private addNewNoteWithDescription(newDescription: Description): void {
    const noteId = this.meetingNote.notes.length + 1;
    const note: Note = {
      id: noteId,
      meetingNoteId: this.meetingNote.id,
      projectName: this.projectName,
      descriptions: [newDescription]
    };
    this.meetingNote.notes = [...this.meetingNote.notes, note];
  }

  private save(isDelete: boolean = false): void {
    if (!isDelete) {
      this.updateAuditInfo();
    }

    const noteId = this.extractIdFromUser(this.authInfo.user.name);
    this.store.dispatch(addOrUpdateMeetingNote({ id: noteId, meetingNote: this.meetingNote }));

    this.meetingNoteService.save(this.weeklyMeetingNoteId, this.meetingNotes).then(() => {
      this.handleSaveSuccess(isDelete);
    });
  }

  private updateAuditInfo(): void {
    const timestamp = Timestamp.now();
    const updatedAudit = this.isAlreadyExist
      ? { ...this.meetingNote.audit, updatedDate: timestamp, updatedBy: this.authInfo.user.name }
      : { ...this.meetingNote.audit, createdDate: timestamp, createdBy: this.authInfo.user.name };

    this.meetingNote = {
      ...this.meetingNote,
      audit: updatedAudit,
      submittedDate: this.isAlreadyExist ? this.meetingNote.submittedDate : timestamp
    };
  }

  private handleSaveSuccess(isDelete: boolean): void {
    const action = isDelete ? 'deleted' : this.isAlreadyExist ? 'updated' : 'created';
    const successMessage = `The weekly meeting note has been ${action} successfully.`;
    this.msgService.success(successMessage);
    this.meetingNoteForm.controls['projectName'].enable();
    this.meetingNoteForm.controls['projectName'].enable();
    this.resetForm(this.meetingNoteForm);
  }

  private subscribeToMeetingNotes(): void {
    this.store.select(selectMeetingNotes).pipe(
      filter(mn => !!mn),
      tap(mn => this.meetingNotes = cloneDeep(mn)),
      switchMap(mn => from(mn.meetingNotes).pipe(
        filter((note: MeetingNote) => note.id === this.extractIdFromUser(this.authInfo.user.name)),
        take(1)
      )),
      tap((note: MeetingNote | undefined) => {
        this.meetingNote = cloneDeep(note) || cloneDeep(this.createDefaultMeetingNote());
        this.isAlreadyExist = !!note;
      })
    ).subscribe();
  }

  private createDefaultMeetingNote(): MeetingNote {
    return {
      ...defaultMeetingNote,
      id: this.extractIdFromUser(this.authInfo.user.name),
      teamName: this.userTeam?.name,
      teamMemberName: this.authInfo?.user?.name,
    };
  }

  editDescription(description: Description): void {
    const note = find(this.meetingNote.notes, { id: description.noteId });

    if (note) {
      this.meetingNoteForm.setValue({
        projectName: note.projectName,
        description: description.value
      });

      this.tempDes = { isUpdateDescription: true, description: description };
      this.meetingNoteForm.controls['projectName'].disable();
      this.scrollToTop(this.mtnForm);
    }
  }

  deleteDescription(note: Note, description: Description): void {
    remove(note.descriptions, d => d.id === description.id);
    this.save(true);
  }

  cancel(): void {
    this.resetForm(this.meetingNoteForm);
    this.meetingNoteForm.controls['projectName'].enable();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.currentTab.name === 'My Note') {
      if (event.ctrlKey && event.key === 'Enter') {
        this.addOrUpdateNote();
      }

      if (event.ctrlKey && event.key.toUpperCase() === 'Q') {
        this.cancel();
      }
    }
  }

  formatNoteForSpecificUser(meetingNote: MeetingNote): void {
    const formattedNote = this.formatter.formatMeetingNoteDetails(meetingNote);
    this.formatter.copyToClipboard(formattedNote);
  }

  addOrUpdateNote(): void {
    this.markInvalidControls(this.meetingNoteForm);

    if (this.meetingNoteForm.invalid) {
      return;
    }

    const existingNote = this.findExistingNote();
    const newDescription = this.createNewDescription(existingNote);

    if (existingNote) {
      this.updateExistingNoteDescriptions(existingNote, newDescription);
    } else {
      this.addNewNoteWithDescription(newDescription);
    }

    this.save();
  }
}