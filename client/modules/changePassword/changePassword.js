Template.changePassword.helpers({
    unlocked: function(){return Session.get('unlocked');},
    errormsg: function(){return Session.get('errormsg');},
    success: function(){return Session.get('success');}
});

Template.changePassword.events({

    'submit #new-password-form': function(e,template){
        e.preventDefault();
        var password = template.find('#password').value;
        var rePassword = template.find('#repassword').value;
        if (password == rePassword){
            Accounts.changePassword(Session.get('oldPassword'),password,function(err){
                if (!err){
                    Session.set('success',true);
                }else{
                    Session.set('errormsg','Sorry, has been an error changing your password!');
                }
            });
        }else{
            Session.set('errormsg','Password do not match!');
        }
        $('input').val('');
    },
    'click #back': function(){
        Router.go('profile',{_id: Meteor.userId()});
    }
});

Template.changePassword.created = function(){
    Session.set('unlocked',false);
    Session.set('success',false);
};
Template.changePassword.destroyed = function(){
    Session.set('oldPassord',null);
}

Template.unlockerByPassword.helpers({
    errormsg: function(){
        return Session.get('errormsg');
    }
});
Template.unlockerByPassword.events({
    'submit #current-password-form': function(e){
        e.preventDefault();
        var password = $('#password').val();
        Meteor.call('checkPassword', password, function(err, result) {
            if (result) {
                Session.set('errormsg','');
                Session.set('oldPassword',result);
                Session.set('unlocked',true);
            }else{
                Session.set('errormsg','Incorrect password!');
            }
        });
        $('#password').val('');

    },
    'click #recover-password-button': function(){
        Router.go('recoverPassword');
    },
    'click #back': function(){
        Router.go('profile',{_id: Meteor.userId()});
    }
});

Template.unlockerByPassword.rendered = function(){
    Session.set('unlocked',false);
    Session.set('errormsg','');
    Session.set('oldPassword',null);
};