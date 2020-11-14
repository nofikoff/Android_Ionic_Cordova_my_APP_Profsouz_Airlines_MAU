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
import { ActionSheetController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { Flash, Api, User } from "../../providers";
import { TranslateService } from "@ngx-translate/core";
var NewPostPage = NewPostPage_1 = (function () {
    function NewPostPage(navCtrl, api, flash, user, formBuilder, loadingCtrl, translateService, plt, actionSheetCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.user = user;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.translateService = translateService;
        this.plt = plt;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.attachments = [];
        this.info_statuses = [];
        this.branches = [];
        this.submitted = false;
        var post = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;
        this.post = post;
        this.apiUrl = post ? "posts/" + post.id : "posts";
        this.form = this.formBuilder.group({
            title: new FormControl(post ? post.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            branch_id: new FormControl(post ? post.branch_id : null, Validators.required),
            type: new FormControl(NewPostPage_1.postType, Validators.required),
            body: new FormControl(post ? String(post.body ? post.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),
            is_commented: new FormControl(post ? post.is_commented : true),
            sms_notify: new FormControl(post ? post.sms_notify : false),
            log_comment: new FormControl(''),
            info_status_id: new FormControl(post ? post.info_status_id : ''),
            attachments: this.attachments
        });
    }
    NewPostPage.prototype.ngOnInit = function () {
        var _this = this;
        this.user.getUser().subscribe(function (user) {
            _this._user = user;
        });
        if (this.post) {
            this.api.get('posts/info_statuses').subscribe(function (ctx) {
                _this.info_statuses = ctx.data;
            });
        }
        this.getAccessBranches();
    };
    NewPostPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    NewPostPage.prototype.removeFile = function (fileId) {
        var _this = this;
        this.api.delete('posts/attachment/' + fileId).subscribe(function () {
            _this.post.attachments = _this.post.attachments.filter(function (file) {
                return file.id != fileId;
            });
        });
    };
    NewPostPage.prototype.getAccessBranches = function () {
        var _this = this;
        this.api.get('users/branch/access').subscribe(function (res) {
            _this.branches = res.data;
            _this.setDefaultBranchId();
        });
    };
    NewPostPage.prototype.setDefaultBranchId = function () {
        if (this.branches.length && !this.form.value.branch_id) {
            this.form.controls['branch_id'].setValue(this.branches[0].id);
        }
    };
    NewPostPage.prototype.submit = function (status) {
        var _this = this;
        if (status === void 0) { status = 'published'; }
        this.submitted = true;
        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.apiUrl, Object.assign({
                type: NewPostPage_1.postType,
                status: status
            }, this.form.value)).subscribe(function (res) {
                if (res.success) {
                    _this.flash.push('Вы успешно создали пост.');
                    _this.navCtrl.pop();
                }
                _this.submitted = false;
                loader.dismiss();
            }, function () {
                _this.flash.push('Ошибка создания поста.');
                _this.submitted = false;
                loader.dismiss();
            });
            return;
        }
        var data = {
            type: NewPostPage_1.postType,
            status: status,
            title: this.form.value.title,
            branch_id: this.form.value.branch_id,
            body: this.form.value.body,
            log_comment: this.form.value.log_comment,
            info_status_id: this.form.value.info_status_id,
            Authorization: "Bearer " + this._user.access_token,
            is_commented: this.form.value.is_commented ? 1 : 0,
            sms_notify: this.form.value.sms_notify ? 1 : 0,
        };
        this.api.multipleFiles(this.apiUrl, data, 'attachments', this.form.value.attachments, !this.post).then(function () {
            _this.flash.push('Вы успешно создали пост.');
            _this.navCtrl.pop();
            _this.submitted = false;
            loader.dismiss();
        }, function () {
            _this.submitted = false;
            loader.dismiss();
        });
    };
    return NewPostPage;
}());
NewPostPage.postType = 'default';
NewPostPage = NewPostPage_1 = __decorate([
    IonicPage(),
    Component({
        selector: 'page-new-post',
        templateUrl: 'new-post.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        User,
        FormBuilder,
        LoadingController,
        TranslateService,
        Platform,
        ActionSheetController,
        NavParams])
], NewPostPage);
export { NewPostPage };
var NewPostPage_1;
//# sourceMappingURL=new-post.js.map