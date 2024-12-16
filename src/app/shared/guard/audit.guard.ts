import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from '@shared/services/authorize-service';
import { defaultSuperAdmin } from '@constant/app.constant';
@Injectable({
  providedIn: 'root',
})
export class AuditGuard {
  constructor(
    public router: Router,
    public authorizeService: AuthorizeService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const superAdmin = defaultSuperAdmin;
    
    if (!this.authorizeService.isAuditor) {
      return this.router.createUrlTree(['/unauthorized']);
    }

    if (state.url == '/audit/meeting-note' && this.authorizeService.authInfo.user.name == superAdmin.name) {
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
}