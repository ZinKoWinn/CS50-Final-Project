import { RouterLink, RouterModule } from '@angular/router'
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzPageHeaderAvatarDirective, NzPageHeaderTitleDirective } from 'ng-zorro-antd/page-header';
import { NzAutocompleteComponent, NzAutocompleteOptionComponent, NzAutocompleteTriggerDirective } from 'ng-zorro-antd/auto-complete';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { AuditMeetingNoteComponent } from '@component/audit-meeting-note/audit-meeting-note.component';
import { ForgotPasswordComponent } from '@component/forgot-password/forgot-password.component';
import { MeetingNoteCommonComponent } from '@shared/components/meeting-note-common/meeting-note-common.component';
import { MeetingNoteHistoryComponent } from '@component/meeting-note-history/meeting-note-history.component';
import { MemberComponent } from '@component/member/member.component';
import { MyNoteComponent } from '@component/my-note/my-note.component';
import { OnBehalfOfNoteComponent } from '@component/on-behalf-of-note/on-behalf-of-note.component';
import { ProjectComponent } from '@component/project/project.component';
import { SignInComponent } from '@component/sign-in/sign-in.component';
import { SignUpComponent } from '@component/sign-up/sign-up.component';
import { TeamComponent } from '@component/team/team.component';
import { UserComponent } from '@component/user/user.component';
import { VerifyEmailComponent } from '@component/verify-email/verify-email.component';
import { AdminLayoutComponent } from '@layout/admin-layout/admin-layout.component';
import { AuditLayoutComponent } from '@layout/audit-layout/audit-layout.component';
import { UserLayoutComponent } from '@layout/user-layout/user-layout.component';
import { IndividualLayoutComponent } from '@layout/individual-layout/individual-layout.component';
import { MeetingNoteItemComponent } from '@shared/components/meeting-note-item/meeting-note-item.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { TabMenuComponent } from '@shared/components/tab-menu/tab-menu.component';
import { UnauthorizedComponent } from '@shared/components/unauthorized/unauthorized.component';
import { MeetingNoteComponent } from '@component/meeting-note/meeting-note.component';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { MaintenanceComponent } from '@component/maintenance/maintenance.component';
import { GeneralSettingComponent } from '@component/general-setting/general-setting.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


export const APP_IMPORTS = [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzDividerModule,
    NzCardModule,
    NzSelectModule,
    NzTableModule,
    NzModalModule,
    NzUploadModule,
    NzMessageModule,
    NzIconModule,
    NzTabsModule,
    NzCollapseModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzPaginationModule,
    NzSpinModule,
    RouterLink,
    NzAvatarComponent,
    NzPageHeaderAvatarDirective,
    NzPageHeaderTitleDirective,
    NzAutocompleteTriggerDirective,
    NzAutocompleteComponent,
    NzAutocompleteOptionComponent,
    NzModalModule,
    NzListModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzQRCodeModule,
    NzTypographyModule,
    NzTagModule,
    NzPopoverModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzSwitchModule,
    NzEmptyModule
];


export const COMPONENT_IMPORTS = [
    AuditMeetingNoteComponent,
    ForgotPasswordComponent,
    MeetingNoteCommonComponent,
    MeetingNoteHistoryComponent,
    MeetingNoteComponent,
    MemberComponent,
    MyNoteComponent,
    OnBehalfOfNoteComponent,
    ProjectComponent,
    SignInComponent,
    SignUpComponent,
    TeamComponent,
    UserComponent,
    VerifyEmailComponent,
    AdminLayoutComponent,
    AuditLayoutComponent,
    UserLayoutComponent,
    IndividualLayoutComponent,
    MeetingNoteItemComponent,
    NotFoundComponent,
    TabMenuComponent,
    UnauthorizedComponent,
    MaintenanceComponent,
    GeneralSettingComponent
];

export const PIPE_IMPORTS = [
    SortByPipe,
    DatePipe,
    KeyValuePipe,
];
