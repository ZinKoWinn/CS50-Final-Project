import { enableProdMode, importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularFireModule } from '@angular/fire/compat';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withInterceptorsFromDi, provideHttpClient, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { RouterModule, provideRouter, withHashLocation } from '@angular/router';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { AppComponent } from './app/app.component';
import { environment } from '@environment';
import { APP_ROUTES } from '@route/*';
import { AuthGuard } from '@shared/guard/auth.guard';
import { DataService } from '@service/data.service';
import { AuthEffects } from '@effect/auth.effects';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAnalyticsModule } from "@angular/fire/compat/analytics";
import { ProjectEffects } from '@effect/project.effects';
import { appReducers, metaReducers } from '@reducer/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TeamEffects } from '@effect/team.effects';
import { MemberEffects } from '@effect/member.effects';
import { TokenInterceptor } from '@shared/interceptor/token-interceptor';
import { AdminGuard } from '@shared/guard/admin.guard';
import { UserGuard } from '@shared/guard/user.guard';
import { UserEffects } from '@effect/user.effects';
import { MeetingNotesEffects } from '@effect/meeting.notes.effects';
import { GeneralSettingEffects } from '@effect/general-setting.effects';
import { MaintenanceGuard } from '@shared/guard/maintenance.guard';
import { MeetingNotesHistoryEffects } from '@effect/meeting.notes.histroy.effects';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);


if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = window.console.error = window.console.warn = window.console.info = window.console.trace = window.console.debug = () => { };
  }

}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withHashLocation()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      HttpClientJsonpModule,
      ReactiveFormsModule,
      ScrollingModule,
      DragDropModule,
      RouterModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAnalyticsModule,
      UserTrackingService,
      ScreenTrackingService,
      StoreModule.forRoot(appReducers,
        {
          metaReducers,
          runtimeChecks: {
            strictActionImmutability: false,
            strictStateImmutability: true,
          }
        }
      ),
      EffectsModule.forRoot([
        AuthEffects,
        UserEffects,
        TeamEffects,
        MemberEffects,
        ProjectEffects,
        MeetingNotesEffects,
        MeetingNotesHistoryEffects,
        GeneralSettingEffects
      ]),
      StoreDevtoolsModule.instrument(),
    ),
    MaintenanceGuard,
    AuthGuard,
    AdminGuard,
    UserGuard,
    DataService,
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: UserTrackingService },
    { provide: ScreenTrackingService },
    { provide: 'Navigator', useValue: navigator },
    provideHotToastConfig(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ]
})
  .catch(err => console.error(err));
