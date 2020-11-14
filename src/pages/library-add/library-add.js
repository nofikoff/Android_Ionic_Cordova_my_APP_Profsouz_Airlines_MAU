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
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Api, Flash, User } from "../../providers";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { IOSFilePicker } from "@ionic-native/file-picker";
/**
 * Generated class for the LibraryAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LibraryAddPage = LibraryAddPage_1 = (function () {
    function LibraryAddPage(navCtrl, api, flash, navParams, formBuilder, camera, loadingCtrl, toastCtrl, plt, translateService, user, filePicker) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.plt = plt;
        this.translateService = translateService;
        this.user = user;
        this.filePicker = filePicker;
        this.categories = [];
        this.submited = false;
        this.notify = false;
        this.importance = false;
        var defaultBranchId = this.navParams.data.hasOwnProperty('branch_id') ? this.navParams.get('branch_id') : '';
        this.form = this.formBuilder.group({
            category: new FormControl(defaultBranchId, Validators.required),
            description: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(255)
            ])),
        });
    }
    LibraryAddPage.prototype.getFile = function () {
        var _this = this;
        if (this.plt.is('ios')) {
            this.filePicker.pickFile()
                .then(function (uri) { return _this.setFile(uri); })
                .catch(function (err) { return console.log('Error', err); });
        }
        else {
            this.getDefaultFile();
        }
    };
    LibraryAddPage.prototype.getDefaultFile = function () {
        var _this = this;
        var destination = this.camera.DestinationType.FILE_URI;
        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI;
        }
        var options = {
            quality: 100,
            destinationType: destination,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.ALLMEDIA
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.setFile(imageData);
        }, function (err) {
            console.log(err);
            _this.presentToast(err);
        });
    };
    LibraryAddPage.prototype.setDefaultCategory = function () {
        if (this.categories.length && !this.form.value.category) {
            this.form.controls['category'].setValue(this.categories[0].id);
        }
    };
    LibraryAddPage.prototype.setFile = function (imageSoruce) {
        var _this = this;
        var uri = imageSoruce.split("/").pop();
        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }
        var extension = uri.split('.').pop();
        if (extension !== 'pdf' && extension !== 'docx') {
            this.translateService.get('FILE_LIBRARY_AVAILABLE_EXTENSION').subscribe(function (value) {
                _this.flash.push(value);
            });
        }
        else {
            this.imageURI = imageSoruce;
        }
    };
    LibraryAddPage.prototype.uploadFile = function () {
        var _this = this;
        this.submited = true;
        if (!this.form.valid || !this.imageURI) {
            this.flash.push('Заполните все поля!');
            return;
        }
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        if (!this.imageURI) {
            this.api.post('documents', {
                status: 'published',
                notify: this.notify,
                branch_id: this.form.value.category,
                importance: this.importance,
                description: this.form.value.description
            }).subscribe(function () {
                loader.dismiss();
                _this.navCtrl.push('LibraryListPage');
            }, function () {
                loader.dismiss();
                _this.flash.push('Ошибка!Повторите попытку позже!');
            });
            return;
        }
        this.api.file('documents', {
            status: 'published',
            notify: this.notify ? "true" : "false",
            branch_id: this.form.value.category,
            importance: this.importance ? "true" : "false",
            description: this.form.value.description,
            Authorization: "Bearer " + this._token
        }, 'file', this.imageURI).then(function () {
            loader.dismiss();
            _this.navCtrl.push('LibraryListPage');
        }, function (err) {
            console.log(err);
            loader.dismiss();
            _this.flash.push('Ошибка!Повторите попытку позже!');
        });
    };
    LibraryAddPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 6000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    LibraryAddPage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    LibraryAddPage.prototype.ngOnInit = function () {
        var _this = this;
        this.api.get(LibraryAddPage_1.branchUrl).subscribe(function (ctx) {
            _this.categories = ctx.data;
            _this.setDefaultCategory();
        });
        this.user.getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
    };
    LibraryAddPage.prototype.resetFile = function () {
        this.imageURI = '';
    };
    LibraryAddPage.prototype.getFileName = function () {
        var uri = this.imageURI.split("/").pop();
        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }
        return uri;
    };
    return LibraryAddPage;
}());
LibraryAddPage.branchUrl = "documents/branch";
LibraryAddPage = LibraryAddPage_1 = __decorate([
    IonicPage(),
    Component({
        selector: 'page-library-add',
        templateUrl: 'library-add.html',
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        NavParams,
        FormBuilder,
        Camera,
        LoadingController,
        ToastController,
        Platform,
        TranslateService,
        User,
        IOSFilePicker])
], LibraryAddPage);
export { LibraryAddPage };
var LibraryAddPage_1;
//# sourceMappingURL=library-add.js.map