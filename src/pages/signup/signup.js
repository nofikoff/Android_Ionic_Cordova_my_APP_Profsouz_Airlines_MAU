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
import { IonicPage, NavController } from 'ionic-angular';
import { User, Flash } from '../../providers';
import { Sim } from "@ionic-native/sim";
var SignupPage = (function () {
    function SignupPage(navCtrl, user, flash, sim, translateService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.user = user;
        this.flash = flash;
        this.sim = sim;
        this.translateService = translateService;
        // The account fields for the login form.
        // If you're using the username field with or without email, make
        // sure to add it to the type
        this.account = {
            first_name: '',
            last_name: '',
            phone: '',
            password: '',
            password_confirmation: ''
        };
        // put errors from ajax response
        this.errors = null;
        this.isProceed = false;
        this.translateService.get('SIGNUP_ERROR').subscribe(function (value) {
            _this.signupErrorString = value;
        });
        this.sim.hasReadPermission().then(function (info) {
            if (info) {
                _this.sim.getSimInfo().then(function (info) {
                    _this.account.phone = info.phoneNumber;
                }, function (err) {
                    console.log(err);
                });
            }
            else {
                _this.sim.requestReadPermission().then(function () {
                    _this.sim.getSimInfo().then(function (info) {
                        _this.account.phone = info.phoneNumber;
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
    SignupPage.prototype.doSignup = function () {
        var _this = this;
        this.isProceed = true;
        this.user.signup(this.account).then(function () {
            _this.navCtrl.push('SignupCompletedPage');
            _this.isProceed = false;
        }, function (err) {
            var errors = _this.errors = err.error.errors;
            if (errors.phone) {
                _this.flash.push(errors.phone[0]);
            }
            else {
                _this.flash.push(_this.signupErrorString);
            }
            _this.isProceed = false;
        });
    };
    SignupPage.prototype.isError = function (value) {
        return this.errors && this.errors.hasOwnProperty(value);
    };
    return SignupPage;
}());
SignupPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-signup',
        templateUrl: 'signup.html'
    }),
    __metadata("design:paramtypes", [NavController,
        User,
        Flash,
        Sim,
        TranslateService])
], SignupPage);
export { SignupPage };
//# sourceMappingURL=signup.js.map