import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Images } from '@constant/images';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { Project, defaultProject } from '@model/project';
import { Store } from '@ngrx/store';
import { selectProjects } from '@selector/project.selectors';
import { ProjectService } from '@service/project.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { IAppState } from '@state/app.state';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  projects: Project[] = [];
  project: Project = cloneDeep(defaultProject);
  Images = Images;
  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private store: Store<IAppState>,
    private msgService: ToastMessageService
  ) { }

  ngOnInit() {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Projects', page_path: '/user/projects' });
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      description: [''],
    });

    this.loadProjects();
  }

  loadProjects(): void {
    this.store.select(selectProjects).subscribe(
      {
        next: (result) => (this.projects = result),
        error: (error) => console.error('Error fetching projects:', error)
      }
    );
  }

  async createOrUpdate(project: Project): Promise<void> {
    if (this.projectForm.invalid) {
      this.markInvalidControls();
      return;
    }

    try {
      if (project.documentId) {
        await this.projectService.update(project.documentId, project);
      } else {
        project.id = this.projects.length + 1;
        await this.projectService.add(project);
      }
      this.msgService.success(`The project information has been ${project.documentId ? 'updated' : 'created'} successfully.`)
    } catch (error) {
      this.msgService.error(`Unable to ${project.documentId ? 'update' : 'create'} project. An unexpected error occurred.`);
    } finally {
      this.isVisible = false;
      this.projectForm.reset();
      this.project = cloneDeep(defaultProject);
    }
  }

  private markInvalidControls(): void {
    Object.values(this.projectForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  edit(project: Project): void {
    this.project = cloneDeep(project);
    this.isVisible = !this.isVisible;
  }

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.project = cloneDeep(defaultProject);
  }

  delete(documentId: string): void {
    this.projectService.delete(documentId).then(() => {
      this.msgService.success('Project deleted successfully.')
    });
  }
}
