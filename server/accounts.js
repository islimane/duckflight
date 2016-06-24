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