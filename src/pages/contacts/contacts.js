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
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers";
import { Contacts, ContactField, ContactName } from '@ionic-native/contacts';
/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ContactsPage = (function () {
    function ContactsPage(navCtrl, navParams, api, events, contacts) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.events = events;
        this.contacts = contacts;
        this.users = [];
        this.search = '';
        this.getContacts();
    }
    ContactsPage.prototype.getContacts = function () {
        var _this = this;
        this.events.publish('loading_start');
        this.api.get('users/contacts', { search: this.search }).subscribe(function (res) {
            _this.users = res.data;
            _this.events.publish('loading_end');
        }, function (_) {
            _this.events.publish('loading_end');
        });
    };
    ContactsPage.prototype.searching = function () {
        var _this = this;
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(function () {
            _this.getContacts();
        }, 1000);
    };
    ContactsPage.prototype.addToContact = function (user) {
        var contact = this.contacts.create();
        contact.name = new ContactName(null, user.last_name, user.first_name);
        contact.phoneNumbers = [new ContactField('mobile', user.phone)];
        contact.save().then(function () { return console.log('Contact saved!', contact); }, function (error) { return console.error('Error saving contact.', error); });
    };
    ContactsPage.prototype.formatPhone = function (phone) {
        var pattern = "+##(###)### ## ##";
        var i = 0, v = phone.toString();
        return pattern.replace(/#/g, function (_) { return v[i++]; });
    };
    ContactsPage.prototype.toProfile = function (user) {
        this.navCtrl.push('ProfilePage', { user: user.id });
    };
    return ContactsPage;
}());
ContactsPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-contacts',
        templateUrl: 'contacts.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Api,
        Events,
        Contacts])
], ContactsPage);
export { ContactsPage };
//# sourceMappingURL=contacts.js.map