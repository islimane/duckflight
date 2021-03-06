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

Template.records.helpers({
	records: function(){
		switch(Session.get('filter-active')){
			case 'recent-filter':
				return Records.find({},{sort: {createdAt: -1},limit: Session.get('limit')});
			case 'popular-filter':
				return Records.find({},{sort: {votes_count: -1},limit: Session.get('limit')});
			case 'search-filter':
				return [];
		}
	},
	listMode: function(){
		return Session.get('horizontalMode');
	},
	searching: function(){
		return Session.get('filter-active') == 'search-filter';
	},
	contextSearch: function(){
		return {context: 'records'};
	},
	has: function(){
		return Records.find({}).count();
	}
});

Template.records.events({
	'click .display-option': function(e){
		var elem = e.currentTarget;
		$('.display-option').removeClass('active');
		$(elem).addClass('active');
		if (elem.id == 'list'){
			Session.set('horizontalMode',true);
		}else{
			Session.set('horizontalMode',false);
		}
	},
	'click .filter': function(e){
		var elem = e.currentTarget;
		$('.filter').removeClass('active');
		$(elem).addClass('active');
		Session.set('filter-active',$(elem)[0].id);
		Session.set('limit',LOAD_INITIAL);
	},
	'click #load-more-button': function(){
		Session.set('limit',Session.get('limit') + MORE_LIMIT);
	}
});

Template.records.rendered = function(){
	Session.set('horizontalMode',true);
	$('.button-circle').tooltip({placement: 'bottom', title: 'create a new Recording'});
};

Template.records.created = function(){
	Session.set('limit',LOAD_INITIAL);
	Session.set('filter-active','recent-filter');
};

Template.records.destroyed = function(){
	Session.set('limit',null);
};


Template.recordItemHorizontal.helpers({
	shortDescription: function(description,max){
		return ellipsis(description,max);
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	authorName: function(){
		return Meteor.users.findOne(this.author).username;
	},
	timeParser: function(duration) {
		var d = new Date(duration);
		var min = (d.getMinutes() > 9) ? '' + d.getMinutes() : '0' + d.getMinutes();
		var sec = (d.getSeconds() > 9) ? '' + d.getSeconds() : '0' + d.getSeconds();
		return min + ':' + sec;
	}
});

Template.recordItemHorizontal.events({
	'click .image-hover i, click .card-title, click .image-hover, click img': function(){
		Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
	},
	'click .card-author': function(){
		Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
	},
	'click .button-from': function(e){
		console.log('link');
		if ($(e.currentTarget).hasClass('link-channel')){
			Router.go('channel',{_id: this.channel_id});
		}
		if($(e.currentTarget).hasClass('link-lesson')){
			Router.go('lesson',{_id: this.lesson_id});
		}
		if($(e.currentTarget).hasClass('link-parent')){
			Router.go('record',{_id: this.parent_id},{query: 'startInstant=' + this.timeMark});
		}
	}
});

Template.recordItemHorizontal.rendered = function(){
	$('.file-count').tooltip({placement: 'bottom', title: 'documents'});
	$('.replies-count').tooltip({placement: 'top', title: 'replies'});
	$('.votes-count').tooltip({placement: 'top', title: 'votes'});
	$('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
};

Template.recordItemVertical.helpers({
	dateFrom: function(d){
		return smartDate(d);
	},
	authorName: function(){
		return Meteor.users.findOne(this.author).username;
	},
	ellipsis: function(s,max){
		return ellipsis(s,max);
	},
	timeParser: function(duration){
		var d = new Date(duration);
		var min = (d.getMinutes() > 9)? '' + d.getMinutes() : '0' + d.getMinutes();
		var sec = (d.getSeconds() > 9)? '' + d.getSeconds() : '0' + d.getSeconds();
		return min + ':' + sec;
	}
});

Template.recordItemVertical.events({
	'click .image-hover i, click .card-title, click .image-hover, click img': function(){
		Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
	},
	'click .card-author': function(){
		console.log('holaaaa');
		Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
	},
	'click .button-from': function(e){
		console.log('link');
		if ($(e.currentTarget).hasClass('link-channel')){
			Router.go('channel',{_id: this.channel_id});
		}
		if($(e.currentTarget).hasClass('link-lesson')){
			Router.go('lesson',{_id: this.lesson_id});
		}
		if($(e.currentTarget).hasClass('link-parent')){
			Router.go('record',{_id: this.parent_id},{query: 'startInstant=' + this.timeMark});
		}
	}
});

Template.recordItemVertical.rendered = function(){
	$('.file-count').tooltip({placement: 'bottom', title: 'documents'});
	$('.replies-count').tooltip({placement: 'top', title: 'replies'});
	$('.votes-count').tooltip({placement: 'top', title: 'votes'});
	$('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
}