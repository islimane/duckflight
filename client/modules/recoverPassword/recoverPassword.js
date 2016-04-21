Template.recoverPassword.helpers({
    userToVerify: function(){
        return Meteor.user() || Session.get('userIdentified');
    },
    sentMail: function(){
        return Session.get('sent');
    },
    currentEmail: function(){
        return Session.get('currentEmailVerifying').address;
    },
    errorSent: function(){
        return Session.get('errorSent');
    },
    emailsVerified: function(){
        var user = Meteor.user() || Session.get('userIdentified');
        return _(user.emails).filter(function(email){return email.verified});
    }
});

Template.recoverPassword.events({
    'click #verify-email-button': function(){
       Router.go('verificationEmail');
    },
    'click #back': function(){
        Router.go((Meteor.userId()) ? 'profile' : 'mainPage',{_id: Meteor.userId()});
    },
    'click #resend-button': function(){
        var email = Session.get('currentEmailVerifying');
        Session.set('errorSent',false);
        var user = Meteor.user() || Session.get('userIdentified');
        Meteor.call('sendRecoverLink', user._id, email.address);
    }
});

Template.recoverPassword.rendered = function(){
    Session.set('sent',false);
    Session.set('errorSent',false);
    Session.set('userIdentified',null);
    Session.set('currentEmailVerifying',null);
};

Template.recoverPassword.destroyed = function(){
    Session.set('sent',false);
    Session.set('errorSent',false);
    Session.set('userIdentified',null);
    Session.set('currentEmailVerifying',null);
};

Template.emailItemRecover.events({
    'click button': function(){
        var user = Meteor.user() || Session.get('userIdentified');
        Session.set('currentEmailVerifying',this);
        Session.set('errorSent',false);
        Meteor.call('sendRecoverLink', user._id, this.address,function(err){
            if (err){
                Session.set('errorSent',true);
            }else{
                Session.set('sent',true);
            }
        });
    }
});

Template.resetPassword.helpers({
    success: function(){return Session.get('success');},
    resetting: function(){return Session.get('resetting');},
    errormsg: function(){return Session.get('errormsg');}
});

Template.resetPassword.events({
    'submit #new-password-form': function(e,template){
        e.preventDefault();
        var password = template.find('#password').value;
        var rePassword = template.find('#repassword').value;

        function checkPasswords (p1,p2){
            return p1 == p2 && p1.length == 6 && p2.length == 6;
        }

        if (checkPasswords(password,rePassword)){
            Session.set('resetting',true);
            Accounts.resetPassword(this.token,password,function(err){
                if (!err){
                    Session.set('success',true);
                }else{
                    Session.set('resetting',false);
                    console.log(err);
                    Session.set('errormsg','Sorry, has been an error resetting your password! ' + err.reason);
                }
            });
        }else{
            Session.set('errormsg','Passwords do not match!, They must be at least 6 characters');
        }
        $('input').val('');
    },
    'click #back': function(){
        Router.go('mainPage');
    }
});

Template.resetPassword.rendered = function(){
    Session.set('success',false);
    Session.set('resetting',false);
    Session.set('errormsg','');
};

Template.resetPassword.destroyed = function(){
    Session.set('success',false);
    Session.set('resetting',false);
    Session.set('errormsg','');
};