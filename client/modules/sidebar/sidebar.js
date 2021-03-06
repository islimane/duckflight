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

Template.sidebar.helpers({
	username: function(){
		return ellipsis(Meteor.user().username,16);
	},
	menuTab: function(){
		return Session.get('menu-active');
	},
	avatar: function(){
		return Meteor.user().avatar;
	},
	currentSidebarTab: function(){
		return Session.get('currentSidebarTab');
	},
	conversations_counter: function(){
		return ConversationAlerts.find().count();
	},
	notifications_counter: function(){
		return Notifications.find().count();
	},
	userId: function(){return Meteor.userId();}
});

Template.sidebar.events({

	'click #logoutButton': function(){
		Meteor.logout();
		Router.go('/');
	},

	'click .tab': function(e){
		switch(e.currentTarget.id){
			case 'menu-tab':
				Session.set('currentSidebarTab','menuTab');
				break;
			case 'notifications-tab':
				Session.set('currentSidebarTab','notificationsTab');
				break;
			case 'chats-tab':
				Session.set('currentSidebarTab','chatsTab');
				break;
		}
	},

	'click #close-sidebar': function(e){
		$(e.currentTarget).removeClass('active');
		$('#sidebar-wrapper').addClass('unactive');
	},

	'click .close-toggle': function(){
		if($(window).width() <= 900){
			$('#sidebar-wrapper').addClass('unactive');
			$('#close-sidebar').removeClass('active');
		}
	},
	'click #tutorials-link': function(){
		window.open(Router.url('tutorials'));
	},
	'click #features-link': function(){
		window.open(Router.url('features'));
	}

});

Template.sidebar.rendered = function(){
	Session.set('menu-active',true);
	Session.set('currentSidebarTab','menuTab');
	/* sidebar display events */
	function closeSidebar(){
		$('#sidebar-wrapper').addClass('unactive');
		$(window).off('resize');
		openHandler();
	}

	function openSidebar(){
		$('#sidebar-wrapper').removeClass('unactive');
		$('#close-sidebar').removeClass('active'); //if it was active and we do click on it sidebar will close (important!!)
		$(window).off('resize');
		closeHandler();
	}

	function openHandler(){
		$(window).resize(function(){
			if($(window).width() > 990) openSidebar();
		});
	}

	function closeHandler(){
		$(window).resize(function(){
			if($(window).width() <= 990) closeSidebar();
		});
	}

	function initialzeSidebar (){
		($(window).width()<= 990) ? closeSidebar() : openSidebar();
	}
	/* end sidebar display events */

	initialzeSidebar();
};

Template.menuTab.helpers({
	channels: function(){return Channels.find({author: Meteor.userId()},{sort: {createdAt: -1},limit:3})},
	teams:  function(){return Teams.find({author: Meteor.userId()},{sort: {createdAt: -1},limit: 3})},
	lessons:  function(){return Lessons.find({author: Meteor.userId()},{sort: {createdAt: -1},limit: 3})},
	userId: function(){
		return Meteor.userId();
	}
});

Template.menuTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#menu-tab').addClass('active');
};

Template.notificationsTab.helpers({
	counter: function(type){
		return Notifications.find({type: type}).count();
	},
	notifications: function(type){
		return Notifications.find({type: type});
	},
	notifications_counter: function(){
		return Notifications.find().count();
	}
});

Template.notificationsTab.events({
	'click .rem-ikon': function(e){
		var type = $(e.currentTarget)[0].id.split('-')[1];
		var notifications = Notifications.find({type: type}).fetch();
		var notificationsIds = _(notifications).pluck('_id');
		_(notificationsIds).each(function(id){
			Meteor.call('notificationRemove',id,Meteor.userId(),function(err){
				if (err) throw new Meteor.Error('ERROR: error removing notifications');
			});
		});
	},
	'click .notifications-section-title a': function(e){
		if($(e.currentTarget) !== $('a[aria-expanded="true"]'))
			$('' + $('a[aria-expanded="true"]').attr('href')).collapse('hide');

	}
});

Template.notificationsTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#notifications-tab').addClass('active');
}

Template.notificationItem.helpers({
	avatar: function(){
		return Meteor.users.findOne(this.from).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.from).username;
	},
	smartDate: function(d){
		return smartDate(d);
	},
	title: function(max){
		switch(this.type){
			case 'contact':
				return 'Contact request';
				break;
			default:
				return ellipsis(this.contextTitle,max);
				break;
		}
	},
	typeClass: function(){
		switch(this.type){
			case 'channel':
				return 'fa-desktop';
				break;
			case 'lesson':
				return 'fa-graduation-cap';
				break;
			case 'record':
				return 'fa-film';
				break;
			case 'conversation':
				return 'fa-comments';
				break;
			case 'contact':
				return 'fa-user';
				break;
		}
	}
});

Template.notificationItem.events ({
	'click button':function(e){
		e.stopPropagation();
		Meteor.call('notificationRemove',this._id,Meteor.userId());
	},
	'click .notification-item': function(){
		switch(this.type){
			case 'contact':
				Router.go(this.urlParameters.template,{_id: this.urlParameters._id},{query: 'initialSection=contacsTabContent'});
				break;
			default:
				Router.go(this.urlParameters.template,{_id: this.urlParameters._id});
				break;
		}
		Meteor.call('notificationRemove',this._id,Meteor.userId());
	}
});

Template.chatsTab.helpers({
	conversations_counter: function(){
		return ConversationAlerts.find({}).count();
	},
	conversationAlerts: function(){
		return ConversationAlerts.find({});
	}
});

Template.chatsTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#chats-tab').addClass('active');
};

Template.conversationAlert.helpers({
	subject: function(){
		return ellipsis(Conversations.findOne({_id: this.conversation_id}).subject,10);
	},
	avatar: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return Meteor.users.findOne(messageObj.author).avatar;
	},
	username: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return Meteor.users.findOne(messageObj.author).username;
	},
	message: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		var messageBody = new Handlebars.SafeString(messageObj.message);
		return ellipsis(messageBody.string.split('&nbsp')[0],50);
	},
	date: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return smartDate(messageObj.createdAt);
	}
});

Template.conversationAlert.events({
	'click .conversation-alert-item': function(e,template){
		Router.go('conversation',{_id: template.data.conversation_id});
	}
});