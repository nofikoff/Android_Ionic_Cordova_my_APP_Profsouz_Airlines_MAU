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
import { IonicPage, NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Api, Pages, User, Flash } from "../../providers";
import { Clipboard } from "@ionic-native/clipboard";
var ProfilePage = (function () {
    function ProfilePage(navCtrl, navParams, api, user, flash, clipboard, storage, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.user = user;
        this.flash = flash;
        this.clipboard = clipboard;
        this.storage = storage;
        this.actionSheetCtrl = actionSheetCtrl;
        this.profile = null;
        this.posts = [];
        this.url = 'posts/my';
        if (this.navParams.data.hasOwnProperty('user')) {
            this.url = 'users/' + this.navParams.get('user') + '/posts';
        }
        this.pages = new Pages(api, this.url);
    }
    ProfilePage.prototype.ngOnInit = function () {
        var _this = this;
        if (this.navParams.data.hasOwnProperty('user')) {
            this.api.get('users/' + this.navParams.get('user')).subscribe(function (res) {
                _this.profile = res.data;
            });
            this.self = false;
        }
        else {
            this.user.getProfile().subscribe(function (profile) {
                _this.profile = profile;
            });
            this.self = true;
        }
        this.getPosts();
    };
    ProfilePage.prototype.setUserConfirm = function (val) {
        var _this = this;
        this.api.post('users/confirm/' + this.profile.id, {
            is_confirmed: val
        }).subscribe(function (res) {
            _this.profile = res.data;
        });
    };
    ProfilePage.prototype.ionViewWillEnter = function () {
        this.user.updateState();
        this.refreshPosts();
    };
    ProfilePage.prototype.doRefresh = function (refresher) {
        this.user.updateState();
        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(function () {
            refresher.complete();
        });
    };
    ProfilePage.prototype.feedActionSheet = function (post) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Что сделать с записью',
            buttons: [
                {
                    text: 'Редактировать',
                    handler: function () {
                        _this.editPost(post);
                    }
                }, {
                    text: 'Скопировать ссылку',
                    handler: function () {
                        _this.copyLink(post);
                    }
                }, {
                    text: 'Удалить',
                    handler: function () {
                        _this.deletePost(post);
                    }
                }, {
                    text: 'Отменить',
                    role: 'cancel',
                    handler: function () {
                        return;
                    }
                }
            ]
        });
        actionSheet.present();
    };
    ProfilePage.prototype.getNextPage = function (ionInfinite) {
        this.getPosts().then(function () {
            ionInfinite.complete();
        });
    };
    ProfilePage.prototype.getPosts = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.posts = data;
        });
    };
    ProfilePage.prototype.refreshPosts = function () {
        if (this.posts.length) {
            this.pages.refreshPages();
            this.posts = [];
            this.getPosts();
        }
    };
    ProfilePage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    ProfilePage.prototype.editProfile = function () {
        this.navCtrl.push('EditProfilePage', { profile: this.profile });
    };
    ProfilePage.prototype.getFullName = function () {
        return this.profile.first_name + " " + this.profile.last_name;
    };
    ProfilePage.prototype.comments = function () {
        this.navCtrl.push('CommentsPage');
    };
    ProfilePage.prototype.deletePost = function (post_id) {
        var _this = this;
        this.api.delete("posts/" + post_id).subscribe(function (res) {
            if (res.success) {
                _this.posts = _this.posts.filter(function (val) {
                    return val.id !== post_id;
                });
                _this.flash.push('Пост успешно удален');
            }
        }, function (err) {
            console.log(err);
        });
    };
    ProfilePage.prototype.editPost = function (post) {
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
    ProfilePage.prototype.copyLink = function (post_id) {
        this.clipboard.copy("" + post_id);
    };
    ProfilePage.prototype.toPost = function (post) {
        var page = 'PostDetailPage';
        switch (post.type) {
            case 'default':
                page = 'PostDetailPage';
                break;
            case 'question':
                page = post.question.user_option_id ? 'VoteResultPage' : 'VotePage';
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
    ProfilePage.prototype.formatPhone = function (phone) {
        var pattern = "+##(###)### ## ##";
        var i = 0, v = phone.toString();
        return pattern.replace(/#/g, function (_) { return v[i++]; });
    };
    return ProfilePage;
}());
ProfilePage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-profile',
        templateUrl: 'profile.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        User,
        Flash,
        Clipboard,
        Storage,
        ActionSheetController])
], ProfilePage);
export { ProfilePage };
//# sourceMappingURL=profile.js.map