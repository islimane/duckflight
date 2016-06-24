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

Template.verificationEmail.helpers({
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
    }
});

Template.verificationEmail.rendered = function(){
    Session.set('sent',false);
    Session.set('errorSent',false);
    Session.set('userIdentified',null);
    Session.set('currentEmailVerifying',null);
};

Template.verificationEmail.destroyed = function(){
    Session.set('sent',false);
    Session.set('errorSent',false);
    Session.set('userIdentified',null);
    Session.set('currentEmailVerifying',null);
};

Template.verificationEmail.events({
    'click #back': function(){
        Router.go('mainPage');
    },
    'click #resend-button': function(){
        console.log('holaaaa');
        var email = Session.get('currentEmailVerifying');
        Session.set('errorSent',false);
        var user = Meteor.user() || Session.get('userIdentified');
        Meteor.call('sendVerificationLink', user._id, email.address);
    }
});

Template.emailItemVerification.events({
    'click button': function(){
        var user = Meteor.user() || Session.get('userIdentified');
        Session.set('currentEmailVerifying',this);
        Session.set('errorSent',false);
        Meteor.call('sendVerificationLink', user._id, this.address,function(err){
            if (err){
                Session.set('errorSent',true);
            }else{
                Session.set('sent',true);
            }
        });

    }
});


Template.searchEmails.helpers({
    messageError: function(){
        return Session.get('messageError');
    },
    searching: function(){
        return Session.get('searching');
    }
});

Template.searchEmails.events({
    'submit .search-username-box form': function(e,template){
        e.preventDefault();
        var username = template.find('input').value;
        if (username){
            Session.set('searching',true);
            Meteor.call('getUserToVerify',username,function(err,res){
                if (err){
                    console.log(err);
                    Session.set('searching',false);
                    Session.set('messageError', err.error + ', try again!');
                }
                if (res){
                    Session.set('userIdentified',res);
                }
            });
            //aquí la llamada al método para que me devuelva el objeto user que guardar en una session.
        }
    }
})

Template.searchEmails.rendered = function(){
    Session.set('messageError','');
    Session.set('searching',false);
};

Template.searchEmails.destroyed = function(){
    Session.set('searching',false);
};


Template.verifyState.helpers({
    verifying: function(){return Session.get('verifying');},
    verified: function(){return Session.get('verified');}
});

Template.verifyState.events({
    'click #done-button': function(){
        Router.go('mainPage');
    },
    'click #try-again-button': function(){
        Router.go('verificationEmail');
    }
});

Template.verifyState.created = function(){
    Session.set('verifying',true);
    Session.set('verified',false);
};

Template.verifyState.rendered = function(){
    Accounts.verifyEmail(this.data.token,function(err){
        if(!err){
           Session.set('verified',true);
        }
        Session.set('verifying',false);
    });
};