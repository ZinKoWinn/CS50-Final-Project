import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '@action/auth.actions'
import { APP_IMPORTS } from '@import';
import { AuthInfo } from '@model/auth.info';
import { IAppState } from '@state/app.state';
import { selectAuthInfo } from '@selector/auth.selectors';
import { AuthorizeService } from '@shared/services/authorize-service';
import { ImagesService } from '@service/image.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserProfileComponent } from '@shared/components/user-profile/user-profile.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [APP_IMPORTS],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  authInfo: AuthInfo;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuditor: boolean = false;
  isNotSuperAdmin = false

  constructor(
    private store: Store<IAppState>,
    public authorizeService: AuthorizeService,
    public imageService: ImagesService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.store.select(selectAuthInfo).subscribe((authInfo) => {
      this.authInfo = authInfo;
      this.isAdmin = this.authorizeService.isAdmin;
      this.isSuperAdmin = this.authorizeService.isSuperAdmin;
      this.isAuditor = this.authorizeService.isAuditor;
      this.isNotSuperAdmin = this.authorizeService.isNotSuperAdmin;
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  showProfile(): void {
    this.modalService.create({
      nzTitle: 'Profile',
      nzContent: UserProfileComponent,
      nzFooter: null
    });
  }
}
