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
import { TranslateService } from "@ngx-translate/core";
import { Flash, Api } from "../../providers";
var ResetPasswordPage = (function () {
    function ResetPasswordPage(navCtrl, api, flash, translateService, loadingCtrl, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.translateService = translateService;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.resetForm = {
            phone: '',
            token: '',
            password: '',
            password_confirmation: ''
        };
        this.translateService.get('RESET_ERROR').subscribe(function (value) {
            _this.errorString = value;
        });
        this.translateService.get('RESET_SUCCESS').subscribe(function (value) {
            _this.successString = value;
        });
    }
    ResetPasswordPage.prototype.reset = function () {
        var _this = this;
        if (!this.resetForm.phone.length ||
            !this.resetForm.token ||
            !this.resetForm.password.length ||
            !this.resetForm.password_confirmation.length) {
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        this.api.post('password/reset', this.resetForm).subscribe(function (res) {
            console.log(res);
            _this.flash.push(_this.successString);
            _this.navCtrl.setRoot('LoginPage');
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
    ResetPasswordPage.prototype.isError = function (name) {
        return this.errors && this.errors.hasOwnProperty(name);
    };
    return ResetPasswordPage;
}());
ResetPasswordPage = __decorate([
    IonicPage({
        segment: 'reset/:token'
    }),
    Component({
        selector: 'page-reset-password',
        templateUrl: 'reset-password.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        TranslateService,
        LoadingController,
        NavParams])
], ResetPasswordPage);
export { ResetPasswordPage };
//# sourceMappingURL=reset-password.js.map