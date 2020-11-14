import {Injectable, Injector} from '@angular/core';
import Centrifuge from 'centrifuge';
import {Api, User, Flash} from '..';
import SockJS from 'sockjs-client';
import Config from "../../init";

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Centrifugo {

    public centrifuge: Centrifuge;

    constructor(public user: User, public api: Api, public inj: Injector, public flash: Flash) {
        this.inj.get(User).getUser().subscribe((user) => {
            if (user.hasOwnProperty('access_token')) {
                this.api.get('centrifuge').subscribe((res: any) => {
                    this.connect(res.user, res.timestamp, res.token)
                })
            }
        });
    }

    connect(user, timestamp, token) {
        this.centrifuge = new Centrifuge({
            url: Config.wsUrl,
            user: user,
            timestamp: timestamp,
            token: token,
            sockJS: SockJS,
        });

        this.centrifuge.connect();

        let _self = this;

        this.centrifuge.subscribe("user_" + user, function (message) {
            _self.flash.push(message.data.message);
        });
    }
}
