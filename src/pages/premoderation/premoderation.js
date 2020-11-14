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
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Pages, Api, Flash } from "../../providers";
import { Clipboard } from "@ionic-native/clipboard";
var PremoderationPage = (function () {
    function PremoderationPage(navCtrl, api, flash, clipboard, actionSheetCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.posts = [];
        this.pages = new Pages(api, 'posts/premoderate');
    }
    PremoderationPage.prototype.ngOnInit = function () {
        this.getPosts();
    };
    PremoderationPage.prototype.ionViewWillEnter = function () {
        this.refreshPosts();
    };
    PremoderationPage.prototype.doRefresh = function (refresher) {
        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(function () {
            refresher.complete();
        });
    };
    PremoderationPage.prototype.getNextPage = function (infiniteScroll) {
        this.getPosts().then(function () {
            infiniteScroll.complete();
        });
    };
    PremoderationPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    PremoderationPage.prototype.refreshPosts = function () {
        if (this.posts.length) {
            this.pages.refreshPages();
            this.posts = [];
            this.getPosts();
        }
    };
    PremoderationPage.prototype.getPosts = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.posts = data;
        });
    };
    PremoderationPage.prototype.feedActionSheet = function (post) {
        var _this = this;
        var buttons = [
            {
                text: 'Редактировать',
                handler: function () {
                    _this.editPost(post);
                }
            },
            {
                text: 'Скопировать ссылку',
                handler: function () {
                    _this.copyLink(post);
                }
            },
            {
                text: 'Удалить',
                handler: function () {
                    _this.deletePost(post);
                }
            },
            {
                text: 'Отменить',
                role: 'cancel',
                handler: function () {
                    return;
                }
            }
        ];
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Что сделать с записью',
            buttons: buttons.filter(function (v) {
                switch (v.text) {
                    case 'Редактировать':
                        return post.editable;
                    case 'Удалить':
                        return post.deletable;
                    default:
                        return true;
                }
            })
        });
        actionSheet.present();
    };
    PremoderationPage.prototype.deletePost = function (post) {
        var _this = this;
        this.api.delete("posts/" + post.id).subscribe(function (res) {
            if (res.success) {
                _this.posts = _this.posts.filter(function (val) {
                    return val.id !== post.id;
                });
                _this.flash.push('Пост успешно удален');
            }
        }, function (err) {
            console.log(err);
        });
    };
    PremoderationPage.prototype.editPost = function (post) {
        var page = 'NewPostPage';
        switch (post.type) {
            case 'default':
                page = 'NewPostPage';
                break;
            case 'question':
                page = 'NewVotePage';
                break;
            case 'finn_help':
                page = 'MoneyHelpPage';
                break;
            default:
                page = 'NewPostPage';
                break;
        }
        this.navCtrl.push(page, { post: post });
    };
    PremoderationPage.prototype.copyLink = function (post) {
        this.clipboard.copy("" + post.id);
    };
    PremoderationPage.prototype.toPost = function (post) {
        var page = 'PostDetailPage';
        switch (post.type) {
            case 'default':
                page = 'PostDetailPage';
                break;
            case 'question':
                page = 'NewVotePage';
                break;
            case 'finn_help':
                page = 'MoneyHelpItemPage';
                break;
            default:
                page = 'PostDetailPage';
                break;
        }
        this.navCtrl.push(page, { post: post });
    };
    return PremoderationPage;
}());
PremoderationPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-premoderation',
        templateUrl: 'premoderation.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        Clipboard,
        ActionSheetController,
        NavParams])
], PremoderationPage);
export { PremoderationPage };
//# sourceMappingURL=premoderation.js.map