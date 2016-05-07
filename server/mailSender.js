Meteor.methods({
    sendMail: function(mailObj){
        return Email.send(mailObj);
    }
});