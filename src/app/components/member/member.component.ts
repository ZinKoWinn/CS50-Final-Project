import { Component, OnInit } from '@angular/core';
import { logEvent } from '@angular/fire/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Images } from '@constant/images';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { Member, defaultMember } from '@model/member';
import { Team } from '@model/team';
import { Store } from '@ngrx/store';
import { selectMembers } from '@selector/member.selectors';
import { selectTeams } from '@selector/team.selectors';
import { ImagesService } from '@service/image.service';
import { MemberService } from '@service/member.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { generateUniqueId } from '@shared/utils/common.util';
import { IAppState } from '@state/app.state';
import { getAnalytics } from 'firebase/analytics';
import { cloneDeep } from 'lodash';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchValue: string = '';
  teams: Team[] = [];
  member: Member = cloneDeep(defaultMember);
  Images = Images;
  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private store: Store<IAppState>,
    private msgService: ToastMessageService,
    public imageService: ImagesService
  ) { }

  ngOnInit() {
    this.setupPageViewAnalytics();
    this.initializeForm();
    this.loadMembers();
    this.loadTeams();

    this.memberForm.get('name').valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if (value) {
        this.member = { ...this.member, id: this.member.id ? this.member.id : generateUniqueId(value) }
      }
    });
  }

  initializeForm(): void {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  setupPageViewAnalytics(): void {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Members', page_path: '/user/members' });
  }

  loadMembers(): void {
    this.store.select(selectMembers).subscribe({
      next: (result) => {
        this.members = result;
        this.filteredMembers = this.searchValue ? this.members.filter(m => m.teamId === this.searchValue) : this.members;
      },
      error: (error) => console.error('Error fetching members:', error)
    });
  }

  loadTeams(): void {
    this.store.select(selectTeams).subscribe({
      next: (result) => (this.teams = result),
      error: (error) => console.error('Error fetching teams:', error)
    });
  }

  onInputTeam(teamId: string): void {
    this.filteredMembers = teamId ? this.members.filter(m => m.teamId === teamId) : this.members;
  }

  async createOrUpdate(member: Member): Promise<void> {
    if (this.memberForm.invalid) {
      this.markInvalidControls();
      return;
    }

    try {
      await this.memberService.save(member.id, member);
      this.msgService.success(`The member information has been ${member.id ? 'updated' : 'created'} successfully.`)
    } catch (error) {
      this.msgService.error(`Unable to ${member.id ? 'update' : 'create'} member. An unexpected error occurred.`);
    } finally {
      this.resetFormAndMember();
    }
  }

  markInvalidControls(): void {
    Object.values(this.memberForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  resetFormAndMember(): void {
    this.isVisible = false;
    this.memberForm.reset();
    this.member = cloneDeep(defaultMember);
  }

  edit(member: Member): void {
    this.member = cloneDeep(member);
    this.isVisible = !this.isVisible;
  }

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.resetFormAndMember();
  }

  delete(documentId: string) {
    this.memberService.delete(documentId).then(() => {
      this.msgService.success('Member deleted successfully.')
    });
  }
}
