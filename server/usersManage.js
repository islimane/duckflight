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