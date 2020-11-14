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
import { ActionSheetController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Api, Flash, User } from '../../providers';
import { Platform } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
var NewCommentPage = (function () {
    function NewCommentPage(navCtrl, api, flash, user, formBuilder, loadingCtrl, actionSheetCtrl, translateService, plt, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.user = user;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.translateService = translateService;
        this.plt = plt;
        this.navParams = navParams;
        this.attachments = [];
        this.errors = {};
        var parent = this.navParams.get('parent_id');
        this.post_id = this.navParams.get('post_id');
        var comment = this.navParams.data.hasOwnProperty('comment') ? this.navParams.get('comment') : false;
        this.api_url = comment ? "posts/" + this.post_id + "/comments/" + comment.id : "posts/" + this.post_id + "/comments";
        this.form = this.formBuilder.group({
            text: new FormControl(comment.text, Validators.compose([
                Validators.required,
                Validators.maxLength(3000),
            ])),
            parent_id: new FormControl(parent ? parent : 0, Validators.required),
            attachments: this.attachments
        });
    }
    NewCommentPage.prototype.ngOnInit = function () {
        var _this = this;
        this.user.getUser().subscribe(function (user) {
            _this._user = user;
        });
        this.user.getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
    };
    NewCommentPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    NewCommentPage.prototype.submit = function () {
        var _this = this;
        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.api_url, {
                text: this.form.value.text,
                parent_id: this.form.value.parent_id,
                Authorization: "Bearer " + this._token
            }).subscribe(function () {
                _this.flash.push('Вы успешно добавили комментарий');
                loader.dismiss();
                _this.navCtrl.pop();
            }, function (err) {
                _this.errors = err.error.errors;
                for (var err_1 in _this.errors) {
                    if (_this.errors.hasOwnProperty(err_1)) {
                        _this.flash.push(_this.errors[err_1]);
                    }
                }
                loader.dismiss();
            });
            return;
        }
        this.api.file(this.api_url, {
            text: this.form.value.text,
            parent_id: this.form.value.parent_id,
            Authorization: "Bearer " + this._token
        }, 'image', this.form.value.attachments[0]).then(function () {
            _this.flash.push('Вы успешно добавили комментарий');
            loader.dismiss();
            _this.navCtrl.pop();
        }, function (err) {
            _this.errors = err.error.errors;
            for (var err_2 in _this.errors) {
                if (_this.errors.hasOwnProperty(err_2)) {
                    _this.flash.push(_this.errors[err_2]);
                }
            }
            loader.dismiss();
        });
    };
    NewCommentPage.prototype.isError = function (name) {
        return this.errors.hasOwnProperty(name);
    };
    return NewCommentPage;
}());
NewCommentPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-new-comment',
        templateUrl: 'new-comment.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        User,
        FormBuilder,
        LoadingController,
        ActionSheetController,
        TranslateService,
        Platform,
        NavParams])
], NewCommentPage);
export { NewCommentPage };
//# sourceMappingURL=new-comment.js.map