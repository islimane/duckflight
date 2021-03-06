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

Template.commentsTabContent.helpers({
	hasComments: function(){
		return this.comments_count;
	}
});



//PUBLISH BOXES
Template.commentPublishBox.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	}
});

Template.replyPublishBox.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	}
});



//LISTS
Template.commentsList.helpers({
	comments: function(){
		return Comments.find({isReply: false},{sort: {createdAt: -1}});
	}
});

Template.commentsRepliesList.helpers({
	replies: function(){
		return Comments.find({comment_id: this._id},{sort: {createdAt: -1}});
	}
});

//commentDefault
Template.commentDefault.helpers({
	avatar: function(){
		return Meteor.users.findOne(this.author).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.author).username;
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	isNotReply: function(){return !this.isReply;}
});

Template.commentDefault.rendered = function(){
	console.log('commentDefault rendered');
};

//COMMENT
Template.comment.helpers({
	hasReplies: function(){
		return this.replies_count;
	}
});

Template.comment.events({
	'submit': function(e,template){
		e.preventDefault();
		var text = $(e.currentTarget).find('textarea').val();
		if (text){
			var reply = {
				createdAt: new Date(),
				author: Meteor.userId(),
				text: text,
				contextId: this.contextId,
				replies_count: 0,
				isReply: true,
				comment_id: this._id
			};
			Meteor.call('insertComment',reply);
			Meteor.call('incrementChannelComment',this.contextId);
			Meteor.call('incrementCommentReply',this._id);

			$(e.currentTarget).find('textarea').val('');
			$(template.find('.cancel-publish-reply')).click();
		}
		if (this.author != Meteor.userId()){
			var paramsNotification = {
				to: this.author,
				from: Meteor.userId(),
				type: Session.get('contextType'),
				createdAt: new Date(),
				urlParameters: {_id: this.contextId}
			};
			switch(Session.get('contextType')){
				case 'channel':
					paramsNotification.action = 'replyCommentChannel';
					paramsNotification.type = 'channel';
					paramsNotification.urlParameters.template = 'channel';
					break;
				case 'lesson':
					paramsNotification.action = 'replyCommentLesson';
					paramsNotification.type = 'lesson';
					paramsNotification.urlParameters.template = 'lesson';
					break;
				case 'record':
					paramsNotification.action = 'replyComment';
					paramsNotification.type = 'record';
					paramsNotification.urlParameters.template = 'record';
					break;
				case 'innerRecordChannel':
					paramsNotification.contextTitle = Channels.findOne(Records.findOne(this.contextId).channel_id).title;
					paramsNotification.action = 'replyCommentRecord';
					paramsNotification.type = 'channel';
					paramsNotification.context = {title: Records.findOne(this.contextId).title};
					paramsNotification.urlParameters.template = 'record';
					break;
				case 'innerRecordLesson':
					paramsNotification.contextTitle = Lessons.findOne(Records.findOne(this.contextId).lesson_id).title;
					paramsNotification.action = 'replyCommentRecord';
					paramsNotification.type = 'lesson';
					paramsNotification.context = {title: Records.findOne(this.contextId).title};
					paramsNotification.urlParameters.template = 'record';
					break;
			};
			NotificationsCreator.createNotification(paramsNotification,function(err,result){
				if(err) console.log('createNotification ERROR: ' + err.reason);
				if(result) console.log('created new Notification');
			});
		}
	},
	'click .create-reply-button': function(e,template){
		$(e.currentTarget).hide();
		$(template.find('.comment-publish-box')).fadeIn();
	},
	'click .cancel-publish-reply': function(e,template){
		$(template.find('.comment-publish-box')).fadeOut(function(){
			$(template.find('.create-reply-button')).show();
		});
	}
});

Template.comment.rendered = function(){
	$(this.firstNode).find('.comment-publish-box').hide();
};


