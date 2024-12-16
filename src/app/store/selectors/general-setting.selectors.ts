import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GeneralSettingState } from "@state/general-setting.state";
import { Timestamp } from "firebase/firestore";
import { cloneDeep } from "lodash";

export const selectGeneralSettingState = createFeatureSelector<GeneralSettingState>('generalSetting');

export const selectGeneralSetting = createSelector(selectGeneralSettingState, (state) => state.generalSetting);
export const selectGeneralSettingLoading = createSelector(selectGeneralSettingState, (state) => state.loading);
export const selectGeneralSettingError = createSelector(selectGeneralSettingState, (state) => state.error);

export const selectMaintenance = createSelector(selectGeneralSettingState, (state) => state.generalSetting.maintenance);

export const isMaintenance = createSelector(selectGeneralSettingState, (state) => {
    const maintenance = cloneDeep(state.generalSetting?.maintenance);
    if (maintenance && maintenance.enabled) {
        // Check and convert Firestore Timestamps to Date objects
        if (maintenance.startDate instanceof Timestamp) {
            maintenance.startDate = maintenance.startDate.toDate();
        }
        if (maintenance.endDate instanceof Timestamp) {
            maintenance.endDate = maintenance.endDate.toDate();
        }

        // Check if startDate and endDate are valid Date objects
        const startDate = maintenance.startDate instanceof Date ? maintenance.startDate : new Date(maintenance.startDate);
        const endDate = maintenance.endDate instanceof Date ? maintenance.endDate : new Date(maintenance.endDate);

        // Ensure that startDate and endDate are valid dates before proceeding
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const now = Date.now();
            return now > startDate.getTime() && now < endDate.getTime();
        }
    }
    return false;
});