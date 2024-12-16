import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { APP_IMPORTS } from '@import';
import { AuthInfo } from '@model/auth.info';
import { AuthService } from '@shared/services/auth.service';
import { IAppState } from '@state/app.state';
import { selectAuthInfo } from '@selector/auth.selectors';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  standalone: true,
  imports: [APP_IMPORTS]
})
export class VerifyEmailComponent implements OnInit {
  authInfo: AuthInfo;

  constructor(
    public authService: AuthService,
    private store: Store<IAppState>,
    private messageService: ToastMessageService
  ) { }


  ngOnInit() {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Verify Email', page_path: '/verify-email' });
    this.loadAuthInfo();
  }

  loadAuthInfo(): void {
    this.store.select(selectAuthInfo).subscribe((authInfo) => {
      this.authInfo = authInfo;
    });
  }

  sendVerificationMail(): void {
    this.authService.sendVerificationMail()
      .pipe(
        tap(() => this.messageService.success('A verification email has been successfully sent. Please check your inbox.')),
        catchError(error => {
          this.messageService.error(error.message);
          throw error;
        })
      )
      .subscribe();
  }
}
