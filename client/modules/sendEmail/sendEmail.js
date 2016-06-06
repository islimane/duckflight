Template.sendEmail.helpers({
    hasEmailsVerified: function(){
        return _(this.user.emails).any(function(email){return email.verified;});
    },
    emailsVerified: function(){
        return _(this.user.emails).filter(function(email){return email.verified;});
    },
    emailFrom: function(){
        return Session.get('emailFrom');
    },
    sending: function(){return Session.get('sending');},
    sent: function(){return Session.get('sent');},
    submit: function(){return Session.get('submit');}
});


Template.sendEmail.events({
    'click #add-mails': function(){
        Router.go('profileEdit', {_id: this.user._id});
    },
    'click #verify-mails': function(){
        Router.go('verificationEmail');
    },
    'click #done-button': function(){
        Router.go('profile',{_id: Meteor.userId()},{query: 'initialSection=channelsTabContent'});
    },
    'click #try-again-button': function(){
        Session.set('sending',true);
        Meteor.call('sendMail',Session.get('currentMail'),function(err){
            if (err){
                console.log('ha ocurrido un error');
            }else{
                Session.set('sent',true);
                console.log('mensaje enviado');
            }
            Session.set('sending',false);
        });
    }
});

Template.sendEmail.created = function(){
    if(this.data.userToSend) Session.set('userToSend',this.data.userToSend);
};

Template.sendEmail.rendered = function(){
    console.log(this.data);
    Session.set('memberList',[]);
    Session.set('emailFrom',null);
    Session.set('submit',false);
    Session.set('sending',false);
    Session.set('sent',false);
    Session.set('currentMail',null);
};

Template.sendEmail.destroyed = function(){
    Session.set('memberList',null);
    Session.set('emailFrom',null);
    Session.set('userToSend',null);
    Session.set('submit',null);
    Session.set('sending',null);
    Session.set('sent',null);
    Session.set('currentMail',null);
};

Template.emailItemChoose.events({
    'click button': function(){
        Session.set('emailFrom', this.address);
    }
});

Template.emailWritter.helpers({
    error: function(){
        return Session.get('msgError');
    }
});

Template.emailWritter.events({
    'click #change-from': function(){
        Session.set('emailFrom', null);
    },
    'submit #email-writter-form': function(e,template){
        e.preventDefault();
        Session.set('msgError', '');
        var usersTo = Session.get('memberList');
        if (usersTo.length){
            var addresses = [];
            _(usersTo).each(function(u){
                var emailVerified = _(u.emails).find(function(e){return e.verified;});
                if (emailVerified) addresses.push(emailVerified.address);
            });
            console.log(addresses);
            var bodyHTML = $('#editor-mail').froalaEditor('html.get',true);
            if (bodyHTML){
                var subject = template.find('[name=subject]').value;
                var emailFrom = Session.get('emailFrom');
                var mailObj = {
                    from: emailFrom,
                    to: addresses,
                    subject: subject,
                    html: bodyHTML
                };
                Session.set('currentMail',mailObj);
                Session.set('sending',true);
                Meteor.call('sendMail',mailObj,function(err){
                    if (err){
                        console.log('ha ocurrido un error');
                    }else{
                        Session.set('sent',true);
                        console.log('mensaje enviado');
                    }
                    Session.set('sending',false);
                });
                Session.set('submit',true);
            }else{
                Session.set('msgError','Sorry, mail must have body!');
            }
        }else{
            Session.set('msgError','Please, choose at least one user to send the mail!');
        }

    }
});

Template.emailWritter.rendered = function(){
    Session.set('msgError', null);
    var toolbarButtons = ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough',
        'fontFamily', 'fontSize', '|', 'color', 'emoticons',
        'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL',
        'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage',
        'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'];

    $('#editor-mail').froalaEditor({
        charCounterCount: false,
        toolbarButtons: toolbarButtons,
        toolbarButtonsMD: toolbarButtons,
        toolbarButtonsSM: toolbarButtons,
        toolbarButtonsXS: toolbarButtons
    });
};

Template.emailWritter.destroyed = function(){
    Session.set('msgError',null);
}