var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
var VoteResultPage = (function () {
    function VoteResultPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.post = null;
        this.post = navParams.get('post');
    }
    VoteResultPage.prototype.ngOnInit = function () {
        var _this = this;
        var options = this.post.question.options;
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
    VoteResultPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    VoteResultPage.prototype.randomInt = function (min, max) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 255; }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    VoteResultPage.prototype.winnerName = function () {
        var _this = this;
        var option = this.post.question.options.find(function (v) {
            return v.id === _this.post.question.winner_id;
        });
        return option ? option.name : '';
    };
    return VoteResultPage;
}());
__decorate([
    ViewChild('barCanvas'),
    __metadata("design:type", Object)
], VoteResultPage.prototype, "barCanvas", void 0);
VoteResultPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-vote-result',
        templateUrl: 'vote-result.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], VoteResultPage);
export { VoteResultPage };
//# sourceMappingURL=vote-result.js.map