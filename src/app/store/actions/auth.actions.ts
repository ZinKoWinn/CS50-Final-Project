import { AuthCredential, AuthInfo } from '@model/auth.info';
import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ authCredential: AuthCredential; loading: boolean }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ authInfo: AuthInfo; loading: boolean }>());
export const loginFailed = createAction('[Auth] Login Failed', props<{ error: any; loading: boolean }>());
export const signUp = createAction('[Auth] Sign Up', props<{ email: string; name: string; password: string; loading: boolean }>());
export const signUpSuccess = createAction('[Auth] Sign Up Success', props<{ authInfo: AuthInfo; loading: boolean }>());
export const signUpFailed = createAction('[Auth] Sign Up Failed', props<{ error: any; loading: boolean }>());
export const sendVerificationMail = createAction('[Auth] Send Verification Mail', props<{ loading: boolean }>());
export const sendVerificationMailSuccess = createAction('[Auth] Send Verification Mail Success', props<{ loading: boolean }>());
export const sendVerificationMailFailed = createAction('[Auth] Send Verification Mail Failed', props<{ error: any; loading: boolean }>());
export const forgotPassword = createAction('[Auth] Forgot Password', props<{ email: string; loading: boolean }>());
export const forgotPasswordSuccess = createAction('[Auth] Forgot Password Success', props<{ loading: boolean }>());
export const forgotPasswordFailed = createAction('[Auth] Forgot Password Failed', props<{ error: any; loading: boolean }>());
export const logout = createAction('[Auth] Logout');
export const updateAuthUser = createAction('[Auth] Update Auth User', props<{ authInfo: AuthInfo }>());
