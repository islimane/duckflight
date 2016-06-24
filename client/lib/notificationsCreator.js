/**
 *    Copyright (C) 2016 Jorge Ortega Morata.
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    As a special exception, the copyright holders give permission to link the
 *    code of portions of this program with the OpenSSL library under certain
 *    conditions as described in each individual source file and distribute
 *    linked combinations including the program with the OpenSSL library. You
 *    must comply with the GNU Affero General Public License in all respects
 *    for all of the code used other than as permitted herein. If you modify
 *    file(s) with this exception, you may extend this exception to your
 *    version of the file(s), but you are not obligated to do so. If you do not
 *    wish to do so, delete this exception statement from your version. If you
 *    delete this exception statement from all source files in the program,
 *    then also delete it in the license file.
 */

var notificationsCreator = function(){

    //esto se hara directamente y se pasara como parametro en la entrada del metodo principal.
    var createBaseNotification = function(params){
        var obj = {
            to: params.to,
            createdAt: params.createdAt,
            from: params.from,
            contextTitle: params.contextTitle,
            urlParameters: params.urlParameters,
            type: params.type
        };
        return obj;
    };

    var createMessageRecord = function(params){
        var message;
        switch(params.action){
            case 'newComment':
                message = 'has written a comment to your recording';
                break;
            case 'replyComment':
                message = 'has written a reply for your comment';
            case 'like':
                message = 'likes your record';
                break;
            case 'removeLike':
                message = 'now does not like your recording';
                break;
            case 'reply':
                message = 'has created a reply for your recording';
                break;
        }
        return message;

    };
    var createMessageChannel = function(params){
        var message;
        switch(params.action){
            case 'newCommentChannel':
                message = 'has written a comment to your channel';
                break;
            case 'replyCommentChannel':
                message = 'has written a reply for your comment';
                break;
            case 'likeRecord':
                message = 'likes your recording <span>' + params.context.title + '</span>';
                break;
            case 'removeLikeRecord':
                message = 'now does not like your recording <span>' + params.context.title + '</span>';
                break;
            case 'newCommentRecord':
                message = 'has written a comment for your recording <span>' + params.context.title + '</span>'
                break;
            case 'replyCommentRecord':
                message = 'has writen a reply for your comment at the recording <span>' + params.context.title + '</span';
                break;
            case 'likeChannel':
                message = 'likes your channel';
                break;
            case 'removeLikeChannel':
                message = 'now does not like your channel';
                break;
            case 'subscription':
                message = 'has been subscribed to your channel';
                break;
            case 'cancelSubscription':
                message = 'has canceled subscription to your channel';
                break;
            case 'newRecord':
                message = 'has created a new recording <span>' + params.new.title + '</span>';
                break;
            case 'reply':
                message = 'has created a reply <span>' + params.new.title + '</span> for your recording <span>' + params.context.title+ '</span>';
                break;
        }
        return message;
    };

    var createMessageLesson = function(params){
        var message;
        switch(params.action){
            case 'newCommentLesson': //to lesson's creator.
                message = 'has written a comment to your lesson';
                break;
            case 'replyCommentLesson': //to lesson's creator.
                message = 'has written a reply for your comment';
                break;
            case 'newCommentRecord': //to record's creator.
                message = 'has written a comment for your recording <span>' + params.context.title + '</span>';
                break;
            case 'replyCommentRecord': //to comment's creator.
                message = 'has writen a reply for your comment at the recording <span>' + params.context.title + '</span';
                break;
            case 'likeLesson': //to lesson's creator.
                message = 'likes your lesson';
                break;
            case 'removeLikeLesson':
                message = 'now does not like your lesson';
                break;
            case 'likeRecord': //to record's creator.
                message = 'likes your recording <span>' + params.context.title + '</span>';
                break;
            case 'removeLikeRecord': //to record's creator
                message = 'now does not like your recording <span>' + params.context.title + '</span>';
                break;
            case 'subscription': //to lesson's creator.
                message = 'has been enrolled to your lesson';
                break;
            case 'cancelSubscription': //to lesson's creator.
                message = 'has canceled subscription to your lesson';
                break;
            case 'newSection': //to enrolled users.
                message = 'has been created a new section: <span>' + params.new.title + '</span>';
                break;
            case 'removeSection': //to enrolled users.
                message = 'has been removed a section: <span>' + params.new.title + '</span>';
                break;
            case 'newRecord': //to enrolled users.
                message = 'has been created a new recording <span>' + params.new.title + '</span>';
                break;
            case 'reply':
                message = 'has created a reply <span>' + params.new.title + '</span> for your recording <span>' + params.context.title+ '</span>';
                break;
        }
        return message;
    };

    var createMessageContact = function(params){
        var message;
        switch (params.action){
            case 'receivedRequest': //to requested
                message = 'wants to add you as a contact';
                break;
            case 'refusedRequest': //to applicant
                message = 'has refused your request';
                break;
            case 'acceptedRequest': //to applicant
                message = 'has accepted your request. Has been added to your contacts';
                break;
            case 'added': //to requested
                message = 'has been added to your contacts';
        }
        return message;
    };

    var createMessageConversation = function(params) {
        var message;
        switch (params.action) {
            case 'created': //to members conversation.
                message = 'has created a new conversation and you have been added!';
                break;
            case 'removed': //to member conversation.
                message = 'you have been removed from this conversation';
                break;
            case 'newLeader': //to new leader.
                message = 'has chosen you as new leader';
                break;
            case 'changedSubject': //to all members.
                message = 'has changed the subject to <span>' + params.context.title + '</span>';
                break;
            case 'added': //to member conversation.
                message = 'has added you as a member of this conversation';
                break;
        }
        return message;
    };

    this.createNotification = function(params,callback){
        var notificationObj = createBaseNotification(params);
        //notification message
        var message;
        switch(params.type){
            case 'record':
                message = createMessageRecord(params);
                break;
            case 'channel':
                message = createMessageChannel(params);
                break;
            case 'lesson':
                message = createMessageLesson(params);
                break;
            case 'contact':
                message = createMessageContact(params);
                break;
            case 'conversation':
                 message = createMessageConversation(params);
                break;
        }
        notificationObj.message = message;

        //notification saving process.
        Meteor.call('insertNotification',notificationObj,callback);
    };
};

NotificationsCreator = new notificationsCreator();