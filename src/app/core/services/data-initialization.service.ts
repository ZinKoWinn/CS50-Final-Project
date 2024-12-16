import { Injectable } from '@angular/core';
import { TeamService } from './team.service';
import { DataService } from './data.service';
import { ProjectService } from './project.service';
import { AuthService } from '../../shared/services/auth.service';
import { MemberService } from './member.service';
import { environment } from '@environment';
import { loadMembers } from '@action/member.actions';
import { loadProjects } from '@action/project.actions';
import { loadTeams } from '@action/team.actions';
import { loadUsers } from '@action/user.actions';
import { IAppState } from '@state/app.state';
import { Store } from '@ngrx/store';
import { defaultAuditor, defaultSuperAdmin, defaultTempUserPassword } from '@constant/app.constant';
import { loadMeetingNotes } from '@action/meeting.notes.actions';
import { loadGeneralSetting } from '@action/general-setting.actions';
import { defaultGeneralSetting } from '@model/general-setting';
import { GeneralSettingService } from './general-setting.service';
import { UserService } from './user.service';
import { loadMeetingNotesHistory } from '@action/meeting.notes.history.actions';
import { ImagesService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class DataInitializationService {

  constructor(
    private store: Store<IAppState>,
    private authService: AuthService,
    private userService: UserService,
    private dataService: DataService,
    private teamService: TeamService,
    private memberService: MemberService,
    private projectService: ProjectService,
    private generalSettingService: GeneralSettingService,
    private imageService: ImagesService
  ) { }

  public initializeData(): void {
    if (environment.initializeData) {
      this.initializeAdmin();
      this.initializeAuditor();
      this.initializeUsers();
      this.initializeTeamData();
      this.initializeMemberData();
      this.initializeProjectData();
      this.initializeGeneralSetting();
    }

    this.store.dispatch(loadUsers());
    this.store.dispatch(loadTeams());
    this.store.dispatch(loadMembers());
    this.store.dispatch(loadProjects());
    this.store.dispatch(loadMeetingNotes());
    this.store.dispatch(loadGeneralSetting());
    this.store.dispatch(loadMeetingNotesHistory());
  }

  private initializeAdmin(): void {
    const { name, email, password } = defaultSuperAdmin;
    this.userService.isAlreadyExist('email', '==', email, (isExist) => {
      if (!isExist) {
        this.authService.createTempAccount(name, email, password)
          .catch(error => console.error('Error creating temp account:', error));
      }
    });
  }


  private initializeAuditor(): void {
    const { name, email, password } = defaultAuditor;
    this.userService.isAlreadyExist('email', '==', email, (isExist) => {
      if (!isExist) {
        this.authService.createTempAccount(name, email, password)
          .catch(error => console.error('Error creating temp account:', error));
      }
    });
  }


  private initializeUsers(): void {
    this.dataService.getMembers().subscribe({
      next: (members) => {
        members.forEach(member => {
          const name = member.name;
          const email = name.replace(/\s+/g, '').toLowerCase() + '@gmail.com';
          const password = defaultTempUserPassword;
          this.userService.isAlreadyExist('email', '==', email, (isExist) => {
            if (!isExist) {
              this.authService.createTempAccount(name, email, password)
                .catch(error => console.error('Error creating temp account:', error));
            }
          });
        });
      },
      error: (error) => console.error('Error getting members:', error)
    });
  }


  private initializeGeneralSetting(): void {
    const generalSetting = defaultGeneralSetting;
    this.generalSettingService.isAlreadyExist('id', '==', generalSetting.id, (isExist) => {
      if (!isExist) {
        this.generalSettingService.save(generalSetting.id, generalSetting)
          .catch(error => console.error('Error saving general setting:', error));
      }
    });
  }

  private initializeTeamData(): void {
    this.dataService.getTeams().subscribe({
      next: (teams) => {
        teams.forEach(team => {
          this.teamService.isAlreadyExist('name', '==', team.name, (isExist) => {
            if (!isExist) {
              this.teamService.save(team.id, team)
                .catch(error => console.error('Error saving team:', error));
            }
          });
        });
      },
      error: (error) => console.error('Error getting teams:', error)
    });
  }


  private initializeMemberData(): void {
    this.dataService.getMembers().subscribe({
      next: (members) => {
        members.forEach(member => {
          this.memberService.isAlreadyExist('name', '==', member.name, (isExist) => {
            if (!isExist) {
              this.memberService.save(member.id, member)
                .catch(error => console.error('Error saving member:', error));
            }
          });
        });
      },
      error: (error) => console.error('Error getting members:', error)
    });
  }


  private initializeProjectData(): void {
    this.dataService.getProjects().subscribe({
      next: (projects) => {
        projects.forEach(project => {
          this.projectService.isAlreadyExist('value', '==', project.value, (isExist) => {
            if (!isExist) {
              this.projectService.add(project)
                .catch(error => console.error('Error adding project:', error));
            }
          });
        });
      },
      error: (error) => console.error('Error getting projects:', error)
    });
  }
}
