import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AuthService } from '@shared/services/auth.service';
import { selectIsLoggedIn } from '@selector/auth.selectors';
import { IAppState } from '@state/app.state';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public authService: AuthService, public store: Store<IAppState>, public router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return this.store.pipe(
      select(selectIsLoggedIn),
      tap<boolean>((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(["/sign-in"]);
        }
      })
    );
  }
}