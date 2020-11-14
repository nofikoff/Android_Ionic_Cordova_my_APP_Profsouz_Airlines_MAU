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
import { Api } from '../../providers';
var LibraryPage = (function () {
    function LibraryPage(navCtrl, api, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.navParams = navParams;
        this.categories = [];
    }
    LibraryPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.api.get('documents/branch').subscribe(function (ctx) {
            _this.categories = ctx.data;
        });
    };
    LibraryPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    LibraryPage.prototype.loadCategory = function (category) {
        this.navCtrl.push('LibraryListPage', { branch: category });
    };
    LibraryPage.prototype.openNewLibrary = function () {
        this.navCtrl.push('LibraryAddPage');
    };
    return LibraryPage;
}());
LibraryPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-library',
        templateUrl: 'library.html',
    }),
    __metadata("design:paramtypes", [NavController, Api, NavParams])
], LibraryPage);
export { LibraryPage };
//# sourceMappingURL=library.js.map