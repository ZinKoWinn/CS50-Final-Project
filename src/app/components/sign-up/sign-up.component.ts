import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { Member } from '@model/member';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { selectMembers } from '@selector/member.selectors';
import { UserService } from '@service/user.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { SIGN_UP_TOUR_COOKIE, emailPattern } from '@constant/app.constant';
import { APP_IMPORTS } from '@import';
import { IAppState } from '@state/app.state';
import { selectError, selectLoading } from '@selector/auth.selectors';
import * as AuthActions from '@action/auth.actions'
import { selectUsers } from '@selector/user.selectors';
import { Subject, firstValueFrom } from 'rxjs';
import { AppTourService } from '@service/app.tour.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [APP_IMPORTS, SortByPipe],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  emailPattern = emailPattern;

  signupForm!: FormGroup;
  loading = false;
  errorMessage = '';
  passwordVisible = false;
  confirmPasswordVisible = false;
  members: Member[] = [];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private userService: UserService,
    private msgService: ToastMessageService,
    private tourService: AppTourService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Sign Up', page_path: '/sign-up' });
    this.initializeForm();
    this.loadMembers();
  }

  ngAfterViewInit(): void {
    this.cookieService.set('introjs-dontShowAgain', 'false', 365);
    this.handleSignUpTour();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initializeForm(): void {
    this.signupForm = this.fb.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordConfirmationValidator });
  }

  handleSignUpTour(): void {
    const signUpTourCookie = this.cookieService.get(SIGN_UP_TOUR_COOKIE);
    if (signUpTourCookie !== 'true') {
      this.tourService.signUpTour();
      this.toggleTourDoNotShowAgain();
    }
  }

  toggleTourDoNotShowAgain(): void {
    const checkbox = document.getElementById('introjs-dontShowAgain') as HTMLInputElement;

    checkbox.addEventListener('change', () => {
      this.cookieService.set(SIGN_UP_TOUR_COOKIE, `${checkbox.checked}`, 365);
    });
  }

  passwordConfirmationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('confirmPassword').value;

    if (confirmPassword.length > 6 && password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ mismatch: true });
    } else {
      if (control.get('confirmPassword').hasError('mismatch')) {
        control.get('confirmPassword').setErrors(null);
      }
    }
    return null;
  }

  async loadMembers(): Promise<void> {
    const users = await firstValueFrom(this.store.select(selectUsers));
    this.store.select(selectMembers).subscribe(members => {
      this.members = members.filter(m => !users.map(u => u.name).includes(m.name));
    });
  }

  getFormControlValues(): { email: string, name: string, password: string, confirmPassword: string } {
    return {
      email: this.getFormControlValue('email'),
      name: this.getFormControlValue('name'),
      password: this.getFormControlValue('password'),
      confirmPassword: this.signupForm.get('confirmPassword')?.value
    };
  }

  getFormControlValue(controlName: string): string {
    return this.signupForm.get(controlName)?.value;
  }

  get email(): string {
    return this.getFormControlValue('email');
  }

  get name(): string {
    return this.getFormControlValue('name');
  }

  get password(): string {
    return this.getFormControlValue('password');
  }

  get confirmPassword(): string {
    return this.signupForm.get('confirmPassword')?.value;
  }

  async signUp(): Promise<void> {
    this.markInvalidControls();

    if (this.password !== this.confirmPassword) {
      this.signupForm.get('confirmPassword').setErrors({ mismatch: true });
      return;
    }

    if (this.signupForm.invalid) return;

    const { email, name } = this.getFormControlValues();

    this.userService.isAlreadyExist('email', '==', email, ((isExist) => {
      if (isExist) {
        this.handleSignUpError('email', email);
        return;
      }
    }));

    this.userService.isAlreadyExist('name', '==', name, ((isExist) => {
      if (isExist) {
        this.handleSignUpError('name', name);
        return;
      }
    }));

    this.dispatchSignUpAction();
    this.subscribeToLoadingAndError();
  }

  private markInvalidControls(): void {
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  private handleSignUpError(field: string, value: string): void {
    this.msgService.warning(`The sign-up process failed as the ${field} "${value}" is already registered. Please contact our support team for further assistance.`);
  }

  private dispatchSignUpAction(): void {
    this.store.dispatch(AuthActions.signUp({
      email: this.email,
      password: this.password,
      name: this.name,
      loading: false
    }));
  }

  private subscribeToLoadingAndError(): void {
    this.store.select(selectLoading).subscribe(data => this.loading = data);

    this.store.select(selectError).subscribe(error => {
      this.errorMessage = error?.message || (error?.status == 400 ? 'Invalid email or password.' : '');
    });
  }
}