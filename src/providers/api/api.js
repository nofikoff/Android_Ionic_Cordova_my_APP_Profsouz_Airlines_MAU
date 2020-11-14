var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transfer } from "@ionic-native/transfer";
import Config from "../../init";
import { Observable } from "rxjs/Observable";
import { App } from "ionic-angular";
import { SignupCompletedPage } from "../../pages/signup-completed/signup-completed";
import { InAppBrowser } from "@ionic-native/in-app-browser";
var Api = (function () {
    function Api(http, transfer, app) {
        this.http = http;
        this.transfer = transfer;
        this.app = app;
        this.url = Config.apiUrl;
    }
    Api.prototype.getNavCtrl = function () {
        return this.app.getRootNav();
    };
    Api.prototype.getCurrentPage = function () {
        return this.getNavCtrl().getActive().name;
    };
    Api.prototype.get = function (endpoint, params, reqOpts) {
        var _this = this;
        if (!reqOpts) {
            reqOpts = {
                params: new HttpParams()
            };
        }
        if (params) {
            reqOpts.params = new HttpParams();
            for (var k in params) {
                reqOpts.params = reqOpts.params.set(k, params[k]);
            }
        }
        return this.http.get(this.url + '/' + endpoint, reqOpts).catch(function (err) {
            if (err.status == 403 && err.error.message === "NotConfirmed" && _this.getCurrentPage() !== SignupCompletedPage.name) {
                //this.getNavCtrl().remove(0, this.getNavCtrl().getActive().index);
                _this.getNavCtrl().setRoot('SignupCompletedPage');
            }
            return Observable.throw(err);
        });
    };
    Api.prototype.post = function (endpoint, body, reqOpts) {
        var _this = this;
        console.log('api.post');
        console.log(endpoint);
        console.log(body);
        return this.http.post(this.url + '/' + endpoint, body, reqOpts).catch(function (err) {
            if (err.status == 403 && err.error.message === "NotConfirmed" && _this.getCurrentPage() !== SignupCompletedPage.name) {
                //this.getNavCtrl().remove(0, this.getNavCtrl().getActive().index);
                _this.getNavCtrl().setRoot('SignupCompletedPage');
            }
            return Observable.throw(err);
        });
    };
    Api.prototype.put = function (endpoint, body, reqOpts) {
        return this.http.put(this.url + '/' + endpoint, body, reqOpts);
    };
    Api.prototype.delete = function (endpoint, reqOpts) {
        return this.http.delete(this.url + '/' + endpoint, reqOpts).catch(function (err) {
            return Observable.throw(err);
        });
    };
    Api.prototype.patch = function (endpoint, body, reqOpts) {
        return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
    };
    Api.prototype.file = function (endpoint, data, fileKey, fileUrl) {
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: fileKey,
            fileName: this.getFileName(fileUrl),
            chunkedMode: false,
            params: data,
        };
        console.log('\src\providers\api\api.ts');
        console.log('fileUrl:' + fileUrl);
        console.log('endPoint:' + Config.apiUrl + '/' + endpoint);
        console.log('options' + options);
        return fileTransfer.upload(fileUrl, Config.apiUrl + '/' + endpoint, options, true);
    };
    Api.prototype.multipleFiles = function (endpoint, data, fileKey, files, isNew) {
        var _this = this;
        var currentIndex = 0;
        return new Promise(function (resolve, reject) {
            var __ = function () {
                var file = files[currentIndex];
                console.log('__');
                _this.file(endpoint, data, fileKey, file).then(function (res) {
                    var data = JSON.parse(res.response);
                    if (isNew) {
                        endpoint = endpoint + '/' + data.post_id;
                    }
                    console.log(currentIndex);
                    currentIndex++;
                    if (currentIndex < files.length) {
                        __();
                    }
                    else {
                        resolve();
                    }
                }).catch(function (error) {
                    console.log(error);
                    reject();
                });
            };
            __();
        });
    };
    Api.prototype.download = function (endpoint) {
        this.http.get(this.url + '/' + endpoint).subscribe(function (res) {
            var brows = new InAppBrowser();
            brows.create(res.link, "_system");
        });
    };
    Api.prototype.getFullUrl = function (endpoint) {
        return this.url + '/' + endpoint;
    };
    Api.prototype.getFileName = function (url) {
        var uri = url.split("/").pop();
        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }
        return uri;
    };
    return Api;
}());
Api = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient, Transfer, App])
], Api);
export { Api };
//# sourceMappingURL=api.js.map