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
import { App, IonicPage, NavController } from 'ionic-angular';
import { User, Flash, Api } from '../../providers';
import config from '../../init';
import { Sim } from "@ionic-native/sim";
var LoginPage = (function () {
    function LoginPage(navCtrl, user, flash, sim, api, translateService, _app) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.user = user;
        this.flash = flash;
        this.sim = sim;
        this.api = api;
        this.translateService = translateService;
        this._app = _app;
        // The account fields for the login form.
        // If you're using the username field with or without email, make
        // sure to add it to the type
        this.account = {
            username: '',
            password: '',
            grant_type: 'password',
            client_id: config.clientId,
            client_secret: config.clientSecret,
        };
        // put errors from ajax response
        this.errors = {};
        this.isProceed = false;
        this.translateService.get('LOGIN_ERROR').subscribe(function (value) {
            _this.loginErrorString = value;
        });
        this.sim.hasReadPermission().then(function (info) {
            if (info) {
                _this.sim.getSimInfo().then(function (info) {
                    _this.account.username = info.phoneNumber;
                }, function (err) {
                    console.log(err);
                });
            }
            else {
                _this.sim.requestReadPermission().then(function () {
                    _this.sim.getSimInfo().then(function (info) {
                        _this.account.username = info.phoneNumber;
                    }, function (err) {
                        console.log(err);
                    });
                }, function (err) {
                    console.log(err);
                });
            }
        }, function (err) {
            console.log(err);
        });
    }
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        if (this.account.username.length > 0 && this.account.password.length > 0) {
            this.isProceed = true;
            this.user.login(this.account).then(function () {
                _this.flash.push('Вы успешно авторизовались');
                _this.isProceed = false;
            }, function (err) {
                _this.errors = err.error.errors;
                _this.flash.push(_this.loginErrorString);
                _this.isProceed = false;
            });
        }
    };
    LoginPage.prototype.openPage = function (name) {
        this.navCtrl.push(name);
    };
    LoginPage.prototype.isError = function (value) {
        return this.errors && this.errors.hasOwnProperty(value);
    };
    return LoginPage;
}());
LoginPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [NavController,
        User,
        Flash,
        Sim,
        Api,
        TranslateService,
        App])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map