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

Template.signUpForm.events({
	'click a': function(){
		Session.set('formType','signInForm');
	},
	"submit form": function(e){
		e.preventDefault();
		$('div').removeClass("has-error"); //eliminamos el estado de error de los campos.
		$('.errormsg').remove();

		console.log("he hecho click en sign up");
		var username = $(e.target).find("[name=username]").val();
		var email = $(e.target).find("[name=email]").val();
		var password = $(e.target).find("[name=password]").val();
		var repassword = $(e.target).find("[name=repassword]").val();
		
		//de momento vamos a ver que las passwords sean iguales para validar.
		//El crear un nuevo usuario sería mejor llamar a un meteor method. Para que se encarge el server 
		//de crear el nuevo usuario.
		Meteor.call('signUp',
			{username: username,
			email: email,
			password: password,
			repassword: repassword},
			function(err,result){
				if (err){
					console.log("ha habido un error al crear el usuario");
				}else{
					if (result.length > 1){ //errores en el formulario.
						console.log("hay errores en el formulario");
						var errors = result[1];
						if (errors.username){
							$('#inputUsername').addClass('has-error');
							$('#inputUsername').append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i> username already exists!</p>");
						}
						if(errors.email){
							$('#inputEmail').addClass('has-error');
							$('#inputEmail').append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i> email already exists!</p>");
						}
						if(errors.password){
							$("#inputPassword").addClass("has-error");
							$("#inputPassword").append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i> password be at least 6 chars!</p>");
						}
						if(errors.repassword){
							$("#inputRepassword").addClass('has-error');
							$("#inputRepassword").append("<p class='errormsg'><i class='fa fa-exclamation-triangle'></i>passwords do not match!</p>");
						}
					}else{//se ha creado satisfactoriamente el usuario.
						Session.set('signing',true);
						Meteor.loginWithPassword({username: username},password,function(err){
							if(err)console.log('error al logear al nuevo usuario');
							Session.set('signing',false);
						});
					}
				}

			});
	}
});