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

Template.record.helpers({
	authorAvatar: function(){
		return Meteor.users.findOne(this.author).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.author).username;
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	tabNamesArray: function(){
		return [{template: 'commentsTabContent', name: 'comments', icon: 'fa-comments', initialActive: true},
			{template: 'repliesTabContent',    name: 'replies', icon: 'fa-code-fork'},
			{template: 'relatedTabContent', name: 'related', icon: 'fa-tags'}];
	},
	sectionActive: function(){
		return Session.get('currentSection');
	},
	playerObjectData: function(){

		//object to initalize player.
		var playerObjectData = {
			recordPlayer: new RecordPlayer(),
			editorPlayerManager: new EditorPlayerManager(),
			recordId: this._id,
			trackId: this.track.id
		};

		return playerObjectData;
	},
	isALessonRecord: function(){
		return this.lesson_id;
	},
	docActual: function(){
		var doc = null;
		if (Session.get('docAct')){
			var docActual = Session.get('docAct');
			var doc = {
				title: docActual.title,
				mode: docActual.mode.split('/')[2],
				theme: docActual.theme.split('/')[2]
			};
		}
		return doc;
	},
	channel: function(){
		console.log(Channels.findOne(this.channel_id));
		return Channels.findOne(this.channel_id);
	},
	lesson: function(){
		return Lessons.findOne(this.lesson_id);
	},
	hasTags: function(){
		return this.tags.length;
	},
	voted: function(){
		return (Votes.findOne({user_id: Meteor.userId()}))? 'active' : '';
	},
	helpEntries: function(){
		return [
			{text: 'How can I play this record?', url: 'tutorials?section=records-section&subsection=3'},
			{text: 'How can I create a reply for this recording?', url: 'tutorials?section=records-section&subsection=5'},
			{text: 'How can I use playlist controls?', url: 'tutorials?section=lessons-section&subsection=6'},
			{text: 'How can I write a comment for this recording', url: 'tutorials?section=records-section&subsection=4'},
			{text: 'How can I browse the replies from this recording', url: 'tutorials?section=records-section&subsection=6'},
			{text: 'How can I browse the related recordings', url: 'tutorials?section=records-section&subsection=7'}
		];
	},
	isEnrolled: function(){
		if (this.lesson_id && UsersEnrolled.find().count()){
			return true;
		}else if(!this.lesson_id){
			return true;
		}else{
			false;
		}
	}
});

Template.record.events({
	'click #show-play-list': function(e){
		console.log('estoy haciendo click');
		var $button = $(e.currentTarget);
		if($button.hasClass('active')){
			$button.removeClass('active');
			$('.play-list-wrapper').removeClass('active');
		}else{
			$button.addClass('active');
			$('.play-list-wrapper').addClass('active');
		};
	},
	'click .creator-box img, click .creator-box .username': function(){
		Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
	},
	'click #like_button': function(e){
		var $like = $(e.currentTarget);
		($like.hasClass('active')) ? $like.removeClass('active') : $like.addClass('active');
		Meteor.call('voteRecord',this._id,Meteor.userId(),($like.hasClass('active'))? 1 : -1);
		if (this.author != Meteor.userId()){
			var paramsNotification = {
				to: [this.author],
				from: Meteor.userId(),
				createdAt: new Date(),
				type: 'record',
				action: ($like.hasClass('active'))? 'like': 'removeLike',
				urlParameters: {template: 'record', _id: this._id},
				contextTitle: this.title
			};
			if (this.channel_id){
				paramsNotification.type = 'channel';
				paramsNotification.action = ($like.hasClass('active'))? 'likeRecord': 'removeLikeRecord';
				paramsNotification.contextTitle = Channels.findOne(this.channel_id).title;
				paramsNotification.context = {title: this.title};
			}
			if (this.lesson_id){
				paramsNotification.type = 'lesson';
				paramsNotification.action = ($like.hasClass('active'))? 'likeRecord': 'removeLikeRecord';
				paramsNotification.contextTitle = Lessons.findOne(this.lesson_id).title;
				paramsNotification.context = {title: this.title};
			}
			NotificationsCreator.createNotification(paramsNotification,function(err){
				if(err) console.log('ERROR: create notification');
			});
		}
	},
	'submit form': function(e){
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
			Meteor.call('incrementRecordComment',this._id);
			if (this.author != Meteor.userId()){
				var paramsNotification = {
					to: [this.author],
					from: Meteor.userId(),
					createdAt: new Date(),
					type: 'record',
					action: 'newComment',
					urlParameters: {template: 'record', _id: this._id},
					contextTitle: this.title
				};
				if (this.channel_id){
					paramsNotification.type = 'channel';
					paramsNotification.action = 'newCommentRecord';
					paramsNotification.contextTitle = Channels.findOne(this.channel_id).title;
					paramsNotification.context = {title: this.title};
				}
				if (this.lesson_id){
					paramsNotification.type = 'lesson';
					paramsNotification.action = 'newCommentRecord';
					paramsNotification.contextTitle = Lessons.findOne(this.lesson_id).title;
					paramsNotification.context = {title: this.title};
				}
				NotificationsCreator.createNotification(paramsNotification,function(err){
					if(err) console.log('ERROR: create notification');
				});
			}

			$(e.currentTarget).find('textarea').val('');
		}
	}
});
Template.record.created = function(){
	Session.set('loading',true);
	Session.set('loaded',false);
	Session.set('playerObjectData',null);
	Session.set('currentRecordId',this.data._id);
};

Template.record.rendered = function(){
	Session.set('docAct',false);
	$('#docs_counter').tooltip({placement: 'left',title: 'docs'});
	$('#comments_counter').tooltip({placement: 'bottom',title: 'comments'});
	$('#votes_counter').tooltip({placement: 'bottom',title: 'votes'});
	$('#replies_counter').tooltip({placement: 'right',title: 'replies'});
	$('#like-button').tooltip({placement: 'top',text: 'vote'});
	Session.set('contextType','record');
	if (this.data.lesson_id)Session.set('contextType','innerRecordLesson');
	if (this.data.channel_id)Session.set('contextType','innerRecordChannel');
	Meteor.call('insertHistoryRecord',this.data._id,Meteor.userId(),function(err){
		if(err) throw new Meteor.Error(500,'Error while count times visited a record!');
	});
};


//Replies tab
Template.repliesTabContent.helpers({
	replies_count: function(){
		return Records.find({isReply: true,parent_id: Session.get('currentRecordId')}).count();
	},
	timeMarks: function(){
		var timeMarksArray = _(Records.find({isReply: true,parent_id: Session.get('currentRecordId')}).fetch()).pluck('timeMark');
		return _(timeMarksArray).uniq();
	}
});
Template.timeMarkList.helpers({
	timeMark: function(){
		var mark = parseInt(this.toString());
		var d = new Date(mark);
		var min = (d.getMinutes() > 9)? '' + d.getMinutes() : '0' + d.getMinutes();
		var sec = (d.getSeconds() > 9)? '' + d.getSeconds() : '0' + d.getSeconds();
		return min + ':' + sec;
	},
	records: function(){
		return Records.find({timeMark: parseFloat(this.toString()),parent_id: Session.get('currentRecordId')},{sort: {createdAt: 1}});
	}
});
//Related tab
Template.relatedTabContent.helpers({
	relatedCount: function(){
		return Records.find({_id: {$ne: this._id}, isReply: false,tags: {$in: this.tags}},{limit: 10, sort: {votes_count: -1}}).count();
	},
	relatedRecords: function(){
		return Records.find({_id: {$ne: this._id}, isReply: false,tags: {$in: this.tags}},{limit: 10, sort: {votes_count: -1}});
	}
});

Template.enrollHelp.events({
	'click button': function(){
		var record_id = Router.current().params._id;
		var lesson_id = Records.findOne(record_id).lesson_id;
		Meteor.call('insertUserEnrolledLesson',lesson_id,Meteor.userId(),function(err,res){
			if (err) throw new Meteor.Error('ERROR: while insert UserEnrolled');
		});
		var paramsNotification = {
			to: [Records.findOne(record_id).author],
			from: Meteor.userId(),
			createdAt: new Date(),
			contextTitle: Lessons.findOne(lesson_id).title,
			type: 'lesson',
			action: 'subscription',
			urlParameters: {template: 'lesson', _id: lesson_id}
		};
		NotificationsCreator.createNotification(paramsNotification,function(err){
			if(err) console.log('subscriptionLesson Notification ERROR: ' + err.reason);
		});
	}
});
