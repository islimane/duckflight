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