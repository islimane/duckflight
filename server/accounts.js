ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1598767410444560',
    secret: '012939ffb32f5acd5c14716586dbda46'
});

ServiceConfiguration.configurations.remove({
    service: 'google'
});

ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: '313319360046-1mm2i40e6ud93n4r7otu98tlsp7g9cp3.apps.googleusercontent.com',
    secret: 'gjIWwpkyPcTbeCpUWaK4SEGT'
});

Meteor.methods({
    'getUserToVerify': function(username){
        var user = Meteor.users.findOne({username: username});
        if (!user) throw new Meteor.Error('incorrect username!');
        return user;
    },
    'sendVerificationLink': function(userId,emailAddress) {
        return Accounts.sendVerificationEmail(userId,emailAddress);
    },
    'checkPassword': function(passwordString) {
        if (Meteor.user()) {
            var user = Meteor.user();
            var digest = Package.sha.SHA256(passwordString);
            var password = {digest: digest, algorithm: 'sha-256'};
            var result = Accounts._checkPassword(user, password);
            return (result.error == null)? passwordString : null;
        } else {
            return false;
        }
    }
})