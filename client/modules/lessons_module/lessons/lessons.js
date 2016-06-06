Template.lessons.helpers({
    lessons: function(){
        switch(Session.get('filter-active')) {
            case 'recent-filter':
                return Lessons.find({}, {sort: {createdAt: -1},limit: Session.get('limit')});
            case 'popular-filter':
                return Lessons.find({}, {sort: {votes_count: -1},limit: Session.get('limit')});
        }
    },
    listMode: function(){
        return Session.get('horizontalMode');
    },
    searching: function(){
        return Session.get('filter-active') == 'search-filter';
    },
    contextSearch: function(){
        return {context: 'lessons'};
    },
    has: function(){
        return Lessons.find({}).count();
    }
});

Template.lessons.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
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
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
        Session.set('filter-active',$(elem)[0].id);
        Session.set('limit',LOAD_INITIAL);
    },
    'click .button-circle': function(){
        Router.go('lessonSubmit');
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
    },
    'click #load-more-button': function(){
        Session.set('limit',Session.get('limit') + MORE_LIMIT);
    }
});

Template.lessons.rendered = function(){
    Session.set('horizontalMode',true);
    $('.button-circle').tooltip({placement: 'bottom', title: 'create a new Lesson'});
};

Template.lessons.created = function(){
    Session.set('limit',LOAD_INITIAL);
    Session.set('filter-active', 'recent-filter');
};

Template.lessons.destroyed = function(){
    Session.set('limit',null);
};

Template.lessonItemHorizontal.helpers({
    shortDescription: function(description,max){
        return ellipsis(description,max);
    },
    dateFrom: function(d) {
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    }
});

Template.lessonItemHorizontal.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
    }
});

Template.lessonItemHorizontal.rendered = function(){
    $('.sections-count').tooltip({placement: 'bottom', title: 'sections'});
    $('.comments-count').tooltip({placement: 'top', title: 'comments'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'top', title: 'subscriptions'});
};

Template.lessonItemVertical.helpers({
    dateFrom: function(d){
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    },
    ellipsis: function(s,max){
        return ellipsis(s,max);
    }
});

Template.lessonItemVertical.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author},{query: 'initialSection=channelsTabContent'});
    }
});

Template.lessonItemVertical.rendered = function(){
    $('.sections-count').tooltip({placement: 'bottom', title: 'sections'});
    $('.comments-count').tooltip({placement: 'top', title: 'comments'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'top', title: 'subscriptions'});
};


