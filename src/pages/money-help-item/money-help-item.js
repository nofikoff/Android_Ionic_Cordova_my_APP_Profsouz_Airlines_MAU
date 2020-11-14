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
import { Api } from "../../providers";
import { DomSanitizer } from "@angular/platform-browser";
var MoneyHelpItemPage = (function () {
    function MoneyHelpItemPage(navCtrl, api, navParams, _sanitizer) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.navParams = navParams;
        this._sanitizer = _sanitizer;
        this.post = this.navParams.get('post');
        this.getPost();
    }
    MoneyHelpItemPage.prototype.doRefresh = function (refresher) {
        this.getPost().then(function () {
            refresher.complete();
        });
    };
    MoneyHelpItemPage.prototype.getPost = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.api.get('posts/' + _this.post.id).subscribe(function (res) {
                _this.post = res.data;
                resolve();
            }, function () {
                resolve();
            });
        });
    };
    MoneyHelpItemPage.prototype.downloadPdf = function (fileUrl) {
        this.api.download('posts/pdf/' + fileUrl);
    };
    MoneyHelpItemPage.prototype.downloadAttachment = function (fileUrl) {
        this.api.download('posts/attachment/' + fileUrl);
    };
    MoneyHelpItemPage.prototype.addComment = function () {
        this.navCtrl.push('NewCommentPage', { post_id: this.post.id });
    };
    MoneyHelpItemPage.prototype.goHistory = function () {
        this.navCtrl.push('PostHistoryPage', { post: this.post });
    };
    MoneyHelpItemPage.prototype.getImage = function (image) {
        return this._sanitizer.bypassSecurityTrustStyle(image);
    };
    return MoneyHelpItemPage;
}());
MoneyHelpItemPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-money-help-item',
        templateUrl: 'money-help-item.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        NavParams,
        DomSanitizer])
], MoneyHelpItemPage);
export { MoneyHelpItemPage };
//# sourceMappingURL=money-help-item.js.map