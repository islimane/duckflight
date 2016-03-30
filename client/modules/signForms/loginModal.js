Template.loginModal.helpers({
    signing: function(){return Session.get('signing')}
});

Template.loginModal.rendered = function(){
    $("#loginForm").modal('hide');
    Session.set('formType','signInForm');

    $('#loginForm').on('hidden.bs.modal', function (){
        Session.set('formType','signInForm');
    });
};