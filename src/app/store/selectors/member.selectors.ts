import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemberState } from '@state/member.state';

export const selectMemberState = createFeatureSelector<MemberState>('members');

export const selectMembers = createSelector(selectMemberState, (state) => state.members);
export const selectMembersLoading = createSelector(selectMemberState, (state) => state.loading);
export const selectMembersError = createSelector(selectMemberState, (state) => state.error);
export const selectUnSubmittedMembers = createSelector(selectMemberState, (state) => state.unsubmittedMembers);

export const selectMemberByName = (memberName: string) => createSelector(
    selectMemberState,
    (state) => state.members.find(member => member.name === memberName)
  );