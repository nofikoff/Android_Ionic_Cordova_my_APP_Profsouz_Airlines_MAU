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
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Api, Flash } from "../../providers";
import { TranslateService } from "@ngx-translate/core";
var ForgotPasswordPage = (function () {
    function ForgotPasswordPage(navCtrl, api, flash, translateService, loadingCtrl, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.translateService = translateService;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.phone = '';
        this.errors = {};
        this.translateService.get('FORGOT_ERROR').subscribe(function (value) {
            _this.errorString = value;
        });
        this.translateService.get('FORGOT_SUCCESS').subscribe(function (value) {
            _this.successString = value;
        });
    }
    ForgotPasswordPage.prototype.sendResetLink = function () {
        var _this = this;
        if (!this.phone.length) {
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        this.api.post('password/phone', { phone: this.phone }).subscribe(function () {
            _this.flash.push(_this.successString);
            _this.navCtrl.push('ResetPasswordPage');
            loader.dismiss();
        }, function (err) {
            if (err.status === 403) {
                _this.flash.push(_this.errorString);
            }
            if (err.status === 422) {
                _this.flash.push(_this.errorString);
                _this.errors = err.error.errors;
            }
            loader.dismiss();
        });
    };
    ForgotPasswordPage.prototype.isError = function (name) {
        return this.errors && this.errors.hasOwnProperty(name);
    };
    ForgotPasswordPage.prototype.openPage = function (name) {
        this.navCtrl.push(name);
    };
    return ForgotPasswordPage;
}());
ForgotPasswordPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-forgot-password',
        templateUrl: 'forgot-password.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        TranslateService,
        LoadingController,
        NavParams])
], ForgotPasswordPage);
export { ForgotPasswordPage };
//# sourceMappingURL=forgot-password.js.map