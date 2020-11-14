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
var PostCommentPage = (function () {
    function PostCommentPage(navCtrl, api, flash, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.navParams = navParams;
        this.post = null;
        this.comments = [];
        this.firstLoading = true;
        this.post = navParams.get('post');
        this.pages = new Pages(api, "posts/" + this.post.id + "/comments");
    }
    PostCommentPage.prototype.ngOnInit = function () {
        var _this = this;
        this.getComments().then(function () {
            _this.firstLoading = false;
        });
    };
    PostCommentPage.prototype.ionViewDidEnter = function () {
        if (!this.firstLoading) {
            this.refreshComments();
        }
    };
    PostCommentPage.prototype.doRefresh = function (refresher) {
        this.pages.refreshPages();
        this.comments = [];
        this.getComments().then(function () {
            refresher.complete();
        });
    };
    PostCommentPage.prototype.getNextPage = function (infiniteScroll) {
        this.getComments().then(function () {
            infiniteScroll.complete();
        });
    };
    PostCommentPage.prototype.getComments = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.comments = data;
        });
    };
    PostCommentPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    PostCommentPage.prototype.refreshComments = function () {
        if (this.comments.length !== 0) {
            this.pages.refreshPages();
            this.comments = [];
            this.getComments();
        }
    };
    PostCommentPage.prototype.addComment = function () {
        this.navCtrl.push('NewCommentPage', { post_id: this.post.id });
    };
    return PostCommentPage;
}());
PostCommentPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-post-comment',
        templateUrl: 'post-comment.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        NavParams])
], PostCommentPage);
export { PostCommentPage };
//# sourceMappingURL=post-comment.js.map