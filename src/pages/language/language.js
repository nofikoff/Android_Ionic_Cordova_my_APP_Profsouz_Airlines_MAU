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
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";
var LanguagePage = (function () {
    function LanguagePage(navCtrl, translate, storage) {
        this.navCtrl = navCtrl;
        this.translate = translate;
        this.storage = storage;
        this.locale = 'ru';
    }
    LanguagePage.prototype.startApp = function () {
        this.translate.use(this.locale);
        this.storage.set('locale', this.locale);
        this.navCtrl.setRoot('LoginPage', {}, {
            animate: true,
            direction: 'forward'
        });
    };
    LanguagePage.prototype.setLocale = function () {
        this.translate.use(this.locale);
    };
    return LanguagePage;
}());
LanguagePage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-language',
        templateUrl: 'language.html',
    }),
    __metadata("design:paramtypes", [NavController,
        TranslateService,
        Storage])
], LanguagePage);
export { LanguagePage };
//# sourceMappingURL=language.js.map