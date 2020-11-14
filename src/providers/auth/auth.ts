import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";

import {User} from "../";

@Injectable()
export class Auth implements HttpInterceptor {

    private _token: string;

    constructor(public inj: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.inj.get(User).getUser().subscribe((user) => {
            this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });

        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this._token}`
            }
        });

        return next.handle(req);
    }
}
