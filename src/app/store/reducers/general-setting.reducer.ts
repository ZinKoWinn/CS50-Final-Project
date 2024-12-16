import { createReducer, on } from "@ngrx/store";
import { initialGeneralSettingState } from "@state/general-setting.state";
import * as generalSettingActions from '@action/general-setting.actions'

export const generalSettingReducer = createReducer(
    initialGeneralSettingState,
    on(generalSettingActions.loadGeneralSetting, (state) => ({ ...state, loading: true })),
    on(generalSettingActions.loadGeneralSettingSuccess, (state, { generalSetting }) => ({ ...state, generalSetting, loading: false, error: null })),
    on(generalSettingActions.loadGeneralSettingFailure, (state, { error }) => ({ ...state, loading: false, error })),
);