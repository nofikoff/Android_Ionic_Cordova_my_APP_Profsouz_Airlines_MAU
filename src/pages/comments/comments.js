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
import { Storage } from "@ionic/storage";
import { Api, Pages, User } from '../../providers';
var CommentsPage = CommentsPage_1 = (function () {
    function CommentsPage(navCtrl, navParams, api, user, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.user = user;
        this.storage = storage;
        this.comments = [];
        this.pages = new Pages(api, CommentsPage_1.url);
    }
    CommentsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.user.getProfile().subscribe(function (profile) {
            _this.profile = profile;
        });
    };
    CommentsPage.prototype.doRefresh = function (refresher) {
        this.refreshComments().then(function () {
            refresher.complete();
        });
    };
    CommentsPage.prototype.ionViewWillEnter = function () {
        this.refreshComments();
    };
    CommentsPage.prototype.getNextPage = function (infiniteScroll) {
        this.refreshComments().then(function () {
            infiniteScroll.complete();
        });
    };
    CommentsPage.prototype.getComments = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.comments = data;
        });
    };
    CommentsPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    CommentsPage.prototype.refreshComments = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.pages.refreshPages();
            _this.comments = [];
            _this.getComments().then(function () {
                resolve(true);
            });
        });
    };
    CommentsPage.prototype.toPost = function (id) {
        this.navCtrl.push('PostDetailPage', { post: { id: id } });
    };
    CommentsPage.prototype.toEdit = function (comment) {
        this.navCtrl.push('NewCommentPage', { comment: comment, post_id: comment.post_id });
    };
    CommentsPage.prototype.getFullName = function () {
        return this.profile.first_name + " " + this.profile.last_name;
    };
    return CommentsPage;
}());
CommentsPage.url = 'posts/comments/my';
CommentsPage = CommentsPage_1 = __decorate([
    IonicPage(),
    Component({
        selector: 'page-comments',
        templateUrl: 'comments.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        User,
        Storage])
], CommentsPage);
export { CommentsPage };
var CommentsPage_1;
//# sourceMappingURL=comments.js.map