import {Component, Input, ViewChild, ComponentFactoryResolver, OnChanges} from '@angular/core';
import {ActionSheetController, Events, NavController} from "ionic-angular";
import {Api, Flash} from "../../providers";
import {Clipboard} from "@ionic-native/clipboard";

import {PostItemComponent} from "../post-item/post-item";
import {PostDirective} from "../../directives/post/post";
import {PostQuestionComponent} from "../post-question/post-question";
import {PostFinnHelpComponent} from "../post-finn-help/post-finn-help";


@Component({
    selector: 'post-list',
    templateUrl: 'post-list.html'
})
export class PostListComponent implements OnChanges {

    @Input('posts') posts: Array<any>;

    @ViewChild(PostDirective) post: PostDirective;

    constructor(public navCtrl: NavController,
                public api: Api,
                public flash: Flash,
                public clipboard: Clipboard,
                private componentFactoryResolver: ComponentFactoryResolver,
                public actionSheetCtrl: ActionSheetController,
                public events: Events
    ) {
    }

    ngOnChanges(): void {
        let viewContainerRef = this.post.viewContainerRef;
        viewContainerRef.clear();

        this.posts.forEach((post) => {
            let componentFactory = this.componentFactoryResolver
                .resolveComponentFactory<any>(this.definePostTemplate(post.type));

            let componentRef = viewContainerRef.createComponent(componentFactory);
            (<any>componentRef.instance).item = post;
        });

        this.readPosts();
    }

    readPosts() {
        let post_ids = this.getNoneReadPostIds();
        if(!post_ids.length) return;

        this.api.post('posts/read', {post_ids: post_ids}).subscribe(_ => {
            this.events.publish('BRANCHES:UPDATE');
        });

    }

    getNoneReadPostIds():any {
        let post_ids = [];
        this.posts.filter((post) => {
            return !post.read
        }).forEach((post) => {
            post_ids.push(post.id);
        });

        return post_ids;
    }

    definePostTemplate(name: string) {
        switch (name) {
            case 'default' :
                return PostItemComponent;

            case 'question' :
                return PostQuestionComponent;

            case 'finn_help' :
                return PostFinnHelpComponent;

            default:
                return PostItemComponent;
        }
    }
}
