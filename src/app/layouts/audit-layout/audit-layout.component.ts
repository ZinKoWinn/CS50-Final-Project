import { Component, OnInit } from '@angular/core';
import { APP_IMPORTS } from '@import';
import { AuthInfo } from '@model/auth.info';
import { Store } from '@ngrx/store';
import { selectAuthInfo } from '@selector/auth.selectors';
import { AuthorizeService } from '@shared/services/authorize-service';
import { IAppState } from '@state/app.state';
import * as AuthActions from '@action/auth.actions'

@Component({
  selector: 'app-audit-layout',
  standalone: true,
  imports: [APP_IMPORTS],
  templateUrl: './audit-layout.component.html',
  styleUrl: './audit-layout.component.scss'
})
export class AuditLayoutComponent implements OnInit {
  authInfo: AuthInfo;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuditor: boolean = false;
  isNotSuperAdmin = false

  constructor(private store: Store<IAppState>, public authorizeService: AuthorizeService) {
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
}
