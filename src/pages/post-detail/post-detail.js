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
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Api, Flash } from '../../providers';
import { DomSanitizer } from "@angular/platform-browser";
var PostDetailPage = (function () {
    function PostDetailPage(navCtrl, navParams, api, flash, actionSheetCtrl, _sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.flash = flash;
        this.actionSheetCtrl = actionSheetCtrl;
        this._sanitizer = _sanitizer;
        this.post = null;
        this.post = this.navParams.get('post');
    }
    PostDetailPage.prototype.ngOnInit = function () {
        this.getPost();
    };
    PostDetailPage.prototype.doRefresh = function (refresher) {
        this.getPost().then(function () {
            refresher.complete();
        });
    };
    PostDetailPage.prototype.getPost = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.api.get("posts/" + _this.post.id).subscribe(function (res) {
                _this.post = res.data;
                resolve();
            }, function () {
                resolve();
            });
        });
    };
    PostDetailPage.prototype.addComment = function () {
        this.navCtrl.push('NewCommentPage', { post_id: this.post.id });
    };
    PostDetailPage.prototype.feedActionSheet = function () {
        var _this = this;
        var buttons = [
            {
                text: 'Редактировать',
                handler: function () {
                    _this.editPost();
                }
            },
            {
                text: 'История редактировать',
                handler: function () {
                    _this.goHistory();
                }
            },
            {
                text: 'Скопировать ссылку',
                handler: function () {
                    _this.copyLink();
                }
            },
            {
                text: 'Удалить',
                handler: function () {
                    _this.deletePost();
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
                        return _this.post.editable;
                    case 'Удалить':
                        return _this.post.deletable;
                    default:
                        return true;
                }
            })
        });
        actionSheet.present();
    };
    PostDetailPage.prototype.deletePost = function () {
        var _this = this;
        this.api.delete("posts/" + this.post.id).subscribe(function (res) {
            if (res.success) {
                _this.flash.push('Пост успешно удален');
                _this.navCtrl.pop();
            }
        }, function (err) {
            console.log(err);
        });
    };
    PostDetailPage.prototype.editPost = function () {
        this.navCtrl.push('NewPostPage', { post: this.post });
    };
    PostDetailPage.prototype.copyLink = function () {
        console.log('not implemented');
    };
    PostDetailPage.prototype.goHistory = function () {
        this.navCtrl.push('PostHistoryPage', { post: this.post });
    };
    PostDetailPage.prototype.downloadAttachment = function (fileUrl) {
        this.api.download('posts/attachment/' + fileUrl);
    };
    PostDetailPage.prototype.toPostComments = function (post) {
        this.navCtrl.push('PostCommentPage', { post: post });
    };
    PostDetailPage.prototype.getImage = function (image) {
        return this._sanitizer.bypassSecurityTrustStyle(image);
    };
    return PostDetailPage;
}());
PostDetailPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-post-detail',
        templateUrl: 'post-detail.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        Flash,
        ActionSheetController,
        DomSanitizer])
], PostDetailPage);
export { PostDetailPage };
//# sourceMappingURL=post-detail.js.map