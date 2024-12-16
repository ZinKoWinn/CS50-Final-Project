import { Component } from '@angular/core';
import { APP_IMPORTS } from '@import';
import { AuthInfo } from '@model/auth.info';
import { Role, roles } from '@model/role';
import { TeamMember } from '@model/team-member';
import { User } from '@model/user';
import { Store } from '@ngrx/store';
import { selectAuthInfo } from '@selector/auth.selectors';
import { selectTeamAndMembers } from '@selector/meeting.notes.selectors';
import { ImagesService } from '@service/image.service';
import { IAppState } from '@state/app.state';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    APP_IMPORTS
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  authInfo: AuthInfo;
  teamMember: TeamMember;

  showPasswordForm: boolean = false;

  constructor(
    private store: Store<IAppState>,
    public imageService: ImagesService
  ) { }

  ngOnInit(): void {
    this.store.select(selectAuthInfo).subscribe((authInfo) => {
      this.authInfo = authInfo;
    });

    this.store.select(selectTeamAndMembers).subscribe(data => {
      this.teamMember = data;
    })
  }

  getRoles(values: string[]): Role[] {
    return roles.filter(r => values.includes(r.value));
  }

}
