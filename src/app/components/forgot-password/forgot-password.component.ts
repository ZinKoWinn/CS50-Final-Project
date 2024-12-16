import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailPattern } from '@constant/app.constant';
import { APP_IMPORTS } from '@import';
import { UserService } from '@service/user.service';
import { AuthService } from '@shared/services/auth.service';
import { ToastMessageService } from '@shared/services/toast-message.service';
import { getAnalytics, logEvent } from 'firebase/analytics';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [APP_IMPORTS]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm!: FormGroup;
  emailPattern = emailPattern;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private messageService: ToastMessageService,
    private userService: UserService
  ) { }

  ngOnInit() {
    logEvent(getAnalytics(), 'page_view', { page_title: 'Forgot Password', page_path: '/forgot-password' });
    this.initializeForm();
  }

  initializeForm(): void {
    this.forgotPassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]]
    });
  }

  async submit(): Promise<void> {
    this.markInvalidControls();

    if (this.forgotPassForm.invalid) {
      return;
    }

    const email = this.forgotPassForm.get('email').value;
    this.userService.isAlreadyExist('email', '==', email, ((isUserExist) => {
      if (isUserExist) {
        this.authService.forgotPassword(email).subscribe({
          next: () => {
            this.messageService.success('Your password reset request email has been successfully sent. Please check your inbox.');
            this.forgotPassForm.reset();
          },
          error: (error: Error) => {
            this.messageService.error(error.message);
          }
        })
      } else {
        this.messageService.warning('Failed to send password reset email. Please ensure the provided email address is valid and associated with an existing account.');
      }
    }));
  }

  private markInvalidControls(): void {
    Object.values(this.forgotPassForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }
}