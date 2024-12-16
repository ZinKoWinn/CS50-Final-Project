import { createReducer, on } from '@ngrx/store';
import * as memberActions from '@action/member.actions';
import { initialMemberState } from '@state/member.state';

export const memberReducer = createReducer(
  initialMemberState,
  on(memberActions.loadMembers, (state) => ({ ...state, loading: true })),
  on(memberActions.loadMembersSuccess, (state, { members }) => ({ ...state, members, loading: false, error: null })),
  on(memberActions.loadMembersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(memberActions.addUnsubmittedMember, (state, { unsubmittedMember }) => ({
    ...state,
    unsubmittedMembers: unsubmittedMember && state.unsubmittedMembers.some(m => m?.id === unsubmittedMember.id)
      ? state.unsubmittedMembers
      : [...state.unsubmittedMembers, unsubmittedMember].filter(Boolean),
  })),
  on(memberActions.removeUnsubmittedMember, (state, { member }) => ({
    ...state,
    unsubmittedMembers: state.unsubmittedMembers.filter(m => m?.name !== member?.name),
  })),
);