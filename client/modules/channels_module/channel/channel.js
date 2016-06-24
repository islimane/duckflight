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

Template.channel.helpers({
    isOwner: function(){
        return Meteor.userId() === this.author;
    },
    tabNamesArray: function(){
        return [{template: 'recordsTabContent',  name: 'recordings', icon: 'fa-film', initialActive: true},
                {template: 'commentsTabContent', name: 'comments', icon: 'fa-comments'},
                {template: 'usersTabContent', name: 'users', icon: 'fa fa-users'}];
    },
    avatar: function(){
        return Meteor.users.findOne(this.author).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this.author).username;
    },
    dateFrom: function(d){
        return smartDate(d);
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    voted: function(){
       return (Votes.findOne({user_id: Meteor.userId()}))? 'active' : '';
    },
    userEnrolled: function(){
        return UsersEnrolled.findOne({user_id: Meteor.userId()});
    },
    hasTags: function(){
        return (this.tags)? this.tags.length : false;
    },
    helpEntries: function(){
        return [
            {text: 'How can I edit my channel?', url: 'tutorials?section=channels-section&subsection=2'},
            {text: 'How can I subscribe at this channel?', url: 'tutorials?section=channels-section&subsection=4'},
            {text: 'How can I create a recording for this channel?', url: 'tutorials?section=channels-section&subsection=1'},
            {text: 'How can I write a comment for this channel?', url: 'tutorials?section=channels-section&subsection=3'}
        ];
    }
});

Template.channel.events({
    'click .vote-button': function(e){
        $like = $(e.currentTarget);

        ($like.hasClass('active')) ? $like.removeClass('active') : $like.addClass('active');

        Meteor.call('voteChannel',this._id,Meteor.userId(),($like.hasClass('active'))? 1 : -1);

        var paramsNotification = {
            to: [this.author],
            from: Meteor.userId(),
            createdAt: new Date(),
            contextTitle: this.title,
            type: 'channel',
            action: ($like.hasClass('active'))? 'likeChannel' : 'removeLikeChannel',
            urlParameters: {template: 'channel', _id: this._id}
        };

        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err)console.log('create Notification ERROR: likeChannel: ' + err.reason);
        });
    },
    'submit #form-comment': function(e){
        e.preventDefault();
        var text = $(e.currentTarget).find('textarea').val();
        if (text){
            var comment = {
                createdAt: new Date(),
                author: Meteor.userId(),
                text: text,
                contextId: this._id,
                replies_count: 0,
                isReply: false
            };
            Meteor.call('insertComment',comment);
            Meteor.call('incrementChannelComment',this._id);
            $(e.currentTarget).find('textarea').val('');
        }
        if (this.author != Meteor.userId()){
            var paramsNotification = {
                to: [this.author],
                from: Meteor.userId(),
                createdAt: new Date(),
                contextTitle: this.title,
                type: 'channel',
                action: 'newCommentChannel',
                urlParameters: {template: 'channel', _id: this._id}
            };

            NotificationsCreator.createNotification(paramsNotification,function(err,result){
                if(err) console.log('createNotification ERROR: ' + err.reason);
                if(result) console.log('created new Notification');
            });
        }
    },
    'click .subscribe-button': function(){
        Meteor.call('insertUserEnrolledChannel',this._id, Meteor.userId());
        var paramsNotification = {
            to: [this.author],
            from: Meteor.userId(),
            createdAt: new Date(),
            contextTitle: this.title,
            type: 'channel',
            action: 'subscription',
            urlParameters: {template: 'channel', _id: this._id}
        };
        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err) console.log('subscriptionChannel Notification ERROR: ' + err.reason);
        });
    },
    'click #cancel-subscription-button': function(){
        Meteor.call('removeUserEnrolledChannel',this._id,Meteor.userId(),function(err,res){
            if(err) console.log('removeUserEnrolledChannel ERROR: ' + err.reason);
            if(res) console.log(res);
        });
        var paramsNotification = {
            to: [this.author],
            from: Meteor.userId(),
            createdAt: new Date(),
            contextTitle: this.title,
            type: 'channel',
            action: 'cancelSubscription',
            urlParameters: {template: 'channel', _id: this._id}
        };
        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err) console.log('cancelSubscriptionChannel Notification ERROR: ' + err.reason);
        });
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    },
    'click .display-option': function(e){
        var elem = e.currentTarget;
        $('.display-option').removeClass('active');
        $(elem).addClass('active');
        if (elem.id == 'list'){
            Session.set('horizontalMode',true);
        }else{
            Session.set('horizontalMode',false);
        }
    }
});

Template.channel.rendered = function(){
    $('.records-count').tooltip({placement: 'top', title: 'records'});
    $('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
    $('.votes-count').tooltip({placement: 'top', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'bottom', title: 'subscriptions'});
    $('.vote-button').tooltip({placement: 'bottom',text: 'vote'});
    $('#edit-channel').tooltip({placement: 'bottom',text: 'edit'});
    Session.set('contextType','channel');
    Session.set('horizontalMode',true);
}