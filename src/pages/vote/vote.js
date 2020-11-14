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
import { Api, Flash } from '../../providers';
var VotePage = (function () {
    function VotePage(navCtrl, api, flash, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.navParams = navParams;
        this.post = null;
        this.post = navParams.get('post');
        this.selected = this.post.question.user_option_id;
    }
    VotePage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    VotePage.prototype.vote = function () {
        var _this = this;
        if (!this.selected) {
            return;
        }
        this.api.post('posts/question/vote', { question_option_id: this.selected })
            .subscribe(function (res) {
            if (res.success) {
                _this.flash.push('Вы успешно проголосовали.');
                _this.navCtrl.push('FeedPage');
            }
        }, function (err) {
            console.log(err);
        });
    };
    VotePage.prototype.option = function (option) {
        return option.name + " (" + option.votes_count + ")";
    };
    VotePage.prototype.setWinner = function (option) {
        var _this = this;
        this.api.post("posts/question/vote/action", {
            post_id: this.post.id,
            option_id: option.id
        }).subscribe(function (res) {
            if (res.success) {
                _this.flash.push('Победитель выбран');
                _this.navCtrl.pop();
            }
        }, function () {
            _this.navCtrl.push('Ошибка выбора победителя, попробуйте ещё.');
        });
    };
    VotePage.prototype.goHistory = function () {
        this.navCtrl.push('PostHistoryPage', { post: this.post });
    };
    VotePage.prototype.downloadAttachment = function (fileUrl) {
        this.api.download('posts/attachment/' + fileUrl);
    };
    return VotePage;
}());
VotePage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-vote',
        templateUrl: 'vote.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        NavParams])
], VotePage);
export { VotePage };
//# sourceMappingURL=vote.js.map