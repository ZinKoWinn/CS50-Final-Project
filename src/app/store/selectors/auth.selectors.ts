import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '@state/auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('authInfo');

export const selectAuthInfo = createSelector(
  selectAuthState,
  (state) => state.authInfo
);

export const selectError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => !!state.authInfo
);
