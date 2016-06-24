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

Template.signInForm.helpers({
	isLogin: function(){
		return Session.get('isLogin');
	},
	errorService: function(){
		return Session.get('errorServiceMsg');
	}
});

Template.signInForm.events({
	"click #signUp": function(){
		Session.set("formType",'signUpForm');
	},

	'click .facebook-button': function(){
		Meteor.loginWithFacebook({}, function(err){
			if (err) {
				Session.set('errorServiceMsg',err.reason);
			}
		});
	},
	'click .google-button': function(){
		Meteor.loginWithGoogle({}, function(err){
			if (err) {
				Session.set('errorServiceMsg',err.reason);
			}
		});
	},

	'click .github-button': function(){
		Meteor.loginWithGithub({requestPermissions: ['user']},function(err){
			if (err){
				Session.set('errorServiceMsg',err.reason);
			}
		});
	},

	"submit form": function(e){
		Session.set('isLogin',true);
		e.preventDefault();
		$("div").removeClass("has-error");
		$(".errormsg").remove();
		var identifier = $(e.target).find("[name=username]").val();
		var password = $(e.target).find("[name=password]").val();
		var userContext = (new RegExp('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$').exec(identifier))? {email: identifier} : {username: identifier};
		Meteor.loginWithPassword(userContext,password,function(err){
			Session.set('isLogin',false);
			if (err){
				switch(err.reason){
					case 'Incorrect password':
						$("#inputPassword").addClass("has-error");
						$("#inputPassword").append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Incorrect Password</p>');
						break;
					case 'User not found':
						$("#inputUsername").addClass("has-error");
						$("#inputUsername").append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Incorrect Username or Email</p>');
						break;
				}
			}else{
				$('#loginForm').modal('hide');
			}
		});
	}
});

Template.signInForm.rendered = function(){
	Session.set('errorServiceMsg', null);
};

Template.signInForm.destroyed = function(){
	Session.set('errorServiceMsg',null);
};