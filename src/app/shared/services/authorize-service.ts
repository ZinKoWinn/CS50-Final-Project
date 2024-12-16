import { Injectable } from "@angular/core";
import { defaultSuperAdmin } from "@constant/app.constant";
import { AuthInfo, defaultAuthInfo } from "@model/auth.info";
import { Store } from "@ngrx/store";
import { selectAuthInfo } from "@selector/auth.selectors";
import { IAppState } from "@state/app.state";
import { cloneDeep } from "lodash";

@Injectable({
    providedIn: 'root',
})
export class AuthorizeService {
    public authInfo: AuthInfo = cloneDeep(defaultAuthInfo);
    private superAdmin = defaultSuperAdmin;

    constructor(private store: Store<IAppState>) {
        this.store.select(selectAuthInfo).subscribe({
            next: (authInfo) => this.authInfo = authInfo
        })
    }

    get isUser(): boolean {
        return this.authInfo?.user?.roles.includes('USER_ROLE');
    }

    get isAuditor(): boolean {
        return this.authInfo?.user?.roles.includes('AUDITOR_ROLE');
    }

    get isAdmin(): boolean {
        return this.authInfo?.user?.roles.includes('ADMIN_ROLE');
    }

    get isSuperAdmin(): boolean {
        return this.authInfo?.user?.name == this.superAdmin.name && !this.isAdmin;
    }

    get isNotSuperAdmin(): boolean {
        return this.authInfo?.user?.name != this.superAdmin.name || !this.isAdmin;
    }

    get isTeamLead(): boolean {
        return this.authInfo?.user?.roles.includes('TEAMLEAD_ROLE');
    }
}