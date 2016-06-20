
var messages;

Template.profile.helpers({
    username: function(){
        var user = Meteor.users.findOne(Session.get('currentProfileId'));
        return (user)? user.username : '';
    },
    isOwner: function(){
        return Meteor.userId() === Session.get('currentProfileId');
    },
    created: function(){
        return smartDate(Meteor.users.findOne(Session.get('currentProfileId')).createdAt);
    },
    isMyContact: function(){
        return Relations.findOne({users: Meteor.userId()});
    },
    sectionActive: function(){
        //reactive selection
        var tabId = Session.get('currentSection').split('T')[0];
        if (!$('#' + tabId).hasClass('active')){
            $('.section').removeClass('active');
            $('#' + tabId).addClass('active');
        }
        return Session.get('currentSection');
    },
    avatar: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).avatar;
    },
    banner: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).banner;
    },
    description: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).description;
    },
    IHaveEmailsVerified: function(){
        var emails = Meteor.users.findOne(Meteor.userId()).emails;
        return _(emails).some(function(e){return e.verified;});
    },
    hasEmails: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).emails;
    },
    hasNotVerifiedEmails: function(){
        var emails = Meteor.users.findOne(Session.get('currentProfileId')).emails;
        return _(emails).any(function(e){return !e.verified;});
    },
    hasEmailsVerified: function(){
        var emails = Meteor.users.findOne(Session.get('currentProfileId')).emails;
        return _(emails).any(function(e){return e.verified;});
    },
    services: function(){
        var services = Meteor.users.findOne(Session.get('currentProfileId')).services;
        if (_(services).isObject()) services = [services];

        return services;
    },
    isService: function(service){
        var services = Meteor.users.findOne(Session.get('currentProfileId')).services;
        return services[service];
    },
    tabNamesArray: function(){
        var tabs = [{template: 'channelsTabContent', name: 'channels', icon: 'fa-desktop', initialActive: true},
                {template: 'lessonsTabContent',  name: 'lessons', icon: 'fa-graduation-cap'},
                {template: 'recordsTabContent',  name: 'records', icon: 'fa-film'},
                {template: 'conversationsTabContent', name: 'conversations', icon: 'fa-comments', ownerOnly: true, isOwner: Session.get('currentProfileId') === Meteor.userId()},
                {template: 'contactsTabContent', name: 'contacts', icon: 'fa-user'}];
        return tabs;
    }
});

Template.profile.events({
    'click #edit-profile': function(){
        Router.go('profileEdit',{_id: Session.get('currentProfileId')})
    },
    'click .profile-img': function(){
        Router.go('profile',{_id: Session.get('currentProfileId')},{query: 'initialSection=channelsTabContent'});
    },
    'click #open-manager': function(){
        Router.go('profileContentManager',{_id: Session.get('currentProfileId')});
    },
    'click #send-email-button': function(){
        Router.go('sendEmail');
    },
    'click #verify-emails-button': function(){
        Router.go('verificationEmail');
    },
    'click #change-password-button': function(){
        Router.go('changePassword');
    },
    'click #view-facebook': function(){
        window.open(Meteor.users.findOne(Session.get('currentProfileId')).services.facebook.link);
    },
    'click #view-google': function(){
        window.open('https://plus.google.com/' + Meteor.users.findOne(Session.get('currentProfileId')).services.google.id);
    },
    'click #view-github': function(){
        window.open('https://github.com/' + Meteor.users.findOne(Session.get('currentProfileId')).username);
    },
    'click #add-contact': function(){
        var processInitiated = function(){
            return Requests.findOne({$or: [{'applicant.id': Meteor.userId()},{'requested.id': Meteor.userId()}]});
        };

        if (!processInitiated()){
            var request = {
                createAt: new Date(),
                applicant:{id: Meteor.userId(),deleted: false},
                requested: {id: Session.get('currentProfileId'), deleted: false},
                message: "Hey, I'm using DuckFlight! add me to your contacts!",
                status: 'pending'
            };
            Meteor.call('insertRequest',request,function(err,res){
                if(err) console.log('error');
                if(res) console.log(res);
            });
        }

    },
    'click #remove-contact': function(){
        Meteor.call('removeContact',Session.get('currentProfileId'));
    },
    'click #send-message': function(){
        Router.go('conversationSubmit',{},{query: 'userToSend=' + Session.get('currentProfileId')});
    },
    'click #send-email': function(){
        Router.go('sendEmail',{},{query: 'userToSend=' + Session.get('currentProfileId')});
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

Template.profile.created = function(){
    Session.set('horizontalMode',true);
    Session.set('currentProfileId',this.data.user_id);
};

Template.profile.rendered = function(){
    Session.set('resultTemplate','contactResult');
};

Template.profile.destroyed = function(){
    Session.set('currentProfileId', null);
    Session.set('horizontalMode', false);
};


Template.navbarBanner.helpers({
    currentTabName: function(){
        if (Session.get('currentSection')){
            return _(this.tabs).find(function(t){ return t.template === Session.get('currentSection');}).name;
        }else{
            return _(this.tabs).find(function(t){ return t.initialActive == true;}).name;
        }
    },
    capitalize: function(s){
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
});

Template.navbarBanner.events({
    'click .banner-navbar .section': function(e){
        $('.section').removeClass('active');
        $('#' + this.name).addClass('active');
        Session.set('currentSection',this.template);
        $('#list').click();
    },
    'click .banner-navbar-vertical .section': function(){
        Session.set('currentSection',this.template);
        $('#menuTabCollapse').collapse('hide');
    }
});

Template.navbarBanner.rendered = function(){
    var tab;
    if(Session.get('currentSection')){
        tab = _(this.data.tabs).find(function(t){ return t.template === Session.get('currentSection'); });
    }else{
        tab = _(this.data.tabs).find(function(t){ return t.initialActive == true;});
    }
    switch(this.data.widthType){
        case 'large':
            if($(window).width() > 1130){
                $('#' + tab.name).click();
            }else{
                Session.set('currentSection',tab.template);
            }
            break;
        case 'medium':
            if($(window).width() > 550){
                $('#' + tab.name).click();
            }else{
                Session.set('currentSection',tab.template);
            }
    }
    var self = this;
    self.autorun(function(){
        if (Session.get('currentSection')){
            Session.set('limit',LOAD_INITIAL);
        }
    })
};

Template.navbarBanner.destroyed = function(){
    Session.set('currentSection', null);
    Session.set('limit',null);
};

Template.channelsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    channels: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Channels.find({author: this.user_id},{sort: {createdAt: -1},limit: Session.get('limit')});
                break;
            case 'populars':
                return Channels.find({author: this.user_id},{sort: {votes_count: -1},limit: Session.get('limit')});
                break;
            case 'subscribed':
                return Channels.find({author: {$ne: this.user_id}},{sort: {createdAt: -1},limit: Session.get('limit')});
                break;
        }
    },
    searching: function(){
        return Session.get('currentFilter') == 'search-filter';
    },
    allowCreate: function() {
        return Session.get('currentProfileId') == Meteor.userId();
    },
    notResults: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Channels.find({author: this.user_id},{sort: {createdAt: -1},limit: Session.get('limit')}).count() == 0;
                break;
            case 'populars':
                return Channels.find({author: this.user_id},{sort: {votes_count: -1},limit: Session.get('limit')}).count() == 0;
                break;
            case 'subscribed':
                console.log(Channels.find({author: {$ne: this.user_id}},{sort: {createdAt: -1},limit: Session.get('limit')}).count() == 0);
                return Channels.find({author: {$ne: this.user_id}},{sort: {createdAt: -1},limit: Session.get('limit')}).count() == 0;
                break;
        }
    }
});

Template.channelsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('channel',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
            case 'subscribed-filter':
                Session.set('currentFilter','subscribed');
                break;
        }
        Session.set('limit',LOAD_INITIAL);
    },
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});

Template.channelsTabContent.created = function(){
    Session.set('limit',LOAD_INITIAL);
};

Template.channelsTabContent.rendered = function(){
    $('#recent-filter').click();
};

Template.channelsTabContent.destroyed = function(){
    Session.set('limit',null);
    Session.set('currentFilter',null);
};


Template.recordsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    records: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Records.find({},{sort: {createdAt: -1},limit: Session.get('limit')});
                break;
            case 'populars':
                return Records.find({},{sort: {votes_count: -1},limit: Session.get('limit')});
                break;
            case 'latests':
                var histEntries = HistoryRecords.find({user_id: this.user_id},{sort: {times: 1}}).fetch();
                var latestsIds = _(histEntries).pluck('record_id');
                return Records.find({_id: {$in: latestsIds}},{limit: Session.get('limit')});
                break;
        }
    },
    queryParams: function(){
        return (Router.current().options.route.getName() == 'channel')? 'channel=' + Router.current().params._id : null;
    },
    searching: function(){
        return Session.get('currentFilter') == 'search-filter';
    },
    allowCreate: function() {
        return (Router.current().route.getName() === 'profile')? Session.get('currentProfileId') == Meteor.userId() : true;
    },
    isProfileOwner: function(){
        return Router.current().route.getName() === 'profile' && Session.get('currentProfileId') == Meteor.userId();
    },
    notResults: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Records.find({},{sort: {createdAt: -1},limit: Session.get('limit')}).count() == 0;
                break;
            case 'populars':
                return Records.find({},{sort: {votes_count: -1},limit: Session.get('limit')}) === 0;
                break;
            case 'latests':
                return HistoryRecords.find({user_id: this.user_id},{sort: {times: 1}}).count() == 0;
                break;

        }
    }
});

Template.recordsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
            case 'latests-filter':
                Session.set('currentFilter','latests');
        }
        Session.set('limit',LOAD_INITIAL);
    },
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});
Template.recordsTabContent.created = function(){
    Session.set('limit',LOAD_INITIAL);
};
Template.recordsTabContent.rendered = function(){
    $('#recent-filter').click();
};
Template.recordsTabContent.destroyed = function(){
    Session.set('currentFilter',null);
    Session.set('limit',null);
};

Template.lessonsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    lessons: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Lessons.find({author: this.user_id},{sort: {createdAt: -1},limit: Session.get('limit')});
                break;
            case 'populars':
                return Lessons.find({author: this.user_id},{sort: {votes_count: -1},limit: Session.get('limit')});
                break;
            case 'subscribed':
                return Lessons.find({author: {$ne: this.user_id}}, {sort: {createdAt: -1}, limit: Session.get('limit')});
                break;
        }
    },
    searching: function(){
        return Session.get('currentFilter') == 'search-filter';
    },
    allowCreate: function() {
        return Session.get('currentProfileId') == Meteor.userId();
    },
    notResults: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Lessons.find({author: this.user_id},{sort: {createdAt: -1},limit: Session.get('limit')}).count() == 0;
                break;
            case 'populars':
                return Lessons.find({author: this.user_id},{sort: {votes_count: -1},limit: Session.get('limit')}).count() == 0;
                break;
            case 'subscribed':
                return Lessons.find({author: {$ne: this.user_id}}, {sort: {createdAt: -1}, limit: Session.get('limit')}).count() == 0;
                break;
        }
    }
});

Template.lessonsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
            case 'subscribed-filter':
                Session.set('currentFilter','subscribed');
                break;
        }
        Session.set('limit',LOAD_INITIAL);
    },
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});

Template.lessonsTabContent.created = function(){
    Session.set('limit',LOAD_INITIAL);
};

Template.lessonsTabContent.rendered = function(){
    $('#recent-filter').click();
};

Template.lessonsTabContent.destroyed = function(){
    Session.set('limit',null);
    Session.set('currentFilter',null);
};

Template.conversationsTabContent.helpers({
   conversations: function(){
       return Conversations.find({},{sort: {last_modified: -1}, limit: Session.get('limit')});
   },
   conversationsCount: function(){
       return Conversations.find({}).count();
   }
});

Template.conversationsTabContent.events({
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});

Template.conversationsTabContent.created = function(){
    Session.set('limit',LOAD_INITIAL)
};
Template.conversationsTabContent.destroyed = function(){
    Session.set('limit',null);
};

Template.conversationItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    status: function(){
        var alerts = ConversationAlerts.findOne({conversation_id: this._id});
        return (alerts && alerts.alerts_count)? 'pending' : 'viewed';
    },
    alertsCount: function(){
        var alerts = ConversationAlerts.findOne({conversation_id: this._id});
        return (alerts)? alerts.alerts_count : 0;
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    avatar: function(){
        var message = Messages.findOne({conversation_id: this._id, type: {$exists: false}},{sort: {createdAt: -1}});
        return Meteor.users.findOne(message.author).avatar;
    },
    username: function(){
        var message = Messages.findOne({conversation_id: this._id, type: {$exists: false}},{sort: {createdAt: -1}});
        return Meteor.users.findOne(message.author).username;
    },
    message: function(){
        return new Handlebars.SafeString(Messages.findOne({conversation_id: this._id, type: {$exists: false}},{sort: {createdAt: -1}}).message);
    }
});

Template.conversationItem.events({
    'click .reply-button': function(){
        Router.go('conversation',{_id: this._id});
    },
    'click img, click .author': function(){
        var authorId = Messages.findOne({conversation_id: this._id}).author;
        Router.go('profile',{_id: authorId},{query: 'initialSection=channelsTabContent'});
    }
});

Template.contactsTabContent.helpers({
    showContacts: function(){
        return Session.get('currentFilter') === 'contacts';
    },
    isOwner: function(){
        return Session.get('currentProfileId') === Meteor.userId();
    },
    notResults: function(){
        return !Relations.find().count();
    },
    contacts_count: function(){
        return Relations.find().count();
    }
});

Template.contactsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'contacts-filter':
                Session.set('currentFilter','contacts');
                break;
            case 'requests-filter':
                Session.set('currentFilter','requests');
                break;
        }
    }
});

Template.contactsTabContent.rendered = function(){
    $('#contacts-filter').click();
};

Template.contactsTabContent.destroyed = function(){
    Session.set('currentFilter',null);
};

Template.contactsList.helpers({
    contacts: function(){
        return Relations.find({},{sort: {createAt: -1},limit: Session.get('limit')});
    }
});
Template.contactsList.events({
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});
Template.contactsList.created = function(){
    Session.set('limit',LOAD_INITIAL);
};
Template.contactsList.destroyed = function(){
    Session.set('limit',null);
};

Template.contactItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    userStatus: function(){
        var contact = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return (Meteor.users.findOne(contact[0]).status.online)? 'online' : 'outline';
    },
    isOwner: function(){
        return Session.get('currentProfileId') === Meteor.userId();
    },
    avatar: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).avatar;
    },
    username: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).username;
    },
    description: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).description;
    },
    emailsVerified: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return _(Meteor.users.findOne(contactId[0]).emails).some(function(e){return e.verified;});
    }
});

Template.contactItem.events({
    'click .avatar, click .author': function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        Session.set('currentProfileId',contactId[0]);
        Session.set('currentSection','channelsTabContent');
        Router.go('profile',{_id: contactId[0]},{query: 'initialSection=channelsTabContent'});
    },
    'click .create-conversation-contact': function(){
        var user_id = _(this.users).find(function(u_id){ return u_id !== Meteor.userId()});
        Router.go('conversationSubmit',{},{query: 'userToSend=' + user_id});
    },
    'click .send-email-contact': function(){
        var user_id = _(this.users).find(function(u_id){ return u_id !== Meteor.userId()});
        Router.go('sendEmail',{},{query: 'userToSend=' + user_id});
    }
});


Template.requestSentList.helpers({
    requests: function(){
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]},{sort: {createAt: -1}});
    },
    sent_count: function(){
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]}).count();
    }
});

Template.requestReceivedList.helpers({
    requests: function(){
        return Requests.find({$and: [{'requested.id': Session.get('currentProfileId')}, {'requested.deleted': false}]},{sort: {createAt: -1}});
    },
    received_count: function(){
        return Requests.find({$and: [{'requested.id': Session.get('currentProfileId')}, {'requested.deleted': false}]}).count();
    }
});

Template.requestItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    toMe: function(){
        return this.requested.id == Session.get('currentProfileId');
    },
    pending: function(){
        return this.status == 'pending';
    },
    refused: function(){
        return this.status == 'refused';
    },
    accepted: function(){
        return this.status == 'accepted';
    },
    avatar:function(){
        if (this.requested.id === Session.get('currentProfileId')){
            return Meteor.users.findOne(this.applicant.id).avatar;
        }else{
            return Meteor.users.findOne(this.requested.id).avatar;
        }
    },
    username: function(){
        if (this.requested.id === Session.get('currentProfileId')){
            return Meteor.users.findOne(this.applicant.id).username;
        }else{
            return Meteor.users.findOne(this.requested.id).username;
        }
    },
    isSent: function(){
        return this.applicant.id === Session.get('currentProfileId');
    },
    avatarApplicant: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).avatar;
    }
});

Template.requestItem.events({
    'click .action-button': function(e){
        var notifications = [];
        if (this.status == 'pending'){
            var paramsNotification = {
                from: this.requested.id,
                to: [this.applicant.id],
                createdAt: new Date(),
                urlParameters: {template: 'profile', _id: this.applicant.id},
                type: 'contact'
            };
            switch(e.currentTarget.id){
                case 'accept':
                    Meteor.call('acceptRequest',this);
                    paramsNotification.action = 'acceptedRequest';
                    var notificationToRequested = {
                        from: this.applicant.id,
                        to: [this.requested.id],
                        urlParameters: {template: 'profile', _id: this.requested.id},
                        createdAt: new Date(),
                        type: 'contact',
                        action: 'added'
                    };
                    notifications.push(notificationToRequested);
                    break;
                case 'refuse':
                    Meteor.call('refuseRequest',this);
                    paramsNotification.action = 'refusedRequest';
                    break;
            }
            notifications.push(paramsNotification);
        }else{
            switch(e.currentTarget.id){
                case 'ok':
                    Meteor.call('checkRequest',this,Meteor.userId());
                    break;
                case 'resend':
                    Meteor.call('resendRequest',this);
                    var paramsNotification = {
                        to: [this.requested.id],
                        from: this.applicant.id,
                        urlParameters: {template: 'profile', _id: this.requested.id},
                        createdAt: new Date(),
                        type: 'contact',
                        action: 'receivedRequest'
                    };
                    break;
            }
            notifications.push(paramsNotification);
        }
        notifications.forEach(function(notification){
            NotificationsCreator.createNotification(notification,function(err){
                if (err) console.log('ERROR create notification');
            });
        });
    },
    'click .avatar, click .username': function(){
       if (this.applicant.id === Session.get('currentProfileId')){
           Router.go('profile',{_id: this.requested.id},{query: 'initialSection=channelsTabContent'});
       }else{
           Router.go('profile',{_id: this.applicant.id},{query: 'initialSection=channelsTabContent'});
       }
    }
});

//AutocompleteContacts

Template.autoCompleteContacts.helpers({
    searching: function(){
        return Session.get('searching');
    },
    activeSearch: function(){
        return Session.get('activeSearch');
    },
    hasResults: function(){
        return Session.get('hasResults');
    },
    results: function(){
        if (Session.get('searchValue')){
            return Meteor.users.find({_id: {$in: Session.get('results')}});
        }else{
            return [];
        }

    },
    resultTemplate: function(){
        return Session.get('resultTemplate');
    }
});

Template.autoCompleteContacts.events({
    'keyup input': function(e){
        Session.set('activeSearch',true);
        if ($(e.target).val() != ""){
            if (e.keyCode !== 16){Session.set('searching',true);}
            Session.set('searchValue',$(e.target).val());
        }else{
            Session.set('searchValue',null);
        }
    },
    'click #eraser-search': function(e){
        e.preventDefault();
        Session.set('activeSearch',false);
        Session.set('searching',false);
        $('#auto-complete-input').val('');
    }
});
Template.autoCompleteContacts.created = function(){
    Session.set('results',[]);
};
Template.autoCompleteContacts.destroyed = function(){
    Session.set('results',null);
};
Template.autoCompleteContacts.rendered = function(){
    Session.set('searching',false);
    Session.set('activeSearch',false);
    Session.set('hasResults',false);
    Session.set('searchValue',null);

    var subscription = null;
    var self = this;
    var resultsDecisor = function(){
        Session.set('hasResults',Meteor.users.find({$where: function(){
                return this.username.toLowerCase().match(new RegExp(Session.get('searchValue').toLowerCase()));
            }}).count() > 0);
        Session.set('searching',false);
        var results_objects = Meteor.users.find({$where: function(){
            return this.username.toLowerCase().match(new RegExp(Session.get('searchValue').toLowerCase()));
        }}).fetch();
        var currentResults = [];
        _(results_objects).each(function(res){
            currentResults.push(res._id)
        });
        Session.set('results',currentResults);
    };
    self.autorun(function(){

        if (Session.get('searchValue')){
            if(self.data.feedDynamic != 'false'){
                if (subscription){
                    subscription.stop();
                }
                subscription = Meteor.subscribe('usersBySearch',Session.get('searchValue').toLowerCase(), resultsDecisor);
            }else{
                resultsDecisor();
            }
        }else{
            Session.set('searching',false);
            Session.set('activeSearch',false);
        }
    })
};

Template.contactResult.helpers({
    inContacts: function(){
        return Relations.find({users: this._id}).count() || (Router.current().route.getName() == 'profile' && Session.get('currentProfileId') == this._id);
    },
    sent: function(){
        return Requests.find({'applicant.id': Session.get('currentProfileId'), 'requested.id': this._id}).count();
    },
    received: function(){
        return Requests.find({'applicant.id': this._id, 'requested.id': Session.get('currentProfileId')}).count();
    }
});

Template.contactResult.events({
    'click button': function(){
        var request = {
            createAt: new Date(),
            applicant:{id: Session.get('currentProfileId'),deleted: false},
            requested: {id: this._id, deleted: false},
            message: "Hey, I'm using DuckFlight! add me to your contacts!",
            status: 'pending'
        };

        var paramsNotification = {
            to: [request.requested.id],
            from: request.applicant.id,
            type: 'contact',
            createdAt: new Date(),
            urlParameters: {template: 'profile', _id: request.requested.id},
            action: 'receivedRequest'
        };

        Meteor.call('insertRequest',request,function(err,res){
            if(err) console.log('error');
            if(res){
                NotificationsCreator.createNotification(paramsNotification,function(err){
                    if(err) console.log('ERROR create notification');
                });
            };
        });
    }
});




