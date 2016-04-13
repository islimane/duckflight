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

        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}), type: 'channel'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}),type: 'lesson'}},
            {icon: 'fa-film',title: 'Records',listObject: {feed: Records.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: 5, sort: {votes: -1}}),type: 'record'}}];
        return sections;
    },
    mostPopularSections: function(){
        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({}, {sort: {votes_count: -1}}), type: 'channel'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({}, {sort: {votes_count: -1}}),type: 'lesson'}},
            {icon: 'fa-film',title: 'Records',listObject: {feed: Records.find({}, {sort: {votes_count: -1}}),type: 'record'}}];
        return sections;
    }
});
Template.exploreSection.events({
    'click section p button': function(){
        Router.go(this.title.toLowerCase());
    }
});
Template.listItemsDynamicFeed.helpers({
    feed: function(){
        Session.set('feedChanged',true);
        return this.listObject.feed;
    },
    isType: function(type){
        return this.listObject.type === type;
    }
});

Template.listItemsDynamicFeed.rendered = function(){
    var self = this;
    function setCarousel(){
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
        if(Session.get('feedChanged')){
            var owl = $('.owl-carousel');
            if (owl.data('owlCarousel')){
                owl.data('owlCarousel').destroy();
                Meteor.setTimeout(setCarousel,500);
            }else{
                setCarousel();
            }
            Session.set('feedChanged',false);
        }
    });
};

Template.listItemsDynamicFeed.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(e,template){
        Router.go(template.data.listObject.type,{_id: this._id});
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});

