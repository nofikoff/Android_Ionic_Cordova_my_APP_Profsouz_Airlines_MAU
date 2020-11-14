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
import { Api, Flash, Pages } from "../../providers";
var PostHistoryPage = (function () {
    function PostHistoryPage(navCtrl, api, flash, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.navParams = navParams;
        this.logs = [];
        this.post = navParams.get('post');
        this.pages = new Pages(api, "posts/" + this.post.id + "/history");
    }
    PostHistoryPage.prototype.ngOnInit = function () {
        this.getLogs();
    };
    PostHistoryPage.prototype.ionViewWillEnter = function () {
        this.refreshPages();
    };
    PostHistoryPage.prototype.getText = function (item) {
        return item.template.replace(/<\/?[^>]+>/g, '');
    };
    PostHistoryPage.prototype.doRefresh = function (refresher) {
        this.pages.refreshPages();
        this.logs = [];
        this.getLogs().then(function () {
            refresher.complete();
        });
    };
    PostHistoryPage.prototype.getNextPage = function (infiniteScroll) {
        this.getLogs().then(function () {
            infiniteScroll.complete();
        });
    };
    PostHistoryPage.prototype.refreshPages = function () {
        if (this.logs.length !== 0) {
            this.pages.refreshPages();
            this.logs = [];
            this.getLogs();
        }
    };
    PostHistoryPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    PostHistoryPage.prototype.getLogs = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.logs = data;
        });
    };
    return PostHistoryPage;
}());
PostHistoryPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-post-history',
        templateUrl: 'post-history.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        NavParams])
], PostHistoryPage);
export { PostHistoryPage };
//# sourceMappingURL=post-history.js.map