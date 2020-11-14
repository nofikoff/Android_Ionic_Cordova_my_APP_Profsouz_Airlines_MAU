var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, forwardRef } from '@angular/core';
import { Camera } from "@ionic-native/camera";
import { ActionSheetController, AlertController, Platform } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * Generated class for the FilePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var FilePickerComponent = FilePickerComponent_1 = (function () {
    function FilePickerComponent(camera, plt, actionSheetCtrl, translateService, alertCtrl) {
        this.camera = camera;
        this.plt = plt;
        this.actionSheetCtrl = actionSheetCtrl;
        this.translateService = translateService;
        this.alertCtrl = alertCtrl;
        this.propagateChange = function () {
        };
        this.onTouched = function () {
        };
        this.cameraConfirmTrans = {
            title: '',
            message: '',
            success: '',
            cancel: ''
        };
        this._files = [];
        this.onlyImage = false;
        this.multiple = true;
        this.initImagePickerTranslate();
        this.initCameraConfirmTrans();
    }
    FilePickerComponent.prototype.writeValue = function (value) {
        if (value) {
            this._files = value;
        }
    };
    FilePickerComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    FilePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    FilePickerComponent.prototype.setDisabledState = function () {
    };
    ;
    FilePickerComponent.prototype.initCameraConfirmTrans = function () {
        var _this = this;
        this.translateService.get(['CAMERA_CONFIRM_TITLE', 'CAMERA_CONFIRM_MESSAGE', 'CAMERA_CONFIRM_SUCCESS', 'CAMERA_CONFIRM_CANCEL']).subscribe(function (value) {
            _this.cameraConfirmTrans.title = value['CAMERA_CONFIRM_TITLE'];
            _this.cameraConfirmTrans.message = value['CAMERA_CONFIRM_MESSAGE'];
            _this.cameraConfirmTrans.success = value['CAMERA_CONFIRM_SUCCESS'];
            _this.cameraConfirmTrans.cancel = value['CAMERA_CONFIRM_CANCEL'];
        });
    };
    FilePickerComponent.prototype.initImagePickerTranslate = function () {
        var _this = this;
        this.translateService.get('IMAGE_PICKER').subscribe(function (value) {
            _this.imagePicker = value;
        });
    };
    FilePickerComponent.prototype.addFile = function (url) {
        this._files.push(url);
        this.propagateChange(this._files);
    };
    FilePickerComponent.prototype.removeFile = function (index) {
        this._files.splice(index, 1);
        this.propagateChange(this._files);
    };
    FilePickerComponent.prototype.getFile = function (source) {
        var _this = this;
        var destination = this.camera.DestinationType.FILE_URI;
        if (this.plt.is('ios')) {
            destination = this.camera.DestinationType.NATIVE_URI;
        }
        var options = {
            quality: 100,
            destinationType: destination,
            sourceType: source,
            mediaType: this.onlyImage ? this.camera.MediaType.PICTURE : this.camera.MediaType.ALLMEDIA
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.addFile(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    FilePickerComponent.prototype.filterActionSheet = function () {
        var _this = this;
        if (!this.onlyImage) {
            this.getFile(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
        else {
            var buttons = [
                {
                    text: this.imagePicker.CAMERA,
                    handler: function () {
                        return _this.confirmCamera().then(function (_) {
                            _this.getFile(_this.camera.PictureSourceType.CAMERA);
                        }).catch(function (_) {
                            return false;
                        });
                    }
                },
                {
                    text: this.imagePicker.GALLERY,
                    handler: function () {
                        _this.getFile(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }
            ];
            buttons.push({ text: this.imagePicker.CANCEL, role: 'cancel' });
            var actionSheet = this.actionSheetCtrl.create({
                title: this.imagePicker.TITLE,
                buttons: buttons
            });
            actionSheet.present();
        }
    };
    FilePickerComponent.prototype.confirmCamera = function () {
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
    FilePickerComponent.prototype.getFileName = function (url) {
        var uri = url.split("/").pop();
        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }
        return uri;
    };
    return FilePickerComponent;
}());
__decorate([
    Input('files'),
    __metadata("design:type", Object)
], FilePickerComponent.prototype, "_files", void 0);
__decorate([
    Input('onlyImage'),
    __metadata("design:type", Boolean)
], FilePickerComponent.prototype, "onlyImage", void 0);
__decorate([
    Input('multiple'),
    __metadata("design:type", Boolean)
], FilePickerComponent.prototype, "multiple", void 0);
FilePickerComponent = FilePickerComponent_1 = __decorate([
    Component({
        selector: 'file-picker',
        templateUrl: 'file-picker.html',
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(function () { return FilePickerComponent_1; }), multi: true }
        ]
    }),
    __metadata("design:paramtypes", [Camera,
        Platform,
        ActionSheetController,
        TranslateService,
        AlertController])
], FilePickerComponent);
export { FilePickerComponent };
var FilePickerComponent_1;
//# sourceMappingURL=file-picker.js.map