import { defaultGeneralSetting, GeneralSetting } from "@model/general-setting";

export interface GeneralSettingState {
    generalSetting: GeneralSetting;
    loading: boolean;
    error: any;
}

export const initialGeneralSettingState: GeneralSettingState = {
    generalSetting: defaultGeneralSetting,
    loading: false,
    error: null,
};
