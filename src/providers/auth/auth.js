var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Injector } from '@angular/core';
import { User } from "../";
var Auth = (function () {
    function Auth(inj) {
        this.inj = inj;
    }
    Auth.prototype.intercept = function (req, next) {
        var _this = this;
        this.inj.get(User).getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + this._token
            }
        });
        return next.handle(req);
    };
    return Auth;
}());
Auth = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Injector])
], Auth);
export { Auth };
//# sourceMappingURL=auth.js.map