import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { firstValueFrom, from, of } from 'rxjs';
import { mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import * as meetingNotesActions from '@action/meeting.notes.actions';
import * as membersActions from '@action/member.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@state/app.state';
import { MeetingNotesService } from '@service/meeting.notes.service';
import { selectMeetingNotes } from '@selector/meeting.notes.selectors';
import { DateUtils } from '@shared/utils/date.util';
import { defaultAudit } from '@model/audit';
import { MeetingNote } from '@model/meeting-note';
import { selectMembers } from '@selector/member.selectors';
import { selectTeams } from '@selector/team.selectors';
import { Timestamp } from 'firebase/firestore';
import { find, groupBy } from 'lodash';
import { Member } from '@model/member';

@Injectable()
export class MeetingNotesEffects {
    private weeklyMeetingNoteId = DateUtils.formatDate(DateUtils.firstDayOfWeek, 'ddMMyyyy') + DateUtils.formatDate(DateUtils.lastDayOfWeek, 'ddMMyyyy');
    private members: Member[] = [];
    private teams = [];

    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private meetingNoteService: MeetingNotesService
    ) {
        this.store.select(selectMembers).subscribe((members) => {
            this.members = members && members.length > 0 ? members : [];
        });

        this.store.select(selectTeams).subscribe((teams) => {
            this.teams = teams && teams.length > 0 ? teams : [];
        });

    }

    loadMeetingNotes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(meetingNotesActions.loadMeetingNotes),
            withLatestFrom(this.store.pipe(select(selectMeetingNotes))),
            mergeMap(([action, meetingNotes]) => {
                if (meetingNotes && meetingNotes.meetingNotes.length > 0) {
                    // return of(meetingNotesActions.loadMeetingNotesSuccess({ meetingNotes }));
                    return from(this.fetchMeetingNotes());
                } else {
                    return from(this.fetchMeetingNotes());
                }
            }),
            catchError(error => of(meetingNotesActions.loadMeetingNotesFailure({ error })))
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.meetingNoteService.getOne(this.weeklyMeetingNoteId).pipe(
            mergeMap((meetingNotes) => {
                if (meetingNotes && meetingNotes.meetingNotes.length > 0) {
                    // return of(meetingNotesActions.loadMeetingNotesSuccess({ meetingNotes }));
                    return from(this.fetchMeetingNotes());
                } else {
                    return from(this.fetchMeetingNotes());
                }
            }),
            catchError(error => of(meetingNotesActions.loadMeetingNotesFailure({ error })))
        )
    );

    private async fetchMeetingNotes() {
        let meetingNotes = await firstValueFrom(this.meetingNoteService.getOne(this.weeklyMeetingNoteId));

        if (!meetingNotes) {
            meetingNotes = {
                id: this.weeklyMeetingNoteId,
                isArchived: false,
                meetingNotes: await this.createDefaultMeetingNotes(),
                audit: { ...defaultAudit, createdBy: 'System' }
            };
        }

        const allTeamMemberNotes = groupBy(meetingNotes.meetingNotes, 'teamName');
        meetingNotes.meetingNotes.forEach(mn => {
            const member: Member = find(this.members, { name: mn.teamMemberName });
            if (mn.notes.length <= 0 && !mn.isAbsence) {
                this.store.dispatch(membersActions.addUnsubmittedMember({ unsubmittedMember: member }));
            } else {
                this.store.dispatch(membersActions.removeUnsubmittedMember({ member }));
            }
        });

        this.store.dispatch(meetingNotesActions.addAllTeamsMembersNotes({ allTeamMemberNotes }));
        return meetingNotesActions.loadMeetingNotesSuccess({ meetingNotes });
    }

    private async createDefaultMeetingNotes(): Promise<MeetingNote[]> {
        return this.members.map(member => {
            const team = this.teams.find(team => team.id === member.teamId);
            return team ? {
                id: this.extractIdFromUser(member.name),
                teamName: team.name,
                teamMemberName: member.name,
                submittedDate: Timestamp.now(),
                notes: [],
                audit: { ...defaultAudit, createdBy: 'System' },
                isAbsence: false,
                absenceReason: ''
            } : null;
        }).filter((note): note is MeetingNote => note !== null);;
    }

    private extractIdFromUser(userName: string): string {
        return `${userName.split(' ').map(part => part.charAt(0).toUpperCase()).join('')}_${this.weeklyMeetingNoteId}`;
    }
}
