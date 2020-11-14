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
import { Api, Flash } from "../../providers";
import { ActionSheetController, Events } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
/**
 * Generated class for the SystemPostsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var SystemPostsComponent = (function () {
    function SystemPostsComponent(events, api, flash, translate, actionSheetCtrl) {
        this.events = events;
        this.api = api;
        this.flash = flash;
        this.translate = translate;
        this.actionSheetCtrl = actionSheetCtrl;
        this.posts = [];
        this.load();
    }
    SystemPostsComponent.prototype.feedActionSheet = function (id) {
        var _this = this;
        this.translate.get(['WHAT_DO_IN_POST', 'DELETE', 'CANCEL']).subscribe(function (values) {
            var actionSheet = _this.actionSheetCtrl.create({
                title: values['WHAT_DO_IN_POST'],
                buttons: [
                    {
                        text: values['DELETE'],
                        handler: function () {
                            _this.destroy(id);
                        }
                    },
                    {
                        text: values['CANCEL'],
                        role: 'cancel',
                        handler: function () {
                            return;
                        }
                    }
                ]
            });
            actionSheet.present();
        });
    };
    SystemPostsComponent.prototype.load = function () {
        var _this = this;
        this.events.publish('loading_start');
        this.api.get('system-posts').subscribe(function (res) {
            _this.posts = res.data;
            _this.events.publish('loading_end');
        }, function () {
            _this.events.publish('loading_end');
        });
    };
    SystemPostsComponent.prototype.destroy = function (id) {
        var _this = this;
        this.events.publish('loading_start');
        this.api.delete("system-posts/" + id).subscribe(function () {
            _this.events.publish('loading_end');
            _this.successDestroy();
            _this.load();
        }, function () {
            _this.events.publish('loading_end');
        });
    };
    SystemPostsComponent.prototype.successDestroy = function () {
        var _this = this;
        console.log('destroy');
        this.translate.get('SUCCESSFULLY_DELETED').subscribe(function (value) {
            _this.flash.push(value);
        });
    };
    return SystemPostsComponent;
}());
SystemPostsComponent = __decorate([
    Component({
        selector: 'system-posts',
        templateUrl: 'system-posts.html'
    }),
    __metadata("design:paramtypes", [Events,
        Api,
        Flash,
        TranslateService,
        ActionSheetController])
], SystemPostsComponent);
export { SystemPostsComponent };
//# sourceMappingURL=system-posts.js.map