import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Router } from '@angular/router';
import * as AuthActions from '@action/auth.actions';
import { AuthService } from '@shared/services/auth.service';
import { AuthInfo } from '@model/auth.info';
import { defaultSuperAdmin } from '@constant/app.constant';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router  ) { }

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(action =>
        from(this.authService.signIn(action.authCredential)).pipe(
          map((authInfo: AuthInfo) => {
            const superAdmin = defaultSuperAdmin;
            const isAdmin = authInfo?.user?.roles.includes('ADMIN_ROLE');
            const isAuditor = authInfo?.user?.roles.includes('AUDITOR_ROLE');
            const isSuperAdmin = authInfo.user.name == superAdmin.name && isAdmin;

            this.router.navigate([isSuperAdmin ? '/admin/users' : isAdmin ? '/admin/meeting-note' : isAuditor ? '/audit/meeting-note' : '/user/meeting-note']);

            return AuthActions.loginSuccess({ authInfo: authInfo, loading: false });
          }),
          catchError(error => of(AuthActions.loginFailed({ error, loading: false })))
        )
      )
    )
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap(action =>
        this.authService.signUp(action.email, action.name, action.password).pipe(
          map((authInfo: AuthInfo) => {
            this.router.navigate(['verify-email'])
            return AuthActions.signUpSuccess({ authInfo: authInfo, loading: false });
          }),
          catchError(error => of(AuthActions.signUpFailed({ error, loading: false })))
        )
      )
    )
  );

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.router.navigateByUrl("/sign-in");
    })
  ), { dispatch: false });
}
