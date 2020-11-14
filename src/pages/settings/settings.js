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
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Api } from "../../providers";
var SettingsPage = (function () {
    function SettingsPage(navCtrl, navParams, storage, loadingCtrl, api, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.api = api;
        this.translate = translate;
        this.branches = [];
    }
    SettingsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.api.get('settings/branches').subscribe(function (ctx) {
            _this.branches = ctx.data;
            console.log(_this.branches);
        });
    };
    SettingsPage.prototype.selectLanguage = function (value) {
        var _this = this;
        this.api.get('lang/' + value).subscribe(function () {
            _this.translate.use(value);
            _this.storage.set('locale', value);
        });
    };
    SettingsPage.prototype.changeBranch = function (branch) {
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        var url = branch.follow ? 'settings/notifications/branch/follow' : 'settings/notifications/branch/unFollow';
        this.api.post(url, { branch_id: branch.id, urgent: 1 }).subscribe(function () {
            loader.dismiss();
        }, function () {
            loader.dismiss();
        });
    };
    return SettingsPage;
}());
SettingsPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-settings',
        templateUrl: 'settings.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Storage,
        LoadingController,
        Api,
        TranslateService])
], SettingsPage);
export { SettingsPage };
//# sourceMappingURL=settings.js.map