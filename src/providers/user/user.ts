import {Injectable, OnDestroy} from '@angular/core';
import {Api} from '../';
import {Storage} from '@ionic/storage'
import {BehaviorSubject} from "rxjs"
import {Events} from "ionic-angular";

export interface iUser {
    user: number;
    refresh_token: string;
    access_token: string;
    expires_in: string;
    token: string;
    timestamp: string;
}

export interface iProfile {
    id: number;
    avatar: string;
    no_avatar: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    locale: string;
    position: string;
    birthday: string;
    is_confirmed: boolean;
}

@Injectable()
export class User implements OnDestroy {

    private _user: iUser;
    private _profile: iProfile;

    private profileState: BehaviorSubject<iProfile> = new BehaviorSubject(<iProfile>{});
    private userState: BehaviorSubject<iUser> = new BehaviorSubject(<iUser>{});

    constructor(public api: Api, public storage: Storage, public events: Events,) {
    }

    ngOnDestroy() {
        this.saveState();
    }

    getProfile() {
        return this.profileState.asObservable();
    }

    getUser() {
        return this.userState.asObservable();
    }

    updateUser(user: iUser) {
        this._user = user;
        this.userState.next(Object.assign({}, user));
        this.storage.set('user', this._user);
    }

    updateProfile(profile: iProfile) {
        this._profile = profile;
        this.profileState.next(Object.assign({}, profile));
    }

    login(accountInfo: any) {
        return new Promise((resolve, reject) => {
            this.api.post('login', accountInfo).subscribe((res: any) => {
                this._loggedIn(res);
                resolve(res);
            }, err => {
                reject(err);
                console.error('ERROR', err);
            });
        })
    }

    signup(accountInfo: any) {
        return new Promise((resolve, reject) => {
            this.api.post('register', accountInfo).subscribe((res: any) => {
                this._loggedIn(res);
                resolve(res);
            }, err => {
                console.error('ERROR', err);
                reject(err);
            });
        });
    }

    logout() {
        this.storage.set('user', null);
        this._user = null;
        this._profile = null;
    }

    updateState() {
        return Promise.all([
            this._fetchProfile()
        ]);
    }

    getStateUser() {
        return this.storage.get('user').then(user => user);
    }

    saveState() {
        this.storage.set('user', this._user);
        this.events.publish('login');
    }

    loadState() {
        return Promise.all([
            this._loadUser().then(() => {
                this._fetchProfile()
            })
        ]);
    }

    auth() {
        return this.api.get('auth');
    }

    private _loggedIn(resp) {
        this._initUser(resp);
        this._fetchProfile();
    }

    private _fetchProfile() {
        return this.api.get('users').subscribe((res: any) => {
            this._initProfile(res.data);
            this.saveState();
        }, err => {
            console.error('ERROR', err);
        });
    }

    private _loadUser() {
        return this.storage.get('user').then((user) => {
            if (user) {
                this._initUser(user);
            }
        });
    }

    private _initUser(user) {
        this._user = <iUser>{
            user: user.user,
            refresh_token: user.refresh_token,
            access_token: user.access_token,
            expires_in: user.expires_in,
            token: user.token,
            timestamp: user.timestamp,
        };

        this.updateUser(this._user);
    }

    private _initProfile(profile) {
        this._profile = <iProfile>{
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
    }
}