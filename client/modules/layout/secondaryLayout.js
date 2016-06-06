Template.secondaryLayout.helpers({
    sidebarTemplate: function(){
        return Session.get('sidebarTemplate');
    },
    headerTemplate: function(){
        return Session.get('headerTemplate');
    }
});

Template.secondaryLayout.created = function(){
    Session.set('sidebarTemplate', Router.current().route.getName() + 'Sidebar');
    Session.set('headerTemplate', Router.current().route.getName() + 'Header');
};

Template.secondaryLayout.rendered = function(){};

Template.secondaryLayout.destroyed = function(){
    Session.set('sidebarTemplate', null);
    Session.set('headerTemplate', null);
};