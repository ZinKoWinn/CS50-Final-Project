import { createReducer, on } from '@ngrx/store';
import * as userActions from '@action/user.actions';
import { initialUserState } from '@state/user.state';

export const userReducer = createReducer(
    initialUserState,
    on(userActions.loadUsers, (state) => ({ ...state, loading: true })),
    on(userActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false, error: null })),
    on(userActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error }))
);