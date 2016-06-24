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

Template.startPage.helpers({
    tabNamesArray: function(){
        return [{template: 'homeTabContent',  name: 'home', icon: 'fa-home', initialActive: true},
            {template: 'searchTabContent', name: 'search', icon: 'fa-search'}];
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    username: function(){
        return Meteor.users.findOne(Meteor.userId()).username;
    },
    contextData: function(){
        return {contextSearch: {context: 'all'} };
    },
    requiresAttention: function(){
        return !Meteor.user().emails ||
                Meteor.user().emails.length == 0 ||
                _(Meteor.user().emails).any(function(e){return !e.verified;});
    },
    helpEntries: function(){
        return [
            {text: 'How can I browse the recordings?', url: 'tutorials?section=records-section&subsection=0'},
            {text: 'How can I browse the channels', url: 'tutorials?section=channels-section&subsection=0'},
            {text: 'How can I browse the lessons', url: 'tutorials?section=lessons-section&subsection=0'},
            {text: 'How can I create a recording?', url: 'tutorials?section=records-section&subsection=1'},
            {text: 'How can I create a lesson?', url: 'tutorials?section=lessons-section&subsection=1'},
            {text: 'How can I create a channel?', url: 'tutorials?section=channels-section&subsection=1'},
            {text: 'How can I browse my profile?', url: 'tutorials?section=profile-section&subsection=0'},
        ];
    }
});

Template.startPage.events({
    'click .content-home-section button': function(e){
        $button = $(e.currentTarget);
        $i = $button.find('i');
        if($i.hasClass('fa-angle-down')){
            $i.removeClass('fa-angle-down');
            $i.addClass('fa-angle-up');
        }else{
            $i.removeClass('fa-angle-up');
            $i.addClass('fa-angle-down');
        }
    }
});

Template.startPage.created = function(){
  var self = this;
    self.autorun(function(){
        var tagsNames = _(Tags.find().fetch()).pluck('name');
        var contextsIds = [];
        _(Votes.find().fetch()).each(function(v){
           if (v.channel_id) contextsIds.push(v.channel_id);
            if(v.lesson_id) contextsIds.push(v.lesson_id);
            if(v.record_id) contextsIds.push(v.record_id);
        });

        Meteor.subscribe('recommendations',contextsIds,tagsNames,5);
    });
};
Template.startPage.rendered = function(){
    console.log(this);
};

Template.exploreSection.helpers({
    hasRecommendations: function(){
        return Votes.find({}).count();
    },
    recommendedSections: function(){
        var tagsNames = _(Tags.find().fetch()).pluck('name');
        var contextsIds = [];
        _(Votes.find().fetch()).each(function(v){
            if (v.channel_id) contextsIds.push(v.channel_id);
            if(v.lesson_id) contextsIds.push(v.lesson_id);
            if(v.record_id) contextsIds.push(v.record_id);
        });

        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}), type: 'channel',id: 'recommemdedChannels'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}),type: 'lesson',id: 'recommemdedLessons'}},
            {icon: 'fa-film',title: 'Recordings',listObject: {feed: Records.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}),type: 'record',id: 'recommemdedRecords'}}];
        return sections;
    },
    mostPopularSections: function(){
        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({}, {limit: 5, sort: {votes_count: -1}}), type: 'channel', id: 'popularChannels'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({}, {limit: 5, sort: { votes_count: -1}}),type: 'lesson',id: 'popularLessons'}},
            {icon: 'fa-film',title: 'Recordings',listObject: {feed: Records.find({}, {limit: 5, sort: {votes_count: -1}}),type: 'record',id: 'popularRecords'}}];
        return sections;
    }
});
Template.exploreSection.events({
    'click section p button': function(){
        Router.go(this.listObject.type + 's');
    }
});

Template.exploreSection.created = function(){
    Session.set('feedChanged',true);
};
Template.listItemsDynamicFeed.helpers({
    feed: function(){
        Session.set('feedChanged',true);
        return this.listObject.feed;
    },
    id: function(){
        return this.listObject.id;
    },
    isType: function(type){
        return this.listObject.type === type;
    }
});

Template.listItemsDynamicFeed.rendered = function(){
    var self = this;

    function setCarousel(){
        console.log('voy a configurar el carousel');
        $('.owl-carousel').owlCarousel({
            margin: 10,
            responsive:{
                0:{items:1},
                600:{items:2},
                800:{items:3},
                1000:{items:3},
                1200:{items:4}
            }
        });
    }
    self.autorun(function(){
        console.log(Session.get('feedChanged'));
        if(Session.get('feedChanged')){
            var owl = $('#' + self.data.listObject.id);
            if (owl.data('owlCarousel'))
                owl.data('owlCarousel').destroy();
            Meteor.setTimeout(setCarousel,100);
            Session.set('feedChanged',false);
        }
    });
};

Template.listItemsDynamicFeed.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(e,template){
        Router.go(template.data.listObject.type,{_id: this._id});
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
    },
    'click .button-from': function(e){
        if ($(e.currentTarget).hasClass('link-channel')){
            Router.go('channel',{_id: this.channel_id});
        }
        if($(e.currentTarget).hasClass('link-lesson')){
            Router.go('lesson',{_id: this.lesson_id});
        }
        if($(e.currentTarget).hasClass('link-parent')){
            Router.go('record',{_id: this.parent_id});
        }
    }
});

Template.firstTimeTasks.helpers({
    tasks: function(){
        var tasks = [
            {
                title:'Update your profile',
                icon: 'fa-user',
                id: 'task1',

                completed: function(){
                    return _(this.subtasks).all(function(st){return st.completed()});
                },
                subtasks: [
                    {
                        title: 'Avatar and banner picture',
                        icon: 'fa-picture-o',
                        linkAction: {name: 'profileEdit', params: {_id: Meteor.userId()}},
                        description: 'Make your profile attractive adding an avatar and a banner image.',
                        linkTutorial: '/tutorials?section=profile-section&subsection=1',
                        completed: function(){
                            return Meteor.user().banner !== '/bannerDefault.png';
                        }
                    },
                    {
                        title: 'About you',
                        icon: 'fa-meh-o',
                        linkAction: {name: 'profileEdit', params: {_id: Meteor.userId()}},
                        description: 'Add a description about yourself so that other users know you.',
                        linkTutorial: '/tutorials?section=profile-section&subsection=1',
                        completed: function(){
                            return Meteor.user().description;
                        }
                    }
                ]
            },
            {
                title:'Create your own content',
                icon: 'fa-plus-square',
                id:'task2',
                completed: function(){
                    return _(this.subtasks).all(function(st){return st.completed()});
                },
                subtasks: [
                    {
                        title: 'recordings',
                        icon: 'fa-film',
                        linkAction: {name: 'recordSubmit'},
                        description: 'Please, create your first recording.',
                        linkTutorial: '/tutorials?section=records-section&subsection=1',
                        completed: function(){
                            return Records.find({author: Meteor.userId()}).count();
                        }
                    },
                    {
                        title: 'channels',
                        icon: 'fa-desktop',
                        linkAction: {name: 'channelSubmit'},
                        description: "Channels in DuckFlight are open to everyone. They're the place to share ideas about a specific subject. Please create a channel about the subject that you prefers and share your ideas and learn with others users.",
                        linkTutorial: '/tutorials?section=channels-section&subsection=1',
                        completed: function(){
                            return Channels.find({author: Meteor.userId()}).count();
                        }
                    },
                    {
                        title: 'lessons',
                        icon: 'fa-graduation-cap',
                        linkAction: 'lessonSubmit',
                        description: "Lessons in DuckFlight have a closed content. Only author can add, modify and delete contents. A lesson is the place to share your knowledge about a specific subject and where others can learn from you. Create your first lesson.",
                        linkTutorial: '/tutorials?section=lessons-section&subsection=1',
                        completed: function(){
                            return Lessons.find({author: Meteor.userId()}).count();
                        }
                    }
                ]

            },
            /*{
                title:'',
                icon: '',
                linkTutorial: '',
                completed: false,
                subtasks: [
                    {
                        title: '',
                        icon: '',
                        linkAction: '',
                        description: ''
                    },
                    {
                        title: '',
                        icon: '',
                        linkAction: '',
                        description: ''
                    }
                ]

            }*/
        ]
        return tasks;
    }

});
Template.taskItem.helpers({
    done: function(){
        return (this.completed())? 'done' : '';
    }
});

Template.subtaskItem.helpers({
    done: function(){
        return (this.completed())? 'done' : '';
    }
});

Template.subtaskItem.events({
    'click .task-item': function(){
        Router.go(this.linkAction.name,this.linkAction.params,this.linkAction.query);
    }
});


//HELP INFO

Template.helpInfo.helpers({
    hasEmails: function(){
        return Meteor.user().emails.length;
    },
    hasVerifiedEmails: function(){
        return _(Meteor.user().emails).any(function(e){return e.verified;});
    }
});


