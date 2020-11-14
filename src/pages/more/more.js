var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { User } from "../../providers";
import { LoginPage } from "../login/login";
var MorePage = (function () {
    function MorePage(navCtrl, user, navParams, _app) {
        this.navCtrl = navCtrl;
        this.user = user;
        this.navParams = navParams;
        this._app = _app;
        this.profile = null;
    }
    MorePage.prototype.ngOnInit = function () {
        var _this = this;
        this.user.getProfile().subscribe(function (profile) {
            _this.profile = profile;
        });
    };
    MorePage.prototype.getFullName = function () {
        return this.profile.first_name + " " + this.profile.last_name;
    };
    MorePage.prototype.openPage = function (name) {
        this.navCtrl.push(name);
    };
    MorePage.prototype.logout = function () {
        this.user.logout();
        this._app.getRootNav().setRoot(LoginPage);
    };
    return MorePage;
}());
MorePage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-more',
        templateUrl: 'more.html',
    }),
    __metadata("design:paramtypes", [NavController,
        User,
        NavParams,
        App])
], MorePage);
export { MorePage };
//# sourceMappingURL=more.js.map