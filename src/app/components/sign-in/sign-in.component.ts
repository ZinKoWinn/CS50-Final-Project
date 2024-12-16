import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as AuthActions from '@action/auth.actions'
import { APP_IMPORTS } from '@import';
import { Images } from '@constant/images';
import { AuthCredential } from '@model/auth.info';
import { selectError, selectLoading } from '@selector/auth.selectors';
import { getAnalytics, logEvent } from 'firebase/analytics'
import { DataInitializationService } from '@service/data-initialization.service';
import { SIGN_IN_TOUR_COOKIE, emailPattern } from '@constant/app.constant';
import { IAppState } from '@state/app.state';
import { AppTourService } from '@service/app.tour.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [APP_IMPORTS]
})
export class SignInComponent implements OnInit, AfterViewInit {
  Images = Images;
  emailPattern = emailPattern;

  signinForm!: FormGroup;
  loading = false;
  errorMessage = '';
  passwordVisible = false;

  private ngUnsubscribe = new Subject<void>();
  private loadingSubscription!: Subscription;
  private errorSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private initializeService: DataInitializationService,
    private tourService: AppTourService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Sign In', page_path: '/sign-in' });
    this.initializeForm();
    this.initializeService.initializeData();
  }

  ngAfterViewInit(): void {
    this.cookieService.set('introjs-dontShowAgain', 'false', 365);
    this.handleSignInTour();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.loadingSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
  }

  initializeForm(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)],],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  handleSignInTour(): void {
    const signInTourCookie = this.cookieService.get(SIGN_IN_TOUR_COOKIE);
    if (signInTourCookie !== 'true') {
      this.tourService.signInTour();
      this.toggleTourDoNotShowAgain();
    }
  }

  toggleTourDoNotShowAgain(): void {
    const checkbox = document.getElementById('introjs-dontShowAgain') as HTMLInputElement;

    checkbox.addEventListener('change', () => {
      this.cookieService.set(SIGN_IN_TOUR_COOKIE, `${checkbox.checked}`, 365);
    });
  }

  login(): void {
    this.markInvalidControls();

    if (this.signinForm.invalid) {
      return;
    }

    const credential = this.extractCredential();
    this.dispatchLoginAction(credential);
    this.subscribeToLoadingAndError();
  }

  private extractCredential(): AuthCredential {
    const { email, password } = this.signinForm.value;
    return { email, password };
  }

  private dispatchLoginAction(credential: AuthCredential): void {
    this.store.dispatch(AuthActions.login({
      authCredential: credential,
      loading: false
    }));
  }


  private subscribeToLoadingAndError(): void {
    this.loadingSubscription = this.store
      .select(selectLoading)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => (this.loading = data));

    this.errorSubscription = this.store
      .select(selectError)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((error) => {
        this.errorMessage = error?.message || (error?.status == 400 ? 'Invalid email or password.' : '');
      });
  }

  private markInvalidControls(): void {
    Object.values(this.signinForm.controls).forEach((control) => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
}