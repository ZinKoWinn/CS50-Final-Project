import { Routes } from '@angular/router';
import { MeetingNoteComponent } from './components/meeting-note/meeting-note.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { TeamComponent } from './components/team/team.component';
import { MemberComponent } from './components/member/member.component';
import { ProjectComponent } from './components/project/project.component';
import { IndividualLayoutComponent } from './layouts/individual-layout/individual-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { UserComponent } from '@component/user/user.component';
import { AdminGuard } from '@shared/guard/admin.guard';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { UserGuard } from '@shared/guard/user.guard';
import { UserLayoutComponent } from '@layout/user-layout/user-layout.component';
import { AuditLayoutComponent } from '@layout/audit-layout/audit-layout.component';
import { AuditMeetingNoteComponent } from '@component/audit-meeting-note/audit-meeting-note.component';
import { AuditGuard } from '@shared/guard/audit.guard';
import { MaintenanceComponent } from '@component/maintenance/maintenance.component';
import { GeneralSettingComponent } from '@component/general-setting/general-setting.component';
import { MaintenanceGuard } from '@shared/guard/maintenance.guard';

export const APP_ROUTES: Routes = [
  {
    path: '', component: IndividualLayoutComponent,
    children: [
      { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [MaintenanceGuard]  },
      { path: 'sign-up', component: SignUpComponent, canActivate: [MaintenanceGuard] },
      { path: 'verify-email', component: VerifyEmailComponent, canActivate: [MaintenanceGuard]  },
      { path: 'maintenance', component: MaintenanceComponent },
    ]
  },
  {
    path: 'user', component: UserLayoutComponent, canActivate: [AuthGuard, MaintenanceGuard],
    children: [
      { path: '', redirectTo: '/meeting-note', pathMatch: 'full' },
      { path: 'meeting-note', component: MeetingNoteComponent, canActivate: [UserGuard] }
    ]
  },
  {
    path: 'audit', component: AuditLayoutComponent, canActivate: [AuthGuard, MaintenanceGuard],
    children: [
      { path: '', redirectTo: '/meeting-note', pathMatch: 'full' },
      { path: 'meeting-note', component: AuditMeetingNoteComponent, canActivate: [AuditGuard] }
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/meeting-note', pathMatch: 'full' },
      { path: 'meeting-note', component: MeetingNoteComponent, canActivate: [AdminGuard] },
      { path: 'users', component: UserComponent, canActivate: [AdminGuard] },
      { path: 'teams', component: TeamComponent, canActivate: [AdminGuard] },
      { path: 'members', component: MemberComponent, canActivate: [AdminGuard] },
      { path: 'projects', component: ProjectComponent, canActivate: [AdminGuard] },
      { path: 'setting', component: GeneralSettingComponent, canActivate: [AdminGuard] },
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent },
];
