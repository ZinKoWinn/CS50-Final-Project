import { Project } from "@model/project";

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: any;
}


export const initialProjectState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};