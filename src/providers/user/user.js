var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Api } from '../';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from "rxjs";
import { Events } from "ionic-angular";
var User = (function () {
    function User(api, storage, events) {
        this.api = api;
        this.storage = storage;
        this.events = events;
        this.profileState = new BehaviorSubject({});
        this.userState = new BehaviorSubject({});
    }
    User.prototype.ngOnDestroy = function () {
        this.saveState();
    };
    User.prototype.getProfile = function () {
        return this.profileState.asObservable();
    };
    User.prototype.getUser = function () {
        return this.userState.asObservable();
    };
    User.prototype.updateUser = function (user) {
        this._user = user;
        this.userState.next(Object.assign({}, user));
        this.storage.set('user', this._user);
    };
    User.prototype.updateProfile = function (profile) {
        this._profile = profile;
        this.profileState.next(Object.assign({}, profile));
    };
    User.prototype.login = function (accountInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.api.post('login', accountInfo).subscribe(function (res) {
                _this._loggedIn(res);
                resolve(res);
            }, function (err) {
                reject(err);
                console.error('ERROR', err);
            });
        });
    };
    User.prototype.signup = function (accountInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.api.post('register', accountInfo).subscribe(function (res) {
                _this._loggedIn(res);
                resolve(res);
            }, function (err) {
                console.error('ERROR', err);
                reject(err);
            });
        });
    };
    User.prototype.logout = function () {
        this.storage.set('user', null);
        this._user = null;
        this._profile = null;
    };
    User.prototype.updateState = function () {
        return Promise.all([
            this._fetchProfile()
        ]);
    };
    User.prototype.getStateUser = function () {
        return this.storage.get('user').then(function (user) { return user; });
    };
    User.prototype.saveState = function () {
        this.storage.set('user', this._user);
        this.events.publish('login');
    };
    User.prototype.loadState = function () {
        var _this = this;
        return Promise.all([
            this._loadUser().then(function () {
                _this._fetchProfile();
            })
        ]);
    };
    User.prototype.auth = function () {
        return this.api.get('auth');
    };
    User.prototype._loggedIn = function (resp) {
        this._initUser(resp);
        this._fetchProfile();
    };
    User.prototype._fetchProfile = function () {
        var _this = this;
        return this.api.get('users').subscribe(function (res) {
            _this._initProfile(res.data);
            _this.saveState();
        }, function (err) {
            console.error('ERROR', err);
        });
    };
    User.prototype._loadUser = function () {
        var _this = this;
        return this.storage.get('user').then(function (user) {
            if (user) {
                _this._initUser(user);
            }
        });
    };
    User.prototype._initUser = function (user) {
        this._user = {
            user: user.user,
            refresh_token: user.refresh_token,
            access_token: user.access_token,
            expires_in: user.expires_in,
            token: user.token,
            timestamp: user.timestamp,
        };
        this.updateUser(this._user);
    };
    User.prototype._initProfile = function (profile) {
        this._profile = {
            avatar: profile.avatar,
            no_avatar: profile.no_avatar,
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            position: profile.position,
            birthday: profile.birthday,
            is_confirmed: profile.is_confirmed,
            locale: profile.locale,
            id: profile.id,
        };
        this.updateProfile(this._profile);
    };
    return User;
}());
User = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Api, Storage, Events])
], User);
export { User };
//# sourceMappingURL=user.js.map