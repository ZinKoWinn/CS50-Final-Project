import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '@state/app.state';
import { isMaintenance } from '@selector/general-setting.selectors';
@Injectable({
    providedIn: 'root',
})
export class MaintenanceGuard {
    constructor(private store: Store<IAppState>, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.store.pipe(
            select(isMaintenance),
            tap((isMaintenance) => {
                console.log("Maintencance : ", isMaintenance);
                
                if (isMaintenance) {
                    this.router.navigate(['/maintenance']);
                }
            }),
            map(isMaintenance => !isMaintenance)
        );
    }
}