import { Member } from "@model/member";

export interface MemberState {
    members: Member[];
    loading: boolean;
    unsubmittedMembers: Member[];
    error: any;
}

export const initialMemberState: MemberState = {
    members: [],
    unsubmittedMembers: [],
    loading: false,
    error: null,
};
