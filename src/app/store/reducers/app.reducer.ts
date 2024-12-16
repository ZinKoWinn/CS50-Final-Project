import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "@environment";
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import * as AuthActions from "@action/auth.actions";
import { IAppState } from "@state/app.state";
import { authReducer } from "./auth.reducer";
import { projectReducer } from "./project.reducer";
import { teamReducer } from "./team.reducer";
import { memberReducer } from "./member.reducer";
import * as CryptoJS from "crypto-js";
import { secretKey } from "@constant/app.constant";
import { userReducer } from "./user.reducer";
import { meetingNotesServiceReducer } from "./meeting.notes.reducer";
import { generalSettingReducer } from "./general-setting.reducer";
import { meetingNotesHistoryReducer } from "./meeting.notes.history.reducer";

export const appReducers: ActionReducerMap<IAppState> = {
    authInfo: authReducer,
    users: userReducer,
    teams: teamReducer,
    members: memberReducer,
    projects: projectReducer,
    meetingNotes: meetingNotesServiceReducer,
    generalSetting: generalSettingReducer,
    meetingNotesHistory: meetingNotesHistoryReducer
};

const encrypt = (state: any, key: string) => CryptoJS.AES.encrypt(state, key).toString();
const decrypt = (state: any, key: string) => CryptoJS.AES.decrypt(state, key).toString(CryptoJS.enc.Utf8);

const secureData = {
    // encrypt: (state: any) => encrypt(state, secretKey),
    // decrypt: (state: any) => decrypt(state, secretKey)
};

const config: LocalStorageConfig = {
    rehydrate: true,
    storage: sessionStorage,
    removeOnUndefined: true,
    restoreDates: false,
    keys: [
        {
            authInfo: secureData
        },
        {
            users: secureData
        },
        {
            teams: secureData
        },
        {
            members: secureData
        },
        {
            projects: secureData
        },
        {
            meetingNotes: secureData
        },
        {
            meetingNotesHistory: secureData
        },
        {
            generalSetting: secureData
        }
    ]
};

export function clearStateMetaReducer<IAppState extends {}>(reducer: ActionReducer<IAppState>): ActionReducer<any> {
    return (state: IAppState, action: Action) => {
        if (action.type === AuthActions.logout.type) {
            window.sessionStorage.clear();
            console.log("session Storage is clear");
            return reducer(undefined, action);
        }
        return reducer(state, action);
    };
}


export function storageSyncReducer(reducer: ActionReducer<IAppState>) {
    return localStorageSync(config)(reducer);

}

export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [clearStateMetaReducer, storageSyncReducer] : [clearStateMetaReducer, storageSyncReducer];
