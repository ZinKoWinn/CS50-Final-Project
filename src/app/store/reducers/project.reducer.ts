import { createReducer, on } from '@ngrx/store';
import * as projectActions from '@action/project.actions';
import { initialProjectState } from '@state/project.state';

export const projectReducer = createReducer(
  initialProjectState,
  on(projectActions.loadProjects, (state) => ({ ...state, loading: true })),
  on(projectActions.loadProjectsSuccess, (state, { projects }) => ({ ...state, projects, loading: false, error: null })),
  on(projectActions.loadProjectsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);