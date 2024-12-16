import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from '@state/project.state';

export const selectProjectState = createFeatureSelector<ProjectState>('projects');

export const selectProjects = createSelector(selectProjectState, (state) => state.projects);
export const selectProjectsLoading = createSelector(selectProjectState, (state) => state.loading);
export const selectProjectsError = createSelector(selectProjectState, (state) => state.error);

export const selectProjectByName = (projectName: string) => createSelector(
    selectProjectState,
    (state) => state.projects.find(project => project.value === projectName)
  );