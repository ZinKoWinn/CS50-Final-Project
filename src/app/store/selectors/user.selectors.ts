import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '@state/user.state';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectUsers = createSelector(selectUserState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUserState, (state) => state.loading);
export const selectUsersError = createSelector(selectUserState, (state) => state.error);
export const selectUserByName = (userName: string) => createSelector(
    selectUserState,
    (state) => state.users.find(user => user.name === userName)
  );