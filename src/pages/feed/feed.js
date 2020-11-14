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
import { IonicPage, NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { Clipboard } from "@ionic-native/clipboard";
import { Api, Flash, Pages } from "../../providers";
var FeedPage = (function () {
    function FeedPage(navCtrl, navParams, api, flash, clipboard, events, actionSheetCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.events = events;
        this.actionSheetCtrl = actionSheetCtrl;
        this.users = [];
        this.branches = [];
        this.posts = [];
        this.branch = null;
        this.pages = new Pages(api, 'posts');
        this.events.subscribe('posts:delete', function (id) {
            _this.posts = _this.posts.filter(function (val) {
                return val.id !== id;
            });
        });
    }
    FeedPage.prototype.ngOnInit = function () {
        this.getBranches();
    };
    FeedPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.search = document.getElementById('search-panel').querySelector('input');
        this.search.addEventListener('blur', function () {
            _this.toggleSearch();
        });
        this.search.addEventListener('input', function () {
            if (_this.search.value.length) {
                _this.api.get("search?search=" + _this.search.value).subscribe(function (res) {
                    _this.posts = res.data;
                });
            }
            else {
                _this.refreshPosts();
            }
        });
        this.events.subscribe('BRANCHES:UPDATE', function (_) {
            _this.getBranches();
        });
    };
    FeedPage.prototype.ionViewWillEnter = function () {
        this.branch = null;
        this.users = [];
        this.refreshPosts(null, true);
    };
    FeedPage.prototype.doRefresh = function (refresher) {
        if (this.search.value.length) {
            refresher.complete();
            return;
        }
        this.pages.refreshPages();
        this.posts = [];
        this.getPosts().then(function () {
            refresher.complete();
        });
    };
    FeedPage.prototype.getNextPage = function (infiniteScroll) {
        if (this.search.value.length) {
            infiniteScroll.complete();
            return;
        }
        this.getPosts().then(function () {
            infiniteScroll.complete();
        });
    };
    FeedPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    FeedPage.prototype.refreshPosts = function (url, forced) {
        var _this = this;
        if (url === void 0) { url = null; }
        if (forced === void 0) { forced = false; }
        if (this.posts.length || forced) {
            this.pages.refreshPages(url);
            this.posts = [];
            this.getPosts();
        }
        if (this.branch !== null) {
            this.api.get('users/branch/' + this.branch.alias).subscribe(function (ctx) {
                _this.users = ctx.data;
            });
        }
        else {
            this.users = [];
        }
    };
    FeedPage.prototype.getPosts = function () {
        var _this = this;
        return this.pages.get().then(function (data) {
            _this.posts = data;
        });
    };
    FeedPage.prototype.getBranches = function () {
        var _this = this;
        this.api.get('posts/branch').subscribe(function (res) {
            _this.branches = res.data;
        });
    };
    FeedPage.prototype.openPage = function (name, data) {
        this.navCtrl.push(name, data);
    };
    FeedPage.prototype.toggleSearch = function () {
        var searchPanel = document.getElementById('search-panel');
        var panelActive = searchPanel.classList.contains('active');
        if (panelActive) {
            this.changeSearch(false);
            searchPanel.classList.remove('active');
        }
        else {
            this.changeSearch(true);
            searchPanel.classList.add('active');
            searchPanel.querySelector('input').focus();
        }
    };
    FeedPage.prototype.changeSearch = function (disable) {
        Array.from(document.getElementsByClassName('search-hide')).forEach(function (v) {
            v.hidden = disable;
        });
    };
    FeedPage.prototype.filterActionSheet = function () {
        var _this = this;
        var buttons = this.branches.map(function (value) {
            var text = value.none_read_posts_count ? value.name + " (" + value.none_read_posts_count + ")" : value.name;
            return {
                text: text,
                handler: function () {
                    _this.branch = value;
                    _this.refreshPosts("posts/branch/" + value.alias);
                }
            };
        });
        buttons.push({ text: 'Отменить', role: 'cancel' });
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Выберите ветку для отображения',
            buttons: buttons
        });
        actionSheet.present();
    };
    return FeedPage;
}());
FeedPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-feed',
        templateUrl: 'feed.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        Flash,
        Clipboard,
        Events,
        ActionSheetController])
], FeedPage);
export { FeedPage };
//# sourceMappingURL=feed.js.map