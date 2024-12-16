import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import * as userActions from '@action/user.actions';
import { UserService } from '@service/user.service';
import { Store, select } from '@ngrx/store';
import { selectUsers } from '@selector/user.selectors';
import { IAppState } from '@state/app.state';

@Injectable()
export class UserEffects {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private userService: UserService
    ) { }

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.loadUsers),
            withLatestFrom(this.store.pipe(select(selectUsers))),
            mergeMap(([action, users]) =>
                users && users.length > 0
                    ? of(userActions.loadUsersSuccess({ users: users }))
                    : this.userService.getAll().pipe(
                        map((usersData) => userActions.loadUsersSuccess({ users: usersData })),
                        catchError((error) => {
                            return of(userActions.loadUsersFailure(error));
                        })
                    )
            )
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.userService.getAll().pipe(
            map((usersData) => userActions.loadUsersSuccess({ users: usersData })),
            catchError((error) => {
                return of(userActions.loadUsersFailure(error));
            })
        )
    );
}