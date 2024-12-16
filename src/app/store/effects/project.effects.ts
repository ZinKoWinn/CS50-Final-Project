import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import * as projectActions from '@action/project.actions';
import { ProjectService } from '@service/project.service';
import { Store, select } from '@ngrx/store';
import { selectProjects } from '@selector/project.selectors';
import { IAppState } from '@state/app.state';

@Injectable()
export class ProjectEffects {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private projectService: ProjectService
    ) { }

    loadProjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(projectActions.loadProjects),
            withLatestFrom(this.store.pipe(select(selectProjects))),
            mergeMap(([action, projects]) =>
                projects && projects.length > 0
                    ? of(projectActions.loadProjectsSuccess({ projects: projects }))
                    : this.projectService.getAll().pipe(
                        map((projectsData) => projectActions.loadProjectsSuccess({ projects: projectsData })),
                        catchError((error) => {
                            return of(projectActions.loadProjectsFailure(error));
                        })
                    )
            )
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.projectService.getAll().pipe(
            map((projectsData) => projectActions.loadProjectsSuccess({ projects: projectsData })),
            catchError((error) => {
                return of(projectActions.loadProjectsFailure(error));
            })
        )
    );
}