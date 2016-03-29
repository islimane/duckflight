Template.signInForm.helpers({
	isLogin: function(){
		return Session.get('isLogin');
	}
})

Template.signInForm.events({
	"click #signUp": function(){
		Session.set("formType",'signUpForm');
	},

	"click #forgot": function(){
		Session.set("formType", 'forgotPasswordForm');
	},

	"submit form": function(e){
		Session.set('isLogin',true);
		e.preventDefault();
		$("div").removeClass("has-error");
		$(".errormsg").remove();
		console.log("he hecho click en sign in");
		var identifier = $(e.target).find("[name=username]").val();
		var password = $(e.target).find("[name=password]").val();
		var userContext = (new RegExp('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$').exec(identifier))? {email: identifier} : {username: identifier};
		Meteor.loginWithPassword(userContext,password,function(err){
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
				console.log("usuario logueado");
			}
			Session.set('isLogin',false);
		});
	}
});

Template.signInForm.rendered = function(){
	Session.set('isLogin',false);
};