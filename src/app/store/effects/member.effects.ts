import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import * as memberActions from '@action/member.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@state/app.state';
import { MemberService } from '@service/member.service';
import { selectMembers } from '@selector/member.selectors';
import { Member } from '@model/member';

@Injectable()
export class MemberEffects {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private memberService: MemberService
    ) { }

    loadMembers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(memberActions.loadMembers),
            withLatestFrom(this.store.pipe(select(selectMembers))),
            mergeMap(([action, members]) =>
                members && members.length > 0
                    ? of(memberActions.loadMembersSuccess({ members: members }))
                    : this.memberService.getAll().pipe(
                        map((memberData) => memberActions.loadMembersSuccess({ members: memberData })),
                        catchError((error) => {
                            return of(memberActions.loadMembersFailure(error));
                        })
                    )
            )
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.memberService.getAll().pipe(
            map((members: Member[]) =>
                memberActions.loadMembersSuccess({ members })
            ),
            catchError((error) => of(memberActions.loadMembersFailure(error)))
        )
    );
}