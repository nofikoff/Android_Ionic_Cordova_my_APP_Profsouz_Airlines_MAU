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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Api, Pages, Flash } from "../../providers";
var NotificationsPage = (function () {
    function NotificationsPage(navCtrl, navParams, api, events, flash) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.events = events;
        this.flash = flash;
        this.notifications = [];
        this._pages = new Pages(api, 'notifications');
    }
    NotificationsPage.prototype.ngOnInit = function () {
        this.getNotifications();
    };
    NotificationsPage.prototype.ionViewWillEnter = function () {
        this.refreshPages();
    };
    NotificationsPage.prototype.doRefresh = function (refresher) {
        this._pages.refreshPages();
        this.notifications = [];
        this.getNotifications().then(function () {
            refresher.complete();
        });
    };
    NotificationsPage.prototype.getNextPage = function (infiniteScroll) {
        var _this = this;
        this.getNotifications().then(function () {
            _this.events.publish('notifications:change');
            infiniteScroll.complete();
        });
    };
    NotificationsPage.prototype.getNotifications = function () {
        var _this = this;
        return this._pages.get().then(function (data) {
            _this.notifications = data;
            _this.events.publish('notifications:change');
        });
    };
    NotificationsPage.prototype.refreshPages = function () {
        if (this.notifications.length !== 0) {
            this._pages.refreshPages();
            this.notifications = [];
            this.getNotifications();
        }
    };
    NotificationsPage.prototype.hasMorePages = function () {
        return this._pages.hasMorePages();
    };
    NotificationsPage.prototype.goToEvent = function (item) {
        var _this = this;
        switch (item.entity_type) {
            case 'user':
                this.navCtrl.push('ProfilePage', { user: item.entity_id });
                break;
            case 'document':
                this.downloadDocument(item.entity_id);
                break;
            case 'post':
                this.api.get('posts/' + item.entity_id).subscribe(function (res) {
                    _this.goToPost(res.data);
                });
                break;
            case 'question':
                this.api.get('posts/' + item.entity_id).subscribe(function (res) {
                    _this.goToPost(res.data);
                });
                break;
            case 'comment':
                this.api.get('comment/' + item.entity_id).subscribe(function (res) {
                    _this.navCtrl.push('PostCommentPage', { post: res.data.post });
                });
                break;
        }
    };
    NotificationsPage.prototype.goToPost = function (post) {
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
    NotificationsPage.prototype.deleteNotification = function (id) {
        var _this = this;
        this.api.delete("notifications/" + id).subscribe(function (res) {
            if (res.success) {
                _this.notifications = _this.notifications.filter(function (val) {
                    return val.id !== id;
                });
                _this.flash.push('Уведомление успешно удалено.');
            }
            else {
                _this.flash.push('Ошибка удаления');
            }
        });
    };
    NotificationsPage.prototype.downloadDocument = function (document) {
        this.api.download(this.getDocumentUrl(document));
    };
    NotificationsPage.prototype.getDocumentUrl = function (document) {
        return 'documents/download/' + document;
    };
    return NotificationsPage;
}());
NotificationsPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-notifications',
        templateUrl: 'notifications.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        Events,
        Flash])
], NotificationsPage);
export { NotificationsPage };
//# sourceMappingURL=notifications.js.map