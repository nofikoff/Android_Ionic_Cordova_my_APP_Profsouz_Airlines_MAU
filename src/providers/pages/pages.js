var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Api } from '..';
import Config from '../../init';
var Pages = Pages_1 = (function () {
    function Pages(api, url, method, params) {
        if (method === void 0) { method = 'GET'; }
        this.api = api;
        this.url = url;
        this.method = method;
        this.params = params;
        this._data = [];
        this._page = 1;
        this._url = Pages_1._getEndpointByUrl(url);
    }
    Pages.prototype.get = function (merged) {
        var _this = this;
        if (merged === void 0) { merged = true; }
        return new Promise(function (resolve) {
            _this._getRequest().subscribe(function (res) {
                var data = res.data;
                _this._page = res.meta.current_page;
                _this._total = res.meta.last_page;
                _this._url = res.links.next ? Pages_1._getEndpointByUrl(res.links.next) : null;
                _this._data = _this._data.concat(data);
                merged ? resolve(_this._data) : resolve(res.data);
            }, function (err) {
                console.error('ERROR', err);
            });
        });
    };
    Pages.prototype._getRequest = function () {
        var request = this.api.get(this._url, this.params);
        if (this.method == 'POST') {
            request = this.api.post(this._url, this.params);
        }
        return request;
    };
    Pages.prototype.getPagesCount = function () {
        return this._total;
    };
    Pages.prototype.getCurrentPage = function () {
        return this._page;
    };
    Pages.prototype.hasMorePages = function () {
        return this._page !== this._total;
    };
    Pages.prototype.refreshPages = function (url) {
        if (url === void 0) { url = null; }
        this._total = 0;
        this._page = 1;
        this._data = [];
        this._url = url ? url : this.url;
    };
    Pages.prototype.getData = function () {
        return this._data;
    };
    Pages._getEndpointByUrl = function (url) {
        return url.replace(Config.apiUrl + '/', '');
    };
    return Pages;
}());
Pages = Pages_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Api, String, Object, Object])
], Pages);
export { Pages };
var Pages_1;
//# sourceMappingURL=pages.js.map