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
    clientId: '369962061996-5l48ln1bonadiqgco7371spntgarruvq.apps.googleusercontent.com',
    secret: 'MKS3tm4T4aswTtbftAGMqK0S',
    redirect_uri: 'http://localhost:3000/_oauth/google?close'
});

ServiceConfiguration.configurations.remove({
    service: 'github'
});

ServiceConfiguration.configurations.insert({
    service: 'github',
    clientId: '08826f0c7dce0c9a43b7',
    secret: '9d64576e4d40817ef5f5a3d4c7647365f6b9c73a'
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
    'sendRecoverLink': function(userId,emailAddress){
        return Accounts.sendResetPasswordEmail(userId,emailAddress);
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