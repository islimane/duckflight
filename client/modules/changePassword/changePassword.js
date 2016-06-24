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