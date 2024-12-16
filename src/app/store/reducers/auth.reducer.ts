import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '@action/auth.actions';
import { initialAuthState } from '@state/auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, { authInfo }) => ({ ...state, authInfo, error: null, loading: false })),
  on(AuthActions.loginFailed, (state, { error }) => ({ ...state, authInfo: null, error, loading: false })),
  on(AuthActions.signUp, (state) => ({ ...state, loading: true })),
  on(AuthActions.signUpSuccess, (state, { authInfo }) => ({ ...state, authInfo, error: null, loading: false })),
  on(AuthActions.signUpFailed, (state, { error }) => ({ ...state, authInfo: null, error, loading: false })),
  on(AuthActions.sendVerificationMail, (state) => ({ ...state, loading: true })),
  on(AuthActions.sendVerificationMailSuccess, (state) => ({ ...state, error: null, loading: false })),
  on(AuthActions.sendVerificationMailFailed, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthActions.forgotPassword, (state) => ({ ...state, loading: true })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({ ...state, error: null, loading: false })),
  on(AuthActions.forgotPasswordFailed, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthActions.logout, (state) => ({ ...state, authInfo: null, error: null, loading: false })),
  on(AuthActions.updateAuthUser, (state, { authInfo }) => ({ ...state, authInfo, error: null, loading: false })),
);