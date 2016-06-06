Template.profileContentManager.helpers({
    avatar: function(){
        return Meteor.users.findOne(Meteor.userId()).avatar;
    },
    username: function(){
        return Meteor.users.findOne(Meteor.userId()).username;
    },
    tabNamesArray: function(){
        var tabs = [{template: 'channelsManage', name: 'channels', icon: 'fa-desktop', initialActive: true},
            {template: 'lessonsManage',  name: 'lessons', icon: 'fa-graduation-cap'},
            {template: 'recordsManage',  name: 'records', icon: 'fa-film'},
            {template: 'contactsManage', name: 'contacts', icon: 'fa-user'}];
        return tabs;
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    removing: function(){
        return Session.get('removing');
    }
});

Template.profileContentManager.events ({
    'click #get': function(){
        console.log($('#editor-mail').froalaEditor('html.get',true));
        $('.fr-view').html($('#editor-mail').froalaEditor('html.get',true));
    },
    'click #load-more-button': function(){
        Session.set('limit', Session.get('limit') + MORE_LIMIT);
    }
});

Template.profileContentManager.rendered = function(){
    Session.set('removing',false);
};
Template.profileContentManager.destroyed = function(){
    Session.set('removing',null);
};

/* LISTS */
Template.channelsManage.helpers({
    channels: function(){
        return Channels.find({},{sort: {createdAt: -1}, limit: Session.get('limit')});
    },
    has: function(){
        return Channels.find().count();
    }
});
Template.lessonsManage.helpers({
    lessons: function(){
        return Lessons.find({},{sort: {createdAt: -1}, limit: Session.get('limit')});
    },
    has: function(){
        return Lessons.find().count();
    }
});

Template.recordsManage.helpers({
    records: function(){
        return Records.find({},{sort: {createdAt: -1}, limit: Session.get('limit')});
    },
    has: function(){
        return Records.find().count();
    }
});

Template.contactsManage.helpers({
    contacts: function(){
        return Relations.find({},{sort: {createAt: -1}, limit: Session.get('limit')});
    },
    has: function(){
        return Relations.find().count();
    }
});

Template.removeItem.helpers({
    avatar: function(){
        var contact = _(this.users).filter(function(uId){return uId !== Meteor.userId()});
        return Meteor.users.findOne(contact[0]).avatar || '';
    },
    username: function(){
        var contact = _(this.users).filter(function(uId){return uId !== Meteor.userId()});
        return Meteor.users.findOne(contact[0]).username || '';
    },
    getContactDescription: function(){
        var contact = _(this.users).filter(function(uId){return uId !== Meteor.userId()});
        return Meteor.users.findOne(contact[0]).description || '';
    },
    smartDate: function(date){
        return smartDate(date);
    },
    ellipsis: function(s,max){
        return ellipsis(s || '',max);
    },
    getDuration: function(duration){
        var date = new Date(duration);
        var min = (date.getMinutes()> 10)? '' + date.getMinutes() : '0' + date.getMinutes();
        var sec = (date.getSeconds()> 10)? '' + date.getSeconds() : '0' + date.getSeconds();
        return {min: min, sec: sec};
    },
    exists: function(attr){
        return attr !== undefined;
    },
    isPossibleToDelete: function(){
        console.log(this);
        var element = this;
        var isPossibleForChannel = function(){
            console.log(!_.isUndefined(element.records_count) + 'records: ' + element.records_count);
            return !_(element.records_count).isUndefined() && !element.records_count;
        };
        var isPossibleForLesson = function(){
            return !_(element.sections_count).isUndefined() && !element.sections_count;
        };
        var isPossibleForRecord = function(){
            return !_(element.replies_count).isUndefined() && !element.replies_count;
        };
        var isPossibleForContacts = function(){
            return !_(element.users).isUndefined()
        };
        var possible = isPossibleForChannel();
        possible = (possible) ? possible : isPossibleForLesson();
        possible = (possible) ? possible : isPossibleForRecord();
        possible = (possible) ? possible : isPossibleForContacts();
        return possible;
    }
});


/* ITEMS */

Template.channelRemoveItem.events({

    'click button': function(){
        Session.set('removing',true);
        Meteor.call('channelRemove',this._id,function(err) {
            Session.set('removing',false);
            if (err) throw new Meteor.Error('500', 'ERROR: removing a channel');
        });
    },
    'click img, click .title': function(){
        Router.go('channel',{_id: this._id});
    }
});

Template.lessonRemoveItem.events({
    'click button': function(){
        Session.set('removing',true);
        Meteor.call('lessonRemove',this._id,function(err){
            Session.set('removing',false);
            if (err) throw new Meteor.Error('500','ERROR: removing a lesson');
        });
    },
    'click img, click .title': function(){
        Router.go('lesson',{_id: this._id});
    }
});

Template.recordRemoveItem.events({
    'click button': function(){
        Session.set('removing',true);

        Meteor.call('deleteTrackSC',this.track.id);

        Meteor.call('recordRemove',this._id,function(err){
            Session.set('removing',false);
            if (err)throw new Meteor.Error('500','ERROR: removing a record');
        });
    },
    'click img, click .title': function(){
        Router.go('record',{_id: this._id});
    }
});

Template.contactRemoveItem.events({
    'click button': function(){
        Session.set('removing',true);
        Meteor.call('relationRemove',this._id,function(err){
            Session.set('removing',false);
            if (err) throw new Meteor.Error('500','ERROR: removing a contact');
        });
    },
    'click img, click .title': function(){
        var contactId = _(this.users).filter(function(item){return item !== Meteor.userId()});
        Session.set('currentProfileId',contactId[0]);
        Router.go('profile', {_id: contactId[0]});
    }
});

