import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import * as generalSettingActions from '@action/general-setting.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@state/app.state';
import { GeneralSettingService } from '@service/general-setting.service';
import { selectGeneralSetting } from '@selector/general-setting.selectors';
import { defaultGeneralSetting, GeneralSetting } from '@model/general-setting';
import { GENERAL_SETTING_ID } from '@constant/app.constant';

@Injectable()
export class GeneralSettingEffects {
    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private generalSettingServcie: GeneralSettingService
    ) { }

    loadGeneralSetting$ = createEffect(() =>
        this.actions$.pipe(
            ofType(generalSettingActions.loadGeneralSetting),
            withLatestFrom(this.store.pipe(select(selectGeneralSetting))),
            mergeMap(([action, generalSetting]) =>
                generalSetting
                    ? of(generalSettingActions.loadGeneralSettingSuccess({ generalSetting: generalSetting }))
                    : this.generalSettingServcie.getOne(GENERAL_SETTING_ID).pipe(
                        map((gs) => generalSettingActions.loadGeneralSettingSuccess({ generalSetting: gs ? gs : defaultGeneralSetting })),
                        catchError((error) => {
                            return of(generalSettingActions.loadGeneralSettingFailure(error));
                        })
                    )
            )
        )
    );

    realTimeUpdate$ = createEffect(() =>
        this.generalSettingServcie.getOne(GENERAL_SETTING_ID).pipe(
            map((generalSetting: GeneralSetting) =>
                generalSettingActions.loadGeneralSettingSuccess({ generalSetting })
            ),
            catchError((error) => of(generalSettingActions.loadGeneralSettingFailure(error)))
        )
    );
}