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

var validatePassword = function(password){
	//de momento que sea mayor o igual que 6 caracteres.
	return password.length >= 6;
};

var validateUserName = function(username){
	return !Meteor.users.findOne({username: username});
};

var validateEmail = function(email){
	return !Meteor.users.findOne({emails: {$elemMatch: { address: email}}});
};

var validateCreateUser = function(user,errors){
	//debe de cumplir todas las condiciones de validación.
	if(!validateUserName(user.username)) errors.username = true;
	if(!validateEmail(user.email)) errors.email = true;
	if (!validatePassword(user.password)) errors.password = true;
	if (user.password != user.repassword) errors.repassword = true;
	console.log(errors);
	return _(errors).keys().length == 0;
};

Meteor.methods({
	signUp: function(user){
		var errors = {};
		var result;
		if (validateCreateUser(user,errors)){
			console.log('validate');
			console.log(user);
			var id = Accounts.createUser({
					username: user.username,
					password: user.password,
					email: user.email,
				});
			if (user.email){
				Accounts.sendVerificationEmail(id);
			}
			console.log('created user with id: ' + id);
			result = [true];
		}else{
			console.log('not validate user');
			result = [false, errors];
		}
		return result;
	},
	userUpdate: function(user_id,params){
		params.avatar = params.img;
		params = _(params).omit(['img','imgDefault','bannerDefault','tagsAllow']);
		return Meteor.users.update(user_id,{$set: params});
	},
	checkEmail: function(address){
		var usersWithEmails = Meteor.users.find({emails: {$exists: true}},{fields: {emails: 1}}).fetch();
		return _(usersWithEmails).all(function(u){
			return _(u.emails).all(function(e){
				return e.address !== address;
			});
		});
	}
});

Meteor.startup(function(){
	process.env.MAIL_URL = 'smtp://postmaster%40sandbox0e3723bcf7de4d528545792928d56381.mailgun.org:e0c89ff84b3f5ccdd42562bd0d8aa51f@smtp.mailgun.org:587';

	UserStatus.events.on('connectionLogout',function(fields){
		//aquí cada vez que se desconecte un usuario se borraran los datos pertinentes.
	});
	Accounts.emailTemplates.siteName = "DuckFlight";
	Accounts.emailTemplates.from = "DuckFlight <duckflight.team@gmail.com>";

	Accounts.emailTemplates.verifyEmail = {
		subject: function() {
			return '[DuckFlight] Verification Email Process.';
		},
		text: function(user,url) {
			var linkUrl = Meteor.absoluteUrl() + url.split('#/')[1];
			var supportEmail   = "duckflight.team@gmail.com";
			var emailBody      = 'To verify your email address visit the following link:\n\n' + linkUrl
							     + '\n\n Please, do not answer this message!. If you feel something is wrong,'
								 + ' please contact our support team: ' + supportEmail;

			return emailBody;
		}
	};
	Accounts.emailTemplates.resetPassword = {
		subject: function() {
			return '[DuckFlight] Reset Password Process.';
		},
		text: function(user,url) {
			var linkUrl = Meteor.absoluteUrl() + url.split('#/')[1];
			var supportEmail   = "duckflight.team@gmail.com";
			var emailBody      = 'To reset your password visit the following link:\n\n' + linkUrl
				+ '\n\n Please, do not answer this message!. If you feel something is wrong,'
				+ ' please contact our support team: ' + supportEmail;

			return emailBody;
		}
	}
});

Accounts.onCreateUser(function(options,user){
	user.banner = '/banner.jpeg';
	if(options.profile){
		user.username = options.profile.name;
		var userService = {service: _(user.services).keys()[0]}
		if (userService.service){
			var service = user.services[userService.service]
			userService.id = service.id;
			if (service.emails){
				user.emails = [];
				_(service.emails).each(function(email){
					var emailObject = {
						address: email.email,
						verified: (email.verified)? true : false
					};
					user.emails.push(emailObject);
				});
			}
			if (service.email){
				user.emails = [{
					address: service.email,
					verified: (service.verified_email)? true: false
				}];
				user.avatar = service.picture || null;
			}
		}
		if (!user.avatar){
			user.avatar = get_avatar_from_service(userService,100);
		}
	}else{
		user.avatar = '/usericon.png';
	}
	return user;
});