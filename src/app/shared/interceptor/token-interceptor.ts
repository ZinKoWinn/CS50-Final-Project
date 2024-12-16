import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environment";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                'X-Viber-Auth-Token': `${environment.viberAuthToken}`,
            },
        });

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(err);
            })
        );

    }

}