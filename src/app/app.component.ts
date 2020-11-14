import {Component, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Events, MenuController, Platform, Config, LoadingController, Nav} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';

import {FCM} from '@ionic-native/fcm/ngx';

import {Storage} from '@ionic/storage';
import {User, Api} from '../providers';
import {AppVersion} from '@ionic-native/app-version';


@Component({
    templateUrl: 'app.template.html'
})
export class ConferenceApp {

    rootPage: string;
    vers_code: string | number;
    vers_number: string;
    loader;

    @ViewChild(Nav) nav: Nav;

    constructor(public events: Events,
                public menu: MenuController,
                public platform: Platform,
                public storage: Storage,
                public user: User,
                public api: Api,
                public splashScreen: SplashScreen,
                public translate: TranslateService,
                public config: Config,
                public loadingCtrl: LoadingController,
                private version: AppVersion,
                private fcm: FCM
    ) {
        this.splashScreen.show();

        this.initTranslate();
        this.eventListening();
        this.storage.get('locale').then((locale) => {
            if (locale) {
                this.checkAuth().then(() => {
                    this.platformReady();
                });
            } else {
                this.rootPage = 'LanguagePage';
                this.platformReady();
            }
        });

      this.fcmPush();
    }

  fcmPush() {
      if(this.platform.is('ios') || this.platform.is('android')) {

        this.fcm.subscribeToTopic('people');

        this.fcm.getToken().then(token => {
          console.log(token);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });

        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background');
          } else {
            console.log('Received in foreground');
          }
        });
      }
    }

    checkAuth() {
        return new Promise((resolve) => {
            this.user.auth().subscribe((res) => {
                if (!res.auth) {
                    this.rootPage = 'LoginPage';
                    resolve();
                }
                this.user.loadState().then(() => {
                    resolve();
                }, resolve);
            }, () => {
                this.rootPage = 'LoginPage';
                resolve();
            });
        })
    }

    subscribeProfile() {
        this.user.getProfile().subscribe((res: any) => {
            if (Object.keys(res).length === 0) {
                return;
            }

            if (res.locale) {
                this.storage.set('locale', res.locale);
                this.translate.use(res.locale);
            }
            if (res.is_confirmed && (!res.position || !res.birthday || res.no_avatar)) {
                this.rootPage = 'EditProfilePage';
            } else {
                this.rootPage = res.is_confirmed ? 'TabsPage' : 'SignupCompletedPage';
            }
            if (this.nav.getActive().name === 'LoginPage') {
                this.nav.setRoot(this.rootPage);
            }

        }, () => {
            this.rootPage = 'LoginPage';
        });
    }

    initTranslate() {
        this.translate.setDefaultLang('ru');

        this.translate.use('ru');

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    platformReady() {
        // Call any initial plugins when ready
        this.platform.ready().then(() => {
            this.splashScreen.hide();
            this.subscribeProfile();
            this.showBuildVersion();
        });
    }

    eventListening() {
        this.events.subscribe('loading_start', () => {
            this.translate.get('LOADING').subscribe((value) => {
                this.loader = this.loadingCtrl.create({
                    content: value
                });
                this.loader.present();
            })
        });

        this.events.subscribe('loading_end', () => {
            this.loader.dismiss();
        });
    }

    showBuildVersion() {

        if (this.platform.is('ios') || this.platform.is('android')) {

            this.user.getProfile().subscribe((user: any) => {
                //By Novikov
                if (user.id === 1 || true) {
                    this.version.getVersionCode().then((version) => {
                        this.vers_code = version;
                    });

                    return this.version.getVersionNumber().then((version) => {
                        this.vers_number = version;
                    });
                }
            })

        }
    }

}
