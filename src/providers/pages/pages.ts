import {Injectable} from '@angular/core';
import {Api} from '..';
import Config from '../../init'

@Injectable()
export class Pages {
    _data = [];
    _page = 1;
    _total: number;
    _url: string;

    constructor(public api: Api, public url: string, public method = 'GET', public params?: any) {
        this._url = Pages._getEndpointByUrl(url)
    }

    get(merged = true) {
        return new Promise(resolve => {
            this._getRequest().subscribe((res: any) => {
                let data = res.data;

                this._page = res.meta.current_page;
                this._total = res.meta.last_page;
                this._url = res.links.next ? Pages._getEndpointByUrl(res.links.next) : null;
                this._data = this._data.concat(data);

                merged ? resolve(this._data) : resolve(res.data);
            }, err => {
                console.error('ERROR', err);
            });
        });
    }

    _getRequest() {
        let request = this.api.get(this._url, this.params);

        if (this.method == 'POST') {
            request = this.api.post(this._url, this.params)
        }

        return request;
    }

    getPagesCount() {
        return this._total;
    }

    getCurrentPage() {
        return this._page;
    }

    hasMorePages() {
        return this._page !== this._total;
    }

    refreshPages(url: string = null) {
        this._total = 0;
        this._page = 1;
        this._data = [];
        this._url = url ? url : this.url;
    }

    getData() {
        return this._data;
    }

    static _getEndpointByUrl(url: string) {
        return url.replace(Config.apiUrl + '/', '')
    }
}