var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, MenuController, Platform, Config, LoadingController, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { User, Api } from "../providers";
import { AppVersion } from "@ionic-native/app-version";
var ConferenceApp = (function () {
    function ConferenceApp(events, menu, platform, storage, user, api, splashScreen, translate, config, loadingCtrl, version) {
        var _this = this;
        this.events = events;
        this.menu = menu;
        this.platform = platform;
        this.storage = storage;
        this.user = user;
        this.api = api;
        this.splashScreen = splashScreen;
        this.translate = translate;
        this.config = config;
        this.loadingCtrl = loadingCtrl;
        this.version = version;
        this.splashScreen.show();
        this.initTranslate();
        this.eventListening();
        this.storage.get('locale').then(function (locale) {
            if (locale) {
                _this.checkAuth().then(function () {
                    _this.platformReady();
                });
            }
            else {
                _this.rootPage = 'LanguagePage';
                _this.platformReady();
            }
        });
    }
    ConferenceApp.prototype.checkAuth = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.user.auth().subscribe(function (res) {
                if (!res.auth) {
                    _this.rootPage = 'LoginPage';
                    resolve();
                }
                _this.user.loadState().then(function () {
                    resolve();
                }, resolve);
            }, function () {
                _this.rootPage = 'LoginPage';
                resolve();
            });
        });
    };
    ConferenceApp.prototype.subscribeProfile = function () {
        var _this = this;
        this.user.getProfile().subscribe(function (res) {
            if (Object.keys(res).length === 0) {
                return;
            }
            if (res.locale) {
                _this.storage.set('locale', res.locale);
                _this.translate.use(res.locale);
            }
            if (res.is_confirmed && (!res.position || !res.birthday || res.no_avatar)) {
                _this.rootPage = 'EditProfilePage';
            }
            else {
                _this.rootPage = res.is_confirmed ? 'TabsPage' : 'SignupCompletedPage';
            }
            if (_this.nav.getActive().name === 'LoginPage') {
                _this.nav.setRoot(_this.rootPage);
            }
        }, function () {
            _this.rootPage = 'LoginPage';
        });
    };
    ConferenceApp.prototype.initTranslate = function () {
        var _this = this;
        this.translate.setDefaultLang('ru');
        this.translate.use('ru');
        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(function (values) {
            _this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    };
    ConferenceApp.prototype.platformReady = function () {
        var _this = this;
        // Call any initial plugins when ready
        this.platform.ready().then(function () {
            _this.splashScreen.hide();
            _this.subscribeProfile();
            _this.showBuildVersion();
        });
    };
    ConferenceApp.prototype.eventListening = function () {
        var _this = this;
        this.events.subscribe('loading_start', function () {
            _this.translate.get('LOADING').subscribe(function (value) {
                _this.loader = _this.loadingCtrl.create({
                    content: value
                });
                _this.loader.present();
            });
        });
        this.events.subscribe('loading_end', function () {
            _this.loader.dismiss();
        });
    };
    ConferenceApp.prototype.showBuildVersion = function () {
        var _this = this;
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.user.getProfile().subscribe(function (user) {
                //By Novikov
                if (user.id === 1 || true) {
                    _this.version.getVersionCode().then(function (version) {
                        _this.vers_code = version;
                    });
                    return _this.version.getVersionNumber().then(function (version) {
                        _this.vers_number = version;
                    });
                }
            });
        }
    };
    return ConferenceApp;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], ConferenceApp.prototype, "nav", void 0);
ConferenceApp = __decorate([
    Component({
        templateUrl: 'app.template.html'
    }),
    __metadata("design:paramtypes", [Events,
        MenuController,
        Platform,
        Storage,
        User,
        Api,
        SplashScreen,
        TranslateService,
        Config,
        LoadingController,
        AppVersion])
], ConferenceApp);
export { ConferenceApp };
//# sourceMappingURL=app.component.js.map