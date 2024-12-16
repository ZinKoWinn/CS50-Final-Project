import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User as FireBaseUser } from 'firebase/auth';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { User, defaultUser } from '@model/user';
import { AuthCredential, AuthInfo, defaultAuthInfo } from '@model/auth.info';
import { defaultAudit } from '@model/audit';
import { cloneDeep } from 'lodash';
import { getAuth } from '@angular/fire/auth';
import * as CryptoJS from "crypto-js";
import { secretKey } from '@constant/app.constant';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
  ) {
  }

  async createTempAccount(name: string, email: string, password: string): Promise<void> {
    const descryptedPass = CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
    const userCredential = (await this.afAuth.createUserWithEmailAndPassword(email, descryptedPass))
    await userCredential.user.updateProfile({ displayName: name });
    this.setUserData(userCredential.user);
  }

  signIn(authCredential: AuthCredential): Observable<AuthInfo> {
    const { email, password } = authCredential;
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;
        let updatedUser: User = cloneDeep(defaultUser);

        if (user) {
          updatedUser = await this.setUserData(user);
        }

        return this.mapToAuthInfo(updatedUser, user.refreshToken);
      }),
      catchError((error) => {
        const errorMessage = this.handleSignInError(error);
        return throwError(() => new Error(errorMessage, error));
      })
    );
  }

  signUp(email: string, displayName: string, password: string, isVerifyEmail: boolean = true): Observable<AuthInfo> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;

        if (user) {
          await user.updateProfile({ displayName });

          if (isVerifyEmail) {
            this.sendVerificationMail();
          }

          const updatedUser: User = await this.setUserData(user);
          return this.mapToAuthInfo(updatedUser, user.refreshToken);
        } else {
          return null;
        }
      }),
      catchError((error) => {
        const errorMessage = this.handleSignUpError(error);
        return throwError(() => new Error(errorMessage, error));
      })
    );
  }


  sendVerificationMail(): Observable<void> {
    return from(this.afAuth.currentUser?.then(u => u.sendEmailVerification())).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to send email verification. Please make sure you are logged in and your email address is valid.`, error));
      })
    );
  }

  forgotPassword(passwordResetEmail: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(passwordResetEmail)).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to send password reset email. Please ensure the provided email address is valid and associated with an existing account.`, error));
      })
    );
  }

  deleteUser(email: string): void {
    getAuth().currentUser.delete()
  }

  async setUserData(fUser: FireBaseUser): Promise<User> {
    try {
      const userRef: AngularFirestoreDocument<User> = this.afs.collection<User>('users').doc(fUser.uid);
      let userData: User = cloneDeep(defaultUser);
      await userRef.ref.get().then(docSnapshot => {
        const user = docSnapshot.data();
        userData = user ? { ...user, emailVerified: fUser.emailVerified } : this.mapToUser(fUser);

        if (user) {
          userData.audit.updatedDate = Timestamp.now();
          userData.audit.updatedBy = user.name;
        }
        userRef.set(userData, { merge: true });
      });
      return userData;
    } catch (error) {
      throw error;
    }
  }
  async signOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
  }

  mapToUser(fUser: FireBaseUser): User {
    const isAdmin = fUser.email.startsWith('superadmin');
    const isAuditor = fUser.email.startsWith('auditor');
    const user: User = {
      uid: fUser.uid,
      email: fUser.email,
      name: fUser.displayName,
      emailVerified: fUser.emailVerified,
      roles: isAdmin ? ['ADMIN_ROLE'] : isAuditor ? ['AUDITOR_ROLE'] : ['USER_ROLE'],
      audit: { ...defaultAudit, createdBy: fUser.displayName }
    };
    return user;
  }

  private mapToAuthInfo(user: User, refreshToken: string): AuthInfo {
    if (!user) {
      return defaultAuthInfo;
    }
    const authInfo: AuthInfo = { user: user, refreshToken: refreshToken }
    return authInfo;
  }

  private handleSignUpError(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'Email is already in use. Please use a different email or sign in.';
    } else if (error.code === 'auth/weak-password') {
      return 'Weak password. Please choose a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      return 'Invalid email address. Please enter a valid email.';
    } else {
      return `Sign up failed: ${error.message}`;
    }
  }

  private handleSignInError(error: any): string {
    if (error.code === 'auth/user-not-found') {
      return 'User not found. Please check your email or sign up for an account.';
    } else if (error.code === 'auth/wrong-password') {
      return 'Invalid password. Please check your password and try again.';
    } else if (error.code === 'auth/too-many-requests') {
      return 'Too many unsuccessful login attempts. Please try again later.';
    } else if (error.code === 'auth/user-disabled') {
      return 'Your account has been disabled. Please contact support for assistance.';
    } else if (error.code === 'auth/email-not-verified') {
      return 'Email not verified. Please check your email and verify your account.';
    } else if (error.code === 'auth/invalid-credential') {
      return 'Invalid credentials. Please check your email and password.';
    } else {
      return `Sign in failed: ${error.message}`;
    }
  }
}