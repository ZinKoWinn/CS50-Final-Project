import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Images } from '@constant/images';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { Member } from '@model/member';
import { Team, defaultTeamData } from '@model/team';
import { Store } from '@ngrx/store';
import { selectMembers } from '@selector/member.selectors';
import { selectTeams } from '@selector/team.selectors';
import { ImagesService } from '@service/image.service';
import { MemberService } from '@service/member.service';
import { TeamService } from '@service/team.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { generateUniqueId } from '@shared/utils/common.util';
import { IAppState } from '@state/app.state';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-team',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  Images = Images;
  teamForm: FormGroup;
  team: Team = cloneDeep(defaultTeamData);
  isVisible = false;
  isTeamViewDetail = false;
  teams: Team[] = [];
  members: Member[] = [];
  previousMembers: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private teamService: TeamService,
    private memberService: MemberService,
    private msgService: ToastMessageService,
    public imageService: ImagesService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.setupPageViewAnalytics();
    this.loadTeams();
    this.loadMembers();
  }

  get unassignedMembers(): Member[] {
    return this.members.filter(m => !m.teamId || (this.team?.members?.some(currentMember => currentMember.id === m.id)) || this.previousMembers.some(cm => cm.id === m.id));
  }

  onTeamNameChange(teamName: string): void {
    this.team = {
      ...this.team,
      displayName: teamName?.trim() ? `${teamName}'s Team` : '',
    };
  }

  createOrUpdate(): void {
    if (this.teamForm.invalid) {
      this.markInvalidControls();
      return;
    }

    this.team = {
      ...this.team,
      id: this.team.id || generateUniqueId(this.team.name),
      displayName: this.team.name?.trim() ? `${this.team.name}'s Team` : '',
    };

    this.team.members.forEach(member => {
      member.teamId = this.team.id;
      member.isTeamLeader = member.name === this.team.leader;
      this.memberService.update(member.id, member);
    });

    this.detectRemovedMember(this.team.members);

    this.teamService.save(this.team.id, this.team)
      .then(() => {
        this.msgService.success(`The team information has been ${this.team.id ? 'updated' : 'created'} successfully.`);
      })
      .catch(() => {
        this.msgService.error(`Unable to ${this.team.id ? 'update' : 'create'} team. An unexpected error occurred.`);
      })
      .finally(() => {
        this.isVisible = false;
        this.previousMembers = [];
        this.team = cloneDeep(defaultTeamData);
        this.teamForm.reset();
      });
  }

  edit(team: Team): void {
    this.team = cloneDeep(team);
    this.previousMembers = team.members;
    this.isVisible = true;
  }

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.team = cloneDeep(defaultTeamData);
  }

  delete(documentId: string): void {
    this.teamService.delete(documentId).then(() => {
      this.msgService.success('Team deleted successfully.');
    });
  }

  viewDetail(team: Team): void {
    this.team = team;
    this.isTeamViewDetail = true;
  }

  closeViewDetail(): void {
    this.isTeamViewDetail = false;
    this.team = cloneDeep(defaultTeamData);
  }

  compareMembersById = (member1: Member, member2: Member): boolean => {
    return (member1 && member2 ? member1.id === member2.id : member1 === member2)
  };

  private initializeForm(): void {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      members: [[], Validators.required],
      leader: ['', Validators.required],
    });
  }

  private setupPageViewAnalytics(): void {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Teams', page_path: '/user/teams' });
  }

  private loadTeams(): void {
    this.store.select(selectTeams).subscribe(teams => this.teams = cloneDeep(teams));
  }

  private loadMembers(): void {
    this.store.select(selectMembers).subscribe(members => this.members = cloneDeep(members));
  }

  private markInvalidControls(): void {
    Object.values(this.teamForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  private detectRemovedMember(currentMembers: Member[]): void {
    const removedMembers = this.previousMembers.filter(prevMember =>
      !currentMembers.some(currentMember => currentMember.id === prevMember.id)
    );
    removedMembers.forEach(removedMember => {
      if (removedMember) {
        if (removedMember.isTeamLeader) {
          this.team.leader = "";
        }
        removedMember.teamId = "";
        removedMember.isTeamLeader = false;
        this.memberService.update(removedMember.id, removedMember);
      }
    })
  }
}