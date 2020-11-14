var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Injector } from '@angular/core';
import Centrifuge from 'centrifuge';
import { Api, User, Flash } from '..';
import SockJS from 'sockjs-client';
import Config from "../../init";
/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
var Centrifugo = (function () {
    function Centrifugo(user, api, inj, flash) {
        var _this = this;
        this.user = user;
        this.api = api;
        this.inj = inj;
        this.flash = flash;
        this.inj.get(User).getUser().subscribe(function (user) {
            if (user.hasOwnProperty('access_token')) {
                _this.api.get('centrifuge').subscribe(function (res) {
                    _this.connect(res.user, res.timestamp, res.token);
                });
            }
        });
    }
    Centrifugo.prototype.connect = function (user, timestamp, token) {
        this.centrifuge = new Centrifuge({
            url: Config.wsUrl,
            user: user,
            timestamp: timestamp,
            token: token,
            sockJS: SockJS,
        });
        this.centrifuge.connect();
        var _self = this;
        this.centrifuge.subscribe("user_" + user, function (message) {
            _self.flash.push(message.data.message);
        });
    };
    return Centrifugo;
}());
Centrifugo = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [User, Api, Injector, Flash])
], Centrifugo);
export { Centrifugo };
//# sourceMappingURL=centrifugo.js.map