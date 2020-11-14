var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";
var Flash = (function () {
    function Flash(http, toastCtrl) {
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.toasts = [];
    }
    Flash.prototype.push = function (msg) {
        var _this = this;
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 6000,
            position: 'top',
            cssClass: 'danger',
            showCloseButton: true
        });
        toast.onDidDismiss(function () {
            _this.toasts.shift();
            if (_this.toasts.length > 0) {
                _this.show();
            }
        });
        this.toasts.push(toast);
        if (this.toasts.length === 1) {
            this.show();
        }
    };
    Flash.prototype.show = function () {
        this.toasts[0].present();
    };
    return Flash;
}());
Flash = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [HttpClient,
        ToastController])
], Flash);
export { Flash };
//# sourceMappingURL=flash.js.map