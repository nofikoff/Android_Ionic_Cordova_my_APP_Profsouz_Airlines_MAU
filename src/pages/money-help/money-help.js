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
import { Api, Flash, User } from "../../providers";
import { Validators, FormBuilder, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
var MoneyHelpPage = (function () {
    function MoneyHelpPage(navCtrl, formBuilder, api, flash, loadingCtrl, user, plt, navParams, translateService) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.api = api;
        this.flash = flash;
        this.loadingCtrl = loadingCtrl;
        this.user = user;
        this.plt = plt;
        this.navParams = navParams;
        this.translateService = translateService;
        this.submited = false;
        this.attachments = [];
        this.finn_types = [];
        this.info_statuses = [];
        this.post = this.navParams.data.hasOwnProperty('post') ? this.navParams.get('post') : false;
        this.url = this.post ? 'posts/' + this.post.id : 'posts';
        this.form = this.formBuilder.group({
            title: new FormControl(this.post ? this.post.title : '', Validators.compose([
                Validators.required,
                Validators.maxLength(255)
            ])),
            info_status_id: new FormControl(this.post ? this.post.info_status_id : ''),
            log_comment: new FormControl(''),
            body: new FormControl(this.post ? String(this.post.body ? this.post.body : '')
                .replace(/<\/?[^>]+>/g, '') : ''),
            pdf_passport_seria: new FormControl(this.post ? this.post.financial_info.pdf_passport_seria : '', Validators.required),
            pdf_passport_code: new FormControl(this.post ? this.post.financial_info.pdf_passport_code : '', Validators.required),
            pdf_extradited: new FormControl(this.post ? this.post.financial_info.pdf_extradited : '', Validators.required),
            pdf_identification: new FormControl(this.post ? this.post.financial_info.pdf_identification : '', Validators.required),
            pdf_card: new FormControl(this.post ? this.post.financial_info.pdf_card : '', Validators.required),
            pdf_bank: new FormControl(this.post ? this.post.financial_info.pdf_bank : '', Validators.required),
            pdf_rr: new FormControl(this.post ? this.post.financial_info.pdf_rr : '', Validators.required),
            pdf_mfo: new FormControl(this.post ? this.post.financial_info.pdf_mfo : '', Validators.required),
            pdf_edrpoy: new FormControl(this.post ? this.post.financial_info.pdf_edrpoy : '', Validators.required),
            attachments: this.attachments
        });
    }
    MoneyHelpPage.prototype.ngOnInit = function () {
        var _this = this;
        this.api.get('financial/types').subscribe(function (ctx) {
            _this.finn_types = ctx.data;
        });
        if (this.post) {
            this.api.get('posts/info_statuses').subscribe(function (ctx) {
                _this.info_statuses = ctx.data;
            });
        }
        this.user.getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
    };
    MoneyHelpPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    MoneyHelpPage.prototype.removeFile = function (fileId) {
        var _this = this;
        this.api.delete('posts/attachment/' + fileId).subscribe(function () {
            _this.post.attachments = _this.post.attachments.filter(function (file) {
                return file.id != fileId;
            });
        });
    };
    MoneyHelpPage.prototype.storeFinnHelp = function () {
        var _this = this;
        this.submited = true;
        if (!this.form.valid) {
            this.flash.push('Заполните все поля!');
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        if (!this.form.value.attachments || (this.form.value.attachments && !this.form.value.attachments.length)) {
            this.api.post(this.url, {
                branch_id: 2,
                importance: 1,
                title: this.form.value.title,
                info_status_id: this.form.value.info_status_id,
                log_comment: this.form.value.log_comment,
                type: 'finn_help',
                status: 'published',
                pdf_rr: this.form.value.pdf_rr,
                pdf_mfo: this.form.value.pdf_mfo,
                pdf_card: this.form.value.pdf_card,
                pdf_bank: this.form.value.pdf_bank,
                pdf_edrpoy: this.form.value.pdf_edrpoy,
                pdf_extradited: this.form.value.pdf_extradited,
                pdf_passport_code: this.form.value.pdf_passport_code,
                pdf_passport_seria: this.form.value.pdf_passport_seria,
                pdf_identification: this.form.value.pdf_identification,
            }).subscribe(function () {
                _this.translateService.get(_this.post ? 'SUCCESS_UPDATE_FINN_HELP' : 'SUCCESS_CREATE_FINN_HELP').subscribe(function (value) {
                    _this.flash.push(value);
                });
                loader.dismiss();
                _this.navCtrl.pop();
                _this.submited = false;
            }, function () {
                _this.flash.push('Ошибка! Повторите попытку!');
                loader.dismiss();
            });
            return;
        }
        this.api.multipleFiles(this.url, {
            branch_id: 2,
            importance: 1,
            title: this.form.value.title,
            info_status_id: this.form.value.info_status_id,
            type: 'finn_help',
            status: 'published',
            pdf_rr: this.form.value.pdf_rr,
            pdf_mfo: this.form.value.pdf_mfo,
            pdf_card: this.form.value.pdf_card,
            pdf_bank: this.form.value.pdf_bank,
            pdf_edrpoy: this.form.value.pdf_edrpoy,
            pdf_extradited: this.form.value.pdf_extradited,
            pdf_passport_code: this.form.value.pdf_passport_code,
            pdf_passport_seria: this.form.value.pdf_passport_seria,
            pdf_identification: this.form.value.pdf_identification,
            Authorization: "Bearer " + this._token
        }, 'attachments', this.form.value.attachments, !this.post).then(function () {
            _this.translateService.get(_this.post ? 'SUCCESS_UPDATE_FINN_HELP' : 'SUCCESS_CREATE_FINN_HELP').subscribe(function (value) {
                _this.flash.push(value);
            });
            loader.dismiss();
            _this.navCtrl.pop();
            _this.submited = false;
        }, function (err) {
            console.log(err);
            _this.flash.push('Ошибка! Повторите попытку!');
            loader.dismiss();
        });
    };
    return MoneyHelpPage;
}());
MoneyHelpPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-money-help',
        templateUrl: 'money-help.html',
    }),
    __metadata("design:paramtypes", [NavController,
        FormBuilder,
        Api,
        Flash,
        LoadingController,
        User,
        Platform,
        NavParams,
        TranslateService])
], MoneyHelpPage);
export { MoneyHelpPage };
//# sourceMappingURL=money-help.js.map