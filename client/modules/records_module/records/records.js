Template.records.helpers({
	records: function(){
		switch(Session.get('filter-active')){
			case 'recent-filter':
				return Records.find({},{sort: {createdAt: -1}});
			case 'popular-filter':
				return Records.find({},{sort: {votes_count: -1}});
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
		return {context: 'channels'};
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
	}
});

Template.records.rendered = function(){
	Session.set('horizontalMode',true);
	$('.button-circle').tooltip({placement: 'bottom', title: 'create a new Record'});
};

Template.records.created = function(){
	Session.set('filter-active','recent-filter');
}


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
	timeParser: function(duration){
		var d = new Date(duration);
		var min = (d.getMinutes() > 9)? '' + d.getMinutes() : '0' + d.getMinutes();
		var sec = (d.getSeconds() > 9)? '' + d.getSeconds() : '0' + d.getSeconds();
		return min + ':' + sec;
	}
});

Template.recordItemHorizontal.events({
	'click .image-hover i, click .card-title, click .image-hover, click img': function(){
		Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
	},
	'click .card-author': function(){
		Router.go('profile',{_id: this.author});
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
		Router.go('profile',{_id: this.author});
	}
});

Template.recordItemVertical.rendered = function(){
	$('.file-count').tooltip({placement: 'bottom', title: 'documents'});
	$('.replies-count').tooltip({placement: 'top', title: 'replies'});
	$('.votes-count').tooltip({placement: 'top', title: 'votes'});
	$('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
}