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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, User } from "../../providers";
var MembersPage = (function () {
    function MembersPage(navCtrl, api, user, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.user = user;
        this.navParams = navParams;
        this.users = [];
        this.users = this.navParams.get('users');
    }
    MembersPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    MembersPage.prototype.formatPhone = function (phone) {
        var pattern = "+##(###)### ## ##";
        var i = 0, v = phone.toString();
        return pattern.replace(/#/g, function (_) { return v[i++]; });
    };
    MembersPage.prototype.toProfile = function (user) {
        this.navCtrl.push('ProfilePage', { user: user.id });
    };
    return MembersPage;
}());
MembersPage.url = "users/branch/";
MembersPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-members',
        templateUrl: 'members.html',
    }),
    __metadata("design:paramtypes", [NavController, Api, User, NavParams])
], MembersPage);
export { MembersPage };
//# sourceMappingURL=members.js.map