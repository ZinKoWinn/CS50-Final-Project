import { Component, ElementRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthInfo, defaultAuthInfo } from '@model/auth.info';
import { Member } from '@model/member';
import { Project } from '@model/project';
import { Team } from '@model/team';
import { Store } from '@ngrx/store';
import { selectAuthInfo } from '@selector/auth.selectors';
import { DateUtils } from '@shared/utils/date.util';
import { IAppState } from '@state/app.state';
import { TabMenu } from '../tab-menu/tab-menu.model';
import { selectMembers } from '@selector/member.selectors';
import { selectProjects } from '@selector/project.selectors';
import { selectTeams } from '@selector/team.selectors';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-meeting-note-common',
  standalone: true,
  template: '<!-- Common component without UI -->',
})
export class MeetingNoteCommonComponent {
  @Input() currentTab: TabMenu | undefined;

  protected teams: Team[] = [];
  protected members: Member[] = [];
  protected projects: Project[] = [];
  protected projectOptions: string[] = [];

  weeklyMeetingNoteId = DateUtils.formatDate(DateUtils.firstDayOfWeek, 'ddMMyyyy') + DateUtils.formatDate(DateUtils.lastDayOfWeek, 'ddMMyyyy');
  authInfo: AuthInfo = { ...defaultAuthInfo };

  constructor(
    protected store: Store<IAppState>
  ) {
    this.setUpData();
  }

  private setUpData(): void {
    this.store.select(selectAuthInfo).subscribe((authInfo) => {
      this.authInfo = authInfo ? authInfo : cloneDeep(defaultAuthInfo);
    });

    this.store.select(selectMembers).subscribe((members) => {
      this.members = members && members.length > 0 ? members : [];
    });

    this.store.select(selectProjects).subscribe((projects) => {
      this.projects = projects && projects.length > 0 ? projects : [];
    });

    this.store.select(selectTeams).subscribe((teams) => {
      this.teams = teams && teams.length > 0 ? teams : [];
    });
  }

  protected extractIdFromUser(userName: string): string {
    return `${userName?.split(' ').map((part) => part.charAt(0).toUpperCase()).join('')}_${this.weeklyMeetingNoteId}`;
  }

  public onInputProject(event: Event): void {
    const project = (event.target as HTMLInputElement).value.trim();
    this.projectOptions = project
      ? [project, ...this.projects.filter(p => p.value.toLowerCase().includes(project.toLowerCase())).map(p => p.value)]
      : [];
  }

  protected markInvalidControls(fg: FormGroup<any>): void {
    Object.values(fg?.controls).forEach((control) => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  protected resetForm(fg: FormGroup<any>): void {
    fg.reset();
  }
  
  protected scrollToTop(element: ElementRef): void {
    if (element && element.nativeElement) {
      (element.nativeElement as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }
}
