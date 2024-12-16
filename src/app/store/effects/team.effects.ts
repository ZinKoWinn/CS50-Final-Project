import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import * as teamActions from '@action/team.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@state/app.state';
import { TeamService } from '@service/team.service';
import { selectTeams } from '@selector/team.selectors';

@Injectable()
export class TeamEffects {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private teamService: TeamService
    ) { }

    loadTeams$ = createEffect(() =>
        this.actions$.pipe(
            ofType(teamActions.loadTeams),
            withLatestFrom(this.store.pipe(select(selectTeams))),
            mergeMap(([action, teams]) =>
                teams && teams.length > 0
                    ? of(teamActions.loadTeamsSuccess({ teams: teams }))
                    : this.teamService.getAll().pipe(
                        map((teamData) => teamActions.loadTeamsSuccess({ teams: teamData })),
                        catchError((error) => {
                            return of(teamActions.loadTeamsFailure(error));
                        })
                    )
            )
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.teamService.getAll().pipe(
            map((teamData) => teamActions.loadTeamsSuccess({ teams: teamData })),
            catchError((error) => {
                return of(teamActions.loadTeamsFailure(error));
            }))
    );
}