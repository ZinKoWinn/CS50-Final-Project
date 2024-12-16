import { createAction, props } from '@ngrx/store';
import { Project } from '@model/project';

export const loadProjects = createAction('[Project] Load Projects');
export const loadProjectsSuccess = createAction('[Project] Load Projects Success', props<{ projects: Project[] }>());
export const loadProjectsFailure = createAction('[Project] Load Projects Failure', props<{ error: any }>());