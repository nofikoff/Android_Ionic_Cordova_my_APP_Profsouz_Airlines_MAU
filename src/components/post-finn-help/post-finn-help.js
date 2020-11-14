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
import { ActionSheetController, Events, NavController, Platform } from "ionic-angular";
import { Api, User } from "../../providers";
import { Flash } from "../../providers";
import { Clipboard } from "@ionic-native/clipboard";
import { Transfer } from "@ionic-native/transfer";
import { File } from '@ionic-native/file';
var PostFinnHelpComponent = (function () {
    function PostFinnHelpComponent(navCtrl, api, flash, clipboard, events, transfer, user, file, platform, actionSheetCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.events = events;
        this.transfer = transfer;
        this.user = user;
        this.file = file;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.storageDirectory = '';
        this.platform.ready().then(function () {
            if (_this.platform.is('ios')) {
                _this.storageDirectory = _this.file.documentsDirectory;
            }
            else if (_this.platform.is('android')) {
                _this.storageDirectory = _this.file.externalRootDirectory + '/Download/';
            }
        });
    }
    PostFinnHelpComponent.prototype.feedActionSheet = function (post) {
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
    PostFinnHelpComponent.prototype.deletePost = function (post) {
        var _this = this;
        this.api.delete("posts/" + post.id).subscribe(function (res) {
            if (res.success) {
                _this.events.publish('posts:delete', post.id);
                _this.flash.push('Пост успешно удален');
            }
        }, function (err) {
            console.log(err);
        });
    };
    PostFinnHelpComponent.prototype.editPost = function (post) {
        this.navCtrl.push('MoneyHelpPage', { post: post });
    };
    PostFinnHelpComponent.prototype.copyLink = function (post) {
        this.clipboard.copy(post.link);
    };
    PostFinnHelpComponent.prototype.downloadPdf = function (fileUrl) {
        this.api.download('posts/pdf/' + fileUrl);
    };
    PostFinnHelpComponent.prototype.downloadAttachment = function (fileUrl) {
        this.api.download('posts/attachment/' + fileUrl);
    };
    PostFinnHelpComponent.prototype.toPost = function (post) {
        this.navCtrl.push('MoneyHelpItemPage', { post: post });
    };
    PostFinnHelpComponent.prototype.toPostComments = function (post) {
        this.navCtrl.push('PostCommentPage', { post: post });
    };
    PostFinnHelpComponent.prototype.toProfile = function (post) {
        this.navCtrl.push('ProfilePage', { user: post.user_id });
    };
    return PostFinnHelpComponent;
}());
PostFinnHelpComponent = __decorate([
    Component({
        selector: 'post-finn-help',
        templateUrl: 'post-finn-help.html',
        providers: [File]
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        Clipboard,
        Events,
        Transfer,
        User,
        File,
        Platform,
        ActionSheetController])
], PostFinnHelpComponent);
export { PostFinnHelpComponent };
//# sourceMappingURL=post-finn-help.js.map