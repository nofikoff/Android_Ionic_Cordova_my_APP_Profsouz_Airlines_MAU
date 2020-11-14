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
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Api, Flash, User } from '../../providers';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
var NewVotePage = NewVotePage_1 = (function () {
    function NewVotePage(navCtrl, api, user, formBuilder, loadingCtrl, plt, flash, navParams) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.api = api;
        this.user = user;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.plt = plt;
        this.flash = flash;
        this.navParams = navParams;
        this.branches = [];
        this.submitted = false;
        this.attachments = [];
        this.info_statuses = [];
        this.files = [];
        this.options = [];
        this.isEdit = false;
        this.apiUrl = 'posts';
        var vote = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;
        this.isEdit = this.navParams.data.hasOwnProperty('post');
        this.apiUrl = vote ? "posts/" + vote.id : "posts";
        this.form = this.formBuilder.group({
            title: new FormControl(vote ? vote.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            branch_id: new FormControl(vote ? vote.branch_id : null, Validators.required),
            type: new FormControl(NewVotePage_1.postType, Validators.required),
            body: new FormControl(vote ? String(vote.body ? vote.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),
            sms_notify: new FormControl(vote ? vote.sms_notify : false),
            expiration_at: new FormControl(vote ? new Date(vote.question.expiration) : null),
            options: this.formBuilder.array(this.options),
            attachments: this.files,
            log_comment: new FormControl(''),
            info_status_id: new FormControl(vote ? vote.info_status_id : ''),
        });
        if (vote) {
            this.attachments = vote.attachments;
            this.api.get('posts/' + vote.id).subscribe(function (res) {
                _this.options = res.data.question.options.map(function (option) {
                    return _this.addOption(option.name);
                });
            });
        }
    }
    NewVotePage.prototype.ngOnInit = function () {
        var _this = this;
        this.getAccessBranches();
        this.user.getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
        if (this.isEdit) {
            this.api.get('posts/info_statuses').subscribe(function (ctx) {
                _this.info_statuses = ctx.data;
            });
        }
    };
    NewVotePage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    NewVotePage.prototype.getAccessBranches = function () {
        var _this = this;
        this.api.get('users/branch/access').subscribe(function (res) {
            _this.branches = res.data;
            _this.setDefaultBranchId();
        });
    };
    NewVotePage.prototype.createOption = function (value) {
        if (value === void 0) { value = ''; }
        return this.formBuilder.group({
            value: value
        });
    };
    NewVotePage.prototype.setDefaultBranchId = function () {
        if (this.branches.length && !this.form.value.branch_id) {
            this.form.controls['branch_id'].setValue(this.branches[0].id);
        }
    };
    NewVotePage.prototype.addOption = function (value) {
        if (value === void 0) { value = ''; }
        this.options = this.form.get('options');
        this.options.push(this.createOption(value));
    };
    NewVotePage.prototype.deleteOption = function (i) {
        this.options = this.form.get('options');
        this.options.removeAt(i);
    };
    NewVotePage.prototype.removeFile = function (fileId) {
        var _this = this;
        this.api.delete('posts/attachment/' + fileId).subscribe(function () {
            _this.attachments = _this.attachments.filter(function (file) {
                return file.id != fileId;
            });
        });
    };
    NewVotePage.prototype.submit = function (status) {
        var _this = this;
        if (status === void 0) { status = 'published'; }
        console.log(this.form.value.options);
        this.submitted = true;
        if (!this.form.valid) {
            this.flash.push('Заполните все поля.');
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Сохраняем голосование..."
        });
        loader.present();
        var data = {
            type: NewVotePage_1.postType,
            status: status,
            title: this.form.value.title,
            branch_id: this.form.value.branch_id,
            body: this.form.value.body,
            log_comment: this.form.value.log_comment,
            info_status_id: this.form.value.info_status_id,
            sms_notify: this.form.value.sms_notify ? 1 : 0,
            options: this.form.value.options.map(function (item) {
                return item.value.length > 0 ? item.value : null;
            }).join(','),
            expiration_at: new Date(this.form.value.expiration_at)
                .toISOString()
                .split('.')[0]
                .replace('T', ' '),
        };
        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.apiUrl, data).subscribe(function (res) {
                if (res.success) {
                    _this.flash.push(status == 'published' ? 'Вы успешно создали голосование' : 'Вы отправили голосование в черновики');
                    _this.navCtrl.push('MorePage');
                }
                _this.submitted = false;
                loader.dismiss();
            }, function () {
                _this.flash.push('Исправьте ошибки в подсвеченных полях');
                _this.submitted = false;
                loader.dismiss();
            });
            return;
        }
        this.api.file(this.apiUrl, Object.assign({
            Authorization: "Bearer " + this._token,
        }, data), 'attachments', this.form.value.attachments[0]).then(function () {
            _this.flash.push(status == 'published' ? 'Вы успешно создали голосование' : 'Вы отправили голосование в черновики');
            _this.navCtrl.push('MorePage');
            _this.submitted = false;
            loader.dismiss();
        }, function () {
            _this.flash.push('Исправьте ошибки в подсвеченных полях');
            _this.submitted = false;
            loader.dismiss();
        });
    };
    return NewVotePage;
}());
NewVotePage.postType = 'question';
NewVotePage = NewVotePage_1 = __decorate([
    IonicPage(),
    Component({
        selector: 'page-new-vote',
        templateUrl: 'new-vote.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        User,
        FormBuilder,
        LoadingController,
        Platform,
        Flash,
        NavParams])
], NewVotePage);
export { NewVotePage };
var NewVotePage_1;
//# sourceMappingURL=new-vote.js.map