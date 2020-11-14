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
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, Events, AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { Camera } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { Api, User, Flash } from '../../providers';
import { TranslateService } from "@ngx-translate/core";
var EditProfilePage = (function () {
    function EditProfilePage(navCtrl, navParams, events, api, user, plt, camera, formBuilder, loadingCtrl, translateService, actionSheetCtrl, alertCtrl, flash) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.api = api;
        this.user = user;
        this.plt = plt;
        this.camera = camera;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.translateService = translateService;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.flash = flash;
        this.submitted = false;
        this.cameraConfirmTrans = {
            title: '',
            message: '',
            success: '',
            cancel: ''
        };
    }
    EditProfilePage.prototype.ngOnInit = function () {
        var _this = this;
        this.user.getUser().subscribe(function (user) {
            _this._token = user.hasOwnProperty('access_token') ? user.access_token : '';
        });
        this.user.getProfile().subscribe(function (profile) {
            _this.profile = profile;
            _this.form = _this.formBuilder.group({
                first_name: new FormControl(_this.profile.first_name, Validators.required),
                last_name: new FormControl(_this.profile.last_name, Validators.required),
                phone: new FormControl(_this.profile.phone, Validators.required),
                position: new FormControl(_this.profile.position, Validators.required),
                birthday: new FormControl(_this.profile.birthday, Validators.required),
                password: new FormControl(''),
                password_confirm: new FormControl(''),
            });
        });
        this.initCameraConfirmTrans();
    };
    EditProfilePage.prototype.updateStateProfile = function () {
        this.user.loadState();
    };
    EditProfilePage.prototype.ionViewWillEnter = function () {
        this.initImagePickerTranslate();
    };
    EditProfilePage.prototype.initImagePickerTranslate = function () {
        var _this = this;
        this.translateService.get('IMAGE_PICKER').subscribe(function (value) {
            _this.imagePicker = value;
        });
    };
    EditProfilePage.prototype.initCameraConfirmTrans = function () {
        var _this = this;
        this.translateService.get(['CAMERA_CONFIRM_TITLE', 'CAMERA_CONFIRM_MESSAGE', 'CAMERA_CONFIRM_SUCCESS', 'CAMERA_CONFIRM_CANCEL']).subscribe(function (value) {
            _this.cameraConfirmTrans.title = value['CAMERA_CONFIRM_TITLE'];
            _this.cameraConfirmTrans.message = value['CAMERA_CONFIRM_MESSAGE'];
            _this.cameraConfirmTrans.success = value['CAMERA_CONFIRM_SUCCESS'];
            _this.cameraConfirmTrans.cancel = value['CAMERA_CONFIRM_CANCEL'];
        });
    };
    EditProfilePage.prototype.submit = function () {
        var _this = this;
        this.submitted = true;
        if (!this.form.valid) {
            this.flash.push('Заполните все поля');
            return;
        }
        if (this.profile.no_avatar) {
            this.translateService.get('NEED_UPLOAD_AVATAR').subscribe(function (value) {
                _this.flash.push(value);
            });
            return;
        }
        this.events.publish('loading_start');
        this.api.post('settings/account', this.form.value).subscribe(function (res) {
            _this.flash.push(res.message);
            _this.updateProfile();
            _this.submitted = false;
            _this.events.publish('loading_end');
        }, function () {
            _this.submitted = false;
            _this.events.publish('loading_end');
        });
    };
    EditProfilePage.prototype.getImage = function (source) {
        var _this = this;
        var destination = this.camera.DestinationType.FILE_URI;
        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI;
        }
        var options = {
            quality: 100,
            destinationType: destination,
            sourceType: source,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.saveAvatar(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    EditProfilePage.prototype.saveAvatar = function (imageURI) {
        var _this = this;
        this.events.publish('loading_start');
        this.api.file('settings/account', {
            first_name: this.form.value.first_name,
            last_name: this.form.value.last_name,
            phone: this.form.value.phone,
            Authorization: "Bearer " + this._token
        }, 'image', imageURI).then(function () {
            _this.flash.push('Вы успешно обновили профиль.');
            _this.events.publish('loading_end');
            _this.navCtrl.pop();
            _this.submitted = false;
            _this.updateStateProfile();
        }, function () {
            _this.submitted = false;
            _this.events.publish('loading_end');
        });
    };
    EditProfilePage.prototype.doRefresh = function (refresher) {
        refresher.complete();
    };
    EditProfilePage.prototype.updateProfile = function () {
        this.profile.first_name = this.form.value.first_name;
        this.profile.last_name = this.form.value.last_name;
        this.profile.phone = this.form.value.phone;
        this.profile.position = this.form.value.position;
        this.profile.birthday = this.form.value.birthday;
        this.user.updateProfile(this.profile);
    };
    EditProfilePage.prototype.filterActionSheet = function () {
        var _this = this;
        var buttons = [
            {
                text: this.imagePicker.CAMERA,
                handler: function () {
                    return _this.confirmCamera().then(function (_) {
                        _this.getImage(_this.camera.PictureSourceType.CAMERA);
                    }).catch(function (_) {
                        return false;
                    });
                }
            },
            {
                text: this.imagePicker.GALLERY,
                handler: function () {
                    _this.getImage(_this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            }
        ];
        buttons.push({ text: this.imagePicker.CANCEL, role: 'cancel' });
        var actionSheet = this.actionSheetCtrl.create({
            title: this.imagePicker.TITLE,
            buttons: buttons
        });
        actionSheet.present();
    };
    EditProfilePage.prototype.confirmCamera = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var alert = _this.alertCtrl.create({
                title: _this.cameraConfirmTrans.title,
                message: _this.cameraConfirmTrans.message,
                buttons: [
                    {
                        text: _this.cameraConfirmTrans.cancel,
                        role: 'cancel',
                        handler: function () {
                            reject();
                        }
                    },
                    {
                        text: _this.cameraConfirmTrans.success,
                        handler: function () {
                            resolve();
                        }
                    }
                ]
            });
            alert.present();
        });
    };
    return EditProfilePage;
}());
EditProfilePage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-edit-profile',
        templateUrl: 'edit-profile.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Events,
        Api,
        User,
        Platform,
        Camera,
        FormBuilder,
        LoadingController,
        TranslateService,
        ActionSheetController,
        AlertController,
        Flash])
], EditProfilePage);
export { EditProfilePage };
//# sourceMappingURL=edit-profile.js.map