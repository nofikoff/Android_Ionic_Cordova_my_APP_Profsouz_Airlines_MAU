var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
var CommentsComponent = (function () {
    function CommentsComponent(navCtrl) {
        this.navCtrl = navCtrl;
        this.reply_disabled = false;
    }
    CommentsComponent.prototype.reply = function (comment) {
        this.navCtrl.push('NewCommentPage', {
            post_id: comment.post_id,
            parent_id: comment.id
        });
    };
    CommentsComponent.prototype.toProfile = function (comment) {
        this.navCtrl.push('ProfilePage', { user: comment.user_id });
    };
    CommentsComponent.prototype.toEdit = function (comment) {
        this.navCtrl.push('NewCommentPage', { comment: comment, post_id: comment.post_id });
    };
    return CommentsComponent;
}());
__decorate([
    Input('comments'),
    __metadata("design:type", Array)
], CommentsComponent.prototype, "comments", void 0);
__decorate([
    Input('reply_disabled'),
    __metadata("design:type", Boolean)
], CommentsComponent.prototype, "reply_disabled", void 0);
CommentsComponent = __decorate([
    Component({
        selector: 'comments',
        templateUrl: 'comments.html'
    }),
    __metadata("design:paramtypes", [NavController])
], CommentsComponent);
export { CommentsComponent };
//# sourceMappingURL=comments.js.map