import { GeneralSetting } from "@model/general-setting";
import { createAction, props } from "@ngrx/store";

export const loadGeneralSetting = createAction('[General Setting] Load General Setting');
export const loadGeneralSettingSuccess = createAction('[General Setting] Load General Setting Success', props<{ generalSetting: GeneralSetting }>());
export const loadGeneralSettingFailure = createAction('[General Setting] Load General Setting Failure', props<{ error: any }>());