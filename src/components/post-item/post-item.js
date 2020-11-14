var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { ActionSheetController, Events, NavController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { Flash } from "../../providers/flash/flash";
import { Clipboard } from "@ionic-native/clipboard";
var PostItemComponent = (function () {
    function PostItemComponent(navCtrl, api, flash, clipboard, events, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.events = events;
        this.actionSheetCtrl = actionSheetCtrl;
    }
    PostItemComponent.prototype.feedActionSheet = function (post) {
        var _this = this;
        var buttons = [
            {
                text: 'Редактировать',
                handler: function () {
                    _this.editPost(post);
                }
            },
            {
                text: 'История редактировать',
                handler: function () {
                    _this.toHistory(post);
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
    PostItemComponent.prototype.deletePost = function (post) {
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
    PostItemComponent.prototype.downloadAttachment = function (fileUrl) {
        this.api.download('posts/attachment/' + fileUrl);
    };
    PostItemComponent.prototype.editPost = function (post) {
        this.navCtrl.push('NewPostPage', { post: post });
    };
    PostItemComponent.prototype.toHistory = function (post) {
        this.navCtrl.push('PostHistoryPage', { post: post });
    };
    PostItemComponent.prototype.copyLink = function (post) {
        this.clipboard.copy(post.link);
    };
    PostItemComponent.prototype.toPost = function (post) {
        this.navCtrl.push('PostDetailPage', { post: post });
    };
    PostItemComponent.prototype.toPostComments = function (post) {
        this.navCtrl.push('PostCommentPage', { post: post });
    };
    PostItemComponent.prototype.toProfile = function (post) {
        this.navCtrl.push('ProfilePage', { user: post.user_id });
    };
    return PostItemComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], PostItemComponent.prototype, "item", void 0);
PostItemComponent = __decorate([
    Component({
        selector: 'post-item',
        templateUrl: 'post-item.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        Clipboard,
        Events,
        ActionSheetController])
], PostItemComponent);
export { PostItemComponent };
//# sourceMappingURL=post-item.js.map