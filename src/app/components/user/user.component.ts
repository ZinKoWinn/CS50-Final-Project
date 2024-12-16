import { Component, OnInit } from '@angular/core';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultAuditor, defaultSuperAdmin } from '@constant/app.constant';
import { Images } from '@constant/images';
import { APP_IMPORTS, PIPE_IMPORTS } from '@import';
import { Role, roles } from '@model/role';
import { User, defaultUser } from '@model/user';
import { Store } from '@ngrx/store';
import { selectUsers } from '@selector/user.selectors';
import { ImagesService } from '@service/image.service';
import { UserService } from '@service/user.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { IAppState } from '@state/app.state';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [APP_IMPORTS, PIPE_IMPORTS],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchValue: string = '';
  user: User = cloneDeep(defaultUser);
  Images = Images;
  isVisible = false;
  roles: Role[] = roles;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private store: Store<IAppState>,
    private msgService: ToastMessageService,
    public imageService: ImagesService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.setupPageViewAnalytics();
    this.loadUsers();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      emailVerified: [''],
      roles: [[], Validators.required],
    });
  }

  setupPageViewAnalytics() {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Users', page_path: '/user/users' });
  }

  loadUsers(): void {
    const superAdmin = defaultSuperAdmin;
    const auditor = defaultAuditor;
    this.store.select(selectUsers).subscribe({
      next: (result) => {
        this.users = result.filter(user => user.name !== superAdmin.name && user.name !== auditor.name);
        this.filteredUsers = this.users.filter(user => user?.name?.toLowerCase().includes(this.searchValue.toLowerCase()));
      },
      error: (error) => console.error('Error fetching users:', error)
    });
  }

  onInputUser(name: string): void {
    const user = name?.toLowerCase()?.trim();
    this.filteredUsers = user ? this.users.filter(u => u?.name?.toLowerCase().includes(user)) : this.users;
  }

  async createOrUpdate(user: User): Promise<void> {
    this.markInvalidControls();

    if (this.userForm.invalid) {
      return;
    }

    try {
      if (user.uid) {
        await this.userService.update(user.uid, user);
        this.msgService.success('The user information has been updated successfully.');
      }
    } catch (error) {
      this.msgService.error('Unable to update user. An unexpected error occurred.');
    } finally {
      this.resetFormAndUser();
    }
  }

  edit(user: User): void {
    this.user = cloneDeep(user);
    this.isVisible = !this.isVisible;
  }

  closeModal(): void {
    this.resetFormAndUser();
  }

  delete(documentId: string): void {
    this.msgService.warning('Sorry, the delete feature is currently unavailable. Please try again later.');
    // this.userService.delete(documentId);
  }

  getRoles(values: string[]): Role[] {
    return roles.filter(r => values.includes(r.value));
  }

  private markInvalidControls(): void {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  private resetFormAndUser(): void {
    this.isVisible = false;
    this.userForm.reset();
    this.user = cloneDeep(defaultUser);
  }
}
