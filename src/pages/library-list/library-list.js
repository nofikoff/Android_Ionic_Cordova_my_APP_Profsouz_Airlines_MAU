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
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Pages, Api, Flash } from "../../providers";
import { Clipboard } from "@ionic-native/clipboard";
import { TranslateService } from "@ngx-translate/core";
var LibraryListPage = (function () {
    function LibraryListPage(navCtrl, api, navParams, clipboard, translateService, flash, events) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.navParams = navParams;
        this.clipboard = clipboard;
        this.translateService = translateService;
        this.flash = flash;
        this.events = events;
        this.documents = [];
        this.search = '';
        this.loadDocuments();
    }
    LibraryListPage.prototype.loadDocuments = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.navParams.data.hasOwnProperty('branch')) {
                _this.pages = new Pages(_this.api, 'documents/branch/' + _this.navParams.data.branch.alias, 'GET', { search: _this.search });
                _this.branch = _this.navParams.data.branch;
                resolve();
            }
            else {
                _this.pages = new Pages(_this.api, 'documents');
                resolve();
            }
        });
    };
    LibraryListPage.prototype.ngOnInit = function () {
        this.getDocuments();
    };
    LibraryListPage.prototype.searching = function () {
        var _this = this;
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(function () {
            _this.loadDocuments().then(function (_) {
                _this.getDocuments();
            });
        }, 1000);
    };
    LibraryListPage.prototype.doRefresh = function (refresher) {
        this.pages.refreshPages();
        this.documents = [];
        this.getDocuments().then(function () {
            refresher.complete();
        });
    };
    LibraryListPage.prototype.ionViewWillEnter = function () {
        this.refreshDocuments();
    };
    LibraryListPage.prototype.getNextPage = function (infiniteScroll) {
        this.getDocuments().then(function () {
            infiniteScroll.complete();
        });
    };
    LibraryListPage.prototype.getDocuments = function () {
        var _this = this;
        this.events.publish('loading_start');
        return this.pages.get().then(function (data) {
            _this.events.publish('loading_end');
            _this.documents = data;
        }, function (_) {
            _this.events.publish('loading_end');
        });
    };
    LibraryListPage.prototype.hasMorePages = function () {
        return this.pages.hasMorePages();
    };
    LibraryListPage.prototype.refreshDocuments = function () {
        if (this.documents.length !== 0) {
            this.pages.refreshPages();
            this.documents = [];
            this.getDocuments();
        }
    };
    LibraryListPage.prototype.downloadDocument = function (document) {
        this.api.download(this.getDocumentUrl(document));
        // window.open(document.link, '_system');
    };
    LibraryListPage.prototype.startCopyLink = function (document) {
        var _this = this;
        this.clipboard.copy(this.api.getFullUrl(this.getDocumentUrl(document)).replace('/api', ''));
        this.translateService.get('SUCCESS_COPY').subscribe(function (value) {
            _this.flash.push(value);
        });
    };
    LibraryListPage.prototype.getDocumentUrl = function (document) {
        return 'documents/download/' + document;
    };
    LibraryListPage.prototype.openNewLibrary = function () {
        this.navCtrl.push('LibraryAddPage', { branch_id: this.branch.id });
    };
    return LibraryListPage;
}());
LibraryListPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-library-list',
        templateUrl: 'library-list.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        NavParams,
        Clipboard,
        TranslateService,
        Flash,
        Events])
], LibraryListPage);
export { LibraryListPage };
//# sourceMappingURL=library-list.js.map