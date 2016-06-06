Template.singleHeader.helpers({
    headerClass: function(){
        return Session.get('headerClass');
    }
});

Template.singleHeader.events({
    'click .show-sidebar': function(e) {
        $('#sidebar-wrapper').removeClass('unactive');
        $('#close-sidebar').addClass('active');
    }
});

Template.singleHeader.created = function(){
    Session.set('headerClass', Router.current().route.getName() + '-navbar');
};