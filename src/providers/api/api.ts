import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Transfer, TransferObject} from "@ionic-native/transfer";
import Config from "../../init";
import {Observable} from "rxjs/Observable";
import {App, NavController} from "ionic-angular";
import {SignupCompletedPage} from "../../pages/signup-completed/signup-completed";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Injectable()
export class Api {
    url: string = Config.apiUrl;

    constructor(public http: HttpClient, private transfer: Transfer, protected app: App) {

    }

    getNavCtrl(): NavController {
        return this.app.getRootNav();
    }

    getCurrentPage(): string {
        return this.getNavCtrl().getActive().name;
    }

    get(endpoint: string, params?: any, reqOpts?: any) {
        if (!reqOpts) {
            reqOpts = {
                params: new HttpParams()
            };
        }

        if (params) {
            reqOpts.params = new HttpParams();
            for (let k in params) {
                reqOpts.params = reqOpts.params.set(k, params[k]);
            }
        }

        return this.http.get(this.url + '/' + endpoint, reqOpts).catch((err: HttpErrorResponse) => {
            if (err.status == 403 && err.error.message === "NotConfirmed" && this.getCurrentPage() !== SignupCompletedPage.name) {
                //this.getNavCtrl().remove(0, this.getNavCtrl().getActive().index);
                this.getNavCtrl().setRoot('SignupCompletedPage')
            }

            return Observable.throw(err);
        });
    }

    post(endpoint: string, body: any, reqOpts?: any) {

      console.log('api.post');
      console.log(endpoint);
      console.log(body);

        return this.http.post(this.url + '/' + endpoint, body, reqOpts).catch((err: HttpErrorResponse) => {
            if (err.status == 403 && err.error.message === "NotConfirmed" && this.getCurrentPage() !== SignupCompletedPage.name) {
                //this.getNavCtrl().remove(0, this.getNavCtrl().getActive().index);
                this.getNavCtrl().setRoot('SignupCompletedPage')
            }

            return Observable.throw(err);
        });
    }

    put(endpoint: string, body: any, reqOpts?: any) {
        return this.http.put(this.url + '/' + endpoint, body, reqOpts);
    }

    delete(endpoint: string, reqOpts?: any) {
        return this.http.delete(this.url + '/' + endpoint, reqOpts).catch((err: HttpErrorResponse) => {
            return Observable.throw(err);
        });
    }

    patch(endpoint: string, body: any, reqOpts?: any) {
        return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
    }


    file(endpoint: string, data: object, fileKey: string, fileUrl: any) {
        const fileTransfer: TransferObject = this.transfer.create();

        let options = {
            fileKey: fileKey,
            fileName: this.getFileName(fileUrl),
            chunkedMode: false,
            params: data,
        };
        console.log('\src\providers\api\api.ts');
        console.log('fileUrl:' + fileUrl);
        console.log('endPoint:' + Config.apiUrl + '/' + endpoint);
        console.log('options' + options);
        return fileTransfer.upload(fileUrl, Config.apiUrl + '/' + endpoint, options, true);
    }

    multipleFiles(endpoint: string, data: object, fileKey: string, files: any, isNew: boolean) {
        let currentIndex = 0;
        return new Promise((resolve, reject) => {
            const __ = () => {
                let file = files[currentIndex];
                console.log('__');
                this.file(endpoint, data, fileKey, file).then((res) => {
                    let data = JSON.parse(res.response);
                    if(isNew) {
                        endpoint = endpoint + '/' + data.post_id;
                    }
                    console.log(currentIndex);
                    currentIndex++;
                    if(currentIndex < files.length) {
                        __();
                    }else{
                        resolve();
                    }
                }).catch((error) => {
                    console.log(error);
                    reject();
                });
            }

            __();

        });
    }

    download(endpoint: string) {
        this.http.get(this.url + '/' + endpoint).subscribe((res: any) => {
            let brows = new InAppBrowser();
            brows.create(res.link, "_system")
        })
    }

    getFullUrl(endpoint:string) {
        return this.url + '/' + endpoint;
    }

    getFileName(url) {
        let uri = url.split("/").pop();

        if (uri.indexOf("?") > 0) {
            uri = uri.substring(0, uri.indexOf("?"));
        }

        return uri;
    }
}
