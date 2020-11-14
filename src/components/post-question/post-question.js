var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild } from '@angular/core';
import { ActionSheetController, Events, NavController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { Flash } from "../../providers/flash/flash";
import { Clipboard } from "@ionic-native/clipboard";
import { Chart } from 'chart.js';
var PostQuestionComponent = (function () {
    function PostQuestionComponent(navCtrl, api, flash, clipboard, events, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.events = events;
        this.actionSheetCtrl = actionSheetCtrl;
    }
    PostQuestionComponent.prototype.ngAfterViewInit = function () {
        if (this.voted()) {
            this.initBar();
        }
    };
    PostQuestionComponent.prototype.initBar = function () {
        var _this = this;
        var options = this.item.question.options;
        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: options.map(function (v) {
                    return v.name;
                }),
                datasets: [{
                        data: options.map(function (v) {
                            return v.votes_count;
                        }),
                        backgroundColor: options.map(function () {
                            return "rgba(" + _this.randomInt() + ", " + _this.randomInt() + ", " + _this.randomInt() + ", 1)";
                        }),
                        borderColor: options.map(function () {
                            return "rgba(" + _this.randomInt() + ", " + _this.randomInt() + ", " + _this.randomInt() + ", 1)";
                        }),
                        borderWidth: 1
                    }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) { if (Number.isInteger(value)) {
                                    return value;
                                } }
                            }
                        }]
                }
            }
        });
    };
    PostQuestionComponent.prototype.feedActionSheet = function (post) {
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
    PostQuestionComponent.prototype.deletePost = function (post) {
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
    PostQuestionComponent.prototype.editPost = function (post) {
        this.navCtrl.push('NewVotePage', { post: post });
    };
    PostQuestionComponent.prototype.copyLink = function (post) {
        this.clipboard.copy(post.link);
    };
    PostQuestionComponent.prototype.toPost = function (post) {
        var page = 'VotePage', question = post.question;
        if (question.is_expired && question.can_set_winner && !question.winner_id) {
            page = 'VotePage';
        }
        else if (!question.user_option_id && !question.is_expired) {
            page = 'VotePage';
        }
        else {
            page = 'VoteResultPage';
        }
        this.navCtrl.push(page, { post: post });
    };
    PostQuestionComponent.prototype.optionName = function (option) {
        return option.name + " (" + option.votes_count + ")";
    };
    PostQuestionComponent.prototype.setWinner = function (option) {
        var _this = this;
        this.api.post("posts/question/vote/action", {
            post_id: this.item.id,
            option_id: option.id
        }).subscribe(function (res) {
            if (res.success) {
                _this.flash.push('Победитель выбран');
                _this.navCtrl.push('FeedPage');
            }
        }, function () {
            _this.navCtrl.push('Ошибка выбора победителя, попробуйте ещё.');
        });
    };
    PostQuestionComponent.prototype.randomInt = function (min, max) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 255; }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    PostQuestionComponent.prototype.vote = function () {
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
    PostQuestionComponent.prototype.canVote = function () {
        return !this.item.question.user_option_id && !this.item.question.is_expired;
    };
    PostQuestionComponent.prototype.voted = function () {
        return this.item.question.winner_id ||
            this.item.question.is_expired ||
            this.item.question.user_option_id;
    };
    PostQuestionComponent.prototype.winnerName = function () {
        var _this = this;
        var option = this.item.question.options.find(function (v) {
            return v.id === _this.item.question.winner_id;
        });
        return option ? option.name : '';
    };
    PostQuestionComponent.prototype.toProfile = function (post) {
        this.navCtrl.push('ProfilePage', { user: post.user_id });
    };
    return PostQuestionComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], PostQuestionComponent.prototype, "item", void 0);
__decorate([
    ViewChild('barCanvas'),
    __metadata("design:type", Object)
], PostQuestionComponent.prototype, "barCanvas", void 0);
PostQuestionComponent = __decorate([
    Component({
        selector: 'post-question',
        templateUrl: 'post-question.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        Clipboard,
        Events,
        ActionSheetController])
], PostQuestionComponent);
export { PostQuestionComponent };
//# sourceMappingURL=post-question.js.map