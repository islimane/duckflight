Router.configure({
  	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	subscriptions: function(){
		this.subscribe('userById',Meteor.userId());
		this.subscribe('sidebarChannels',Meteor.userId());
		this.subscribe('sidebarLessons',Meteor.userId());
		this.subscribe('userNotifications',Meteor.userId());
		this.subscribe('conversationsAlerts',Meteor.userId());
	}
});

Router.route('/loading',{name: 'loading'});
Router.route('/', {
	name: 'mainPage',
	waitOn: function(){
		return [Meteor.subscribe('allUsers'),
				Meteor.subscribe('channelsRanking'),
				Meteor.subscribe('lessonsRanking'),
				Meteor.subscribe('recordsRanking'),
				Meteor.subscribe('tagsVoted',Meteor.userId())];
	}
});

Router.route('/redirect',{name: 'redirect'});

//RECORDS

Router.route('/records',{
	name: 'records',
	waitOn: function(){ return Meteor.subscribe('records',LOAD_INITIAL); }
});

Router.route('/records/submit',{
	name: 'recordSubmit',
	data: function(){
		var data = {};
		(Session.get('dataRecordingObject'))? data.dataRecordObject = Session.get('dataRecordingObject') : null;
		if(this.params.query){
			(this.params.query.channel)? data.channel_id = this.params.query.channel : null;
			(this.params.query.parent)? data.parent_id = this.params.query.parent: null;
			(this.params.query.lesson)? data.lesson_id = this.params.query.lesson : null;
			(this.params.query.section)? data.section_id = this.params.query.section : null;
			(this.params.query.order)? data.order = this.params.query.order : null;
		}
		return data;
	},
	waitOn: function() {
		return [(this.params.query.parent)? Meteor.subscribe('documentsRecord',this.params.query.parent,false) : null,
				(this.params.query.channel)? Meteor.subscribe('channelShort',this.params.query.channel) : null,
				(this.params.query.lesson)? Meteor.subscribe('lessonShort',this.params.query.lesson) : null,
				(this.params.query.parent)? Meteor.subscribe('recordShort',this.params.query.parent) : null];
	}
});

Router.route('/record/:_id',{
	name: 'record',
	data: function(){return Records.findOne(this.params._id);},
	waitOn: function(){
		return Meteor.subscribe('recordComposite',this.params._id, Meteor.userId());
	},
	onBeforeAction: function(){
		var amI = _(UsersEnrolled.find({}).fetch()).some(function(u){
			return u.user_id == Meteor.userId();
		});
		if (this.data().lesson_id){
			if (amI || Lessons.findOne(this.data().lesson_id).author == Meteor.userId()){
				this.next();
			}else{
				this.render('accessDenied');
			}
		}else{
			this.next();
		}

	}
});


//CHANNELS

Router.route('/channels',{
	name: 'channels',
	waitOn: function(){ return Meteor.subscribe('channels');}
});

Router.route('/channels/submit',{
	name: 'channelSubmit'
});


Router.route('/channels/:_id',{
	name: 'channel',
	data: function(){
		return (this.ready()) ? Channels.findOne(this.params._id) : null;
	},
	waitOn: function(){
		return Meteor.subscribe('channelComposite',this.params._id, Meteor.userId());
	}
});

Router.route('/channels/:_id/edit',{
	name: 'channelEdit',
	data: function(){
		return (this.ready()) ? Channels.findOne(this.params._id) : null;
	},
	waitOn: function(){
		return Meteor.subscribe('channel',this.params._id,Meteor.userId());
	},
	onBeforeAction: function(){
		if (this.data().author !== Meteor.userId()){
			this.render('accessDenied');
		}else{
			this.next();
		}
	}
});

//TEAMS
Router.route('/teams',{
	name: 'teams',
	waitOn: function(){return [Meteor.subscribe('teams'),Meteor.subscribe('allUsers')]; }
});

Router.route('/teams/submit',{
	name: 'teamSubmit'
});

Router.route('/team/:_id',{
	name: 'team',
	data: function(){return Teams.findOne(this.params._id);},
	waitOn: function(){
		//subscriptions
	}
});


//LESSONS
Router.route('/lessons',{
	name: 'lessons',
	waitOn: function(){ Meteor.subscribe('lessons'); }
});

Router.route('/lessons/submit',{
	name: 'lessonSubmit'
});

Router.route('/lesson/:_id',{
	name: 'lesson',
	data: function(){
		return Lessons.findOne(this.params._id);},
	waitOn: function(){
		return Meteor.subscribe('lessonComposite', this.params._id, Meteor.userId());
	}
});

Router.route('/lesson/:_id/edit',{
	name: 'lessonEdit',
	data: function(){
		return (this.ready())? Lessons.findOne(this.params._id) : null;
	},
	waitOn: function(){
		return [Meteor.subscribe('sectionsByLesson',this.params._id),
				Meteor.subscribe('lesson',this.params._id)];
	},
	onBeforeAction: function(){
		if (this.data().author !== Meteor.userId()){
			this.render('accessDenied');
		}else{
			this.next();
		}
	}
});



//PROFILE
Router.route('/profile/:_id',{
	name: 'profile',
	data: function(){
		return (Meteor.users.findOne(this.params._id))? {user_id: this.params._id, section: this.params.query.initialSection} : null;
	},
	waitOn: function(){
		return [Meteor.subscribe('userById',this.params._id),
				Meteor.subscribe('channelsByUser',this.params._id),
				Meteor.subscribe('lessonsByUser',this.params._id),
				Meteor.subscribe('teamsByUser',this.params._id),
				Meteor.subscribe('recordsByUser',this.params._id),
				Meteor.subscribe('conversationsByUser',this.params._id),
				Meteor.subscribe('contactsByUser',this.params._id),
				Meteor.subscribe('requestsByUser',this.params._id),
				Meteor.subscribe('userSubscriptions',this.params._id),
				Meteor.subscribe('historyRecords',this.params._id)];

	},
	onBeforeAction: function(){
		Session.set('currentSection',this.params.query.initialSection);
		this.next();
	}
});

Router.route('/profile/:_id/edit',{
	name: 'profileEdit',
	data: function() {
		return {user_id: this.params._id};
	},
	waitOn: function(){
		return Meteor.subscribe('allUsers');
	},
	onBeforeAction: function(){
		if (this.data().user_id !== Meteor.userId()){
			this.render('accessDenied');
		}else{
			this.next();
		}
	}
});

Router.route('/profile/:_id/manager',{
	name: 'profileContentManager',
	data: function(){
		return {user_id: this.params._id, section: this.params.query.initialSection};
	},
	waitOn: function(){
		return [Meteor.subscribe('userById',this.params._id),
			Meteor.subscribe('channelsByUser',this.params._id),
			Meteor.subscribe('lessonsByUser',this.params._id),
			Meteor.subscribe('teamsByUser',this.params._id),
			Meteor.subscribe('recordsByUser',this.params._id),
			Meteor.subscribe('conversationsByUser',this.params._id),
			Meteor.subscribe('contactsByUser',this.params._id),
			Meteor.subscribe('requestsByUser',this.params._id)];

	},
	onBeforeAction: function() {
		if (Meteor.userId() !== this.data().user_id) {
			Router.go('profile', {_id: this.params._id});
		} else {
			Session.set('currentSection', this.params.query.initialSection);
			this.next();
		}
	}
});

Router.route('/send-email',{
	name: 'sendEmail',
	data: function(){
		var data = {user: Meteor.users.findOne(Meteor.userId())}
		if(this.params.query){
			(this.params.query.userToSend)? data.userToSend = this.params.query.userToSend : null;
		}
		return data;
	},
	waitOn: function(){
		return Meteor.subscribe('contactsByUserWithEmail',Meteor.userId());
	}
});

//CONVERSATIONS

Router.route('/conversation/submit',{
	name: 'conversationSubmit',
	data: function(){
		var data = {};
		(this.params.query.userToSend) ? data.userToSend = this.params.query.userToSend : null;
		return data;
	},
	waitOn: function(){
		return Meteor.subscribe('contactsByUser',Meteor.userId());
	}
});

Router.route('/conversation/:_id',{
	name: 'conversation',
	data: function(){return Conversations.findOne(this.params._id);},
	waitOn: function(){
		return Meteor.subscribe('conversationById',this.params._id,Meteor.userId());
	}
});

Router.route('/conversation/:_id/edit',{
	name: 'conversationEdit',
	data: function(){
		return (this.ready()) ? Conversations.findOne(this.params._id) : null;
	},
	waitOn: function(){
		return [
			Meteor.subscribe('conversationById', this.params._id,Meteor.userId()),
			Meteor.subscribe('contactsByUser', Meteor.userId()),
		];
	}
});



Router.route('/change-password',{
	name: 'changePassword',
	layoutTemplate: 'simpleLayout',
	data: function(){
		return Meteor.users.findOne(Meteor.userId());
	}
});

Router.route('/recover-password',{
	name: 'recoverPassword',
	layoutTemplate: 'simpleLayout',
});

Router.route('/reset-password/:token',{
	name: 'resetPassword',
	layoutTemplate: 'simpleLayout',
	data: function(){
		return {token: this.params.token};
	}
});

Router.route('/verifications',{
	name: 'verificationEmail',
	layoutTemplate: 'simpleLayout'
});

Router.route('/verify-email/:token',{
	name: 'verifyState',
	layoutTemplate: 'simpleLayout',
	data: function(){
		return {token: this.params.token};
	}
});

Router.route('/tutorials',{
	name:'tutorials',
	data: function(){
		return {};
	},
	layoutTemplate: 'secondaryLayout'
});

Router.route('/features',{
	name: 'features',
	layoutTemplate: 'secondaryLayout'
});

var isLogged = function(){
	if(!Meteor.userId()){
		this.render('mainPage');
	}else{
		this.next();
	}
};

//users must be authenticated before access every route.
Router.onBeforeAction(isLogged,{
	except: ['recoverPassword','verificationEmail','notFound', 'verifyState','resetPassword','tutorials','features']
});

Router.route('/(.*)',{
	name: 'notFound',
});

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound',except: ['redirect']});


