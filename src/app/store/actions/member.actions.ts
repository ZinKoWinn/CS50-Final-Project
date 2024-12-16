import { createAction, props } from '@ngrx/store';
import { Member } from '@model/member';

export const loadMembers = createAction('[Member] Load Members');
export const loadMembersSuccess = createAction('[Member] Load Members Success', props<{ members: Member[] }>());
export const loadMembersFailure = createAction('[Member] Load Members Failure', props<{ error: any }>());
export const addUnsubmittedMember = createAction('[Members] Add Unsubmitted Member', props<{ unsubmittedMember: Member }>());
export const removeUnsubmittedMember = createAction('[Members] Remove Unsubmitted Member', props<{ member: Member }>());