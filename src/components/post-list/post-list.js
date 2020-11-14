var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActionSheetController, Events, NavController } from "ionic-angular";
import { Api, Flash } from "../../providers";
import { Clipboard } from "@ionic-native/clipboard";
import { PostItemComponent } from "../post-item/post-item";
import { PostDirective } from "../../directives/post/post";
import { PostQuestionComponent } from "../post-question/post-question";
import { PostFinnHelpComponent } from "../post-finn-help/post-finn-help";
var PostListComponent = (function () {
    function PostListComponent(navCtrl, api, flash, clipboard, componentFactoryResolver, actionSheetCtrl, events) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.flash = flash;
        this.clipboard = clipboard;
        this.componentFactoryResolver = componentFactoryResolver;
        this.actionSheetCtrl = actionSheetCtrl;
        this.events = events;
    }
    PostListComponent.prototype.ngOnChanges = function () {
        var _this = this;
        var viewContainerRef = this.post.viewContainerRef;
        viewContainerRef.clear();
        this.posts.forEach(function (post) {
            var componentFactory = _this.componentFactoryResolver
                .resolveComponentFactory(_this.definePostTemplate(post.type));
            var componentRef = viewContainerRef.createComponent(componentFactory);
            componentRef.instance.item = post;
        });
        this.readPosts();
    };
    PostListComponent.prototype.readPosts = function () {
        var _this = this;
        var post_ids = this.getNoneReadPostIds();
        if (!post_ids.length)
            return;
        this.api.post('posts/read', { post_ids: post_ids }).subscribe(function (_) {
            _this.events.publish('BRANCHES:UPDATE');
        });
    };
    PostListComponent.prototype.getNoneReadPostIds = function () {
        var post_ids = [];
        this.posts.filter(function (post) {
            return !post.read;
        }).forEach(function (post) {
            post_ids.push(post.id);
        });
        return post_ids;
    };
    PostListComponent.prototype.definePostTemplate = function (name) {
        switch (name) {
            case 'default':
                return PostItemComponent;
            case 'question':
                return PostQuestionComponent;
            case 'finn_help':
                return PostFinnHelpComponent;
            default:
                return PostItemComponent;
        }
    };
    return PostListComponent;
}());
__decorate([
    Input('posts'),
    __metadata("design:type", Array)
], PostListComponent.prototype, "posts", void 0);
__decorate([
    ViewChild(PostDirective),
    __metadata("design:type", PostDirective)
], PostListComponent.prototype, "post", void 0);
PostListComponent = __decorate([
    Component({
        selector: 'post-list',
        templateUrl: 'post-list.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Api,
        Flash,
        Clipboard,
        ComponentFactoryResolver,
        ActionSheetController,
        Events])
], PostListComponent);
export { PostListComponent };
//# sourceMappingURL=post-list.js.map