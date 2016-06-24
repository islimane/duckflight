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

/*var SoundCloudObject = function(){
    var soundCloudObj = Soundcloud;
    var soundCloudUser = {
        username: 'duckflight',
        password: 'J.ortegamo_92'
    };
    var soundcloudAPIs = [
        {
            root_url: 'http://localhost:3000',
            config: {
                client_id: "9f2574ebd5266f995dca197f71cba11b",
                client_secret: "e4aa263a4e4daaf50d984282315ab37d",
            },
        },
        {
            root_url: 'http://herokuapp.duckflight',
            client_id: "9f2574ebd5266f995dca197f71cba11b",
            client_secret: "e4aa263a4e4daaf50d984282315ab37d",
        }
    ];
    this.initialize = function(){
        var apiConfig = _(soundcloudAPIs).find(function(api){ return api.root_url == Meteor.absoluteUrl();});
        _(apiConfig).extend(soundCloudUser);
        soundCloudObj.setConfig(apiConfig);
    };
    this.getClient = function(){
        soundCloudObj.getClient();
    };
    this.getRedirectUri = function(){
        return Meteor.absoluteUrl() + 'redirect';
    };
};*/

CLIENT_SC_ID = "9f2574ebd5266f995dca197f71cba11b";
CLIENT_SC_SECRET = "e4aa263a4e4daaf50d984282315ab37d";
REDIRECT_URI = 'http://localhost:3000/redirect';
USERNAME_SC = 'duckflight';
PASSWORD_SC = 'J.ortegamo_92';

/*var SoundCloudObject = new SoundCloudObject();
SoundcloudObject.initialize();*/

Soundcloud.setConfig({
    client_id : CLIENT_SC_ID,
    client_secret : CLIENT_SC_SECRET,
    username : USERNAME_SC,
    password: PASSWORD_SC
});

Meteor.methods({
    getClientSC: function(){
        var clientSC = Soundcloud.getClient();
        var client = {
           client_id: CLIENT_SC_ID,
           access_token: clientSC.settings.access_token
        };
        return client;
    },
    deleteTrackSC: function(id){
        var client = Soundcloud.getClient();

        client.deleteAsync('/tracks/' + id,function(err){
            if (err) throw new Meteor.Error(err.statusCode,'is Not possible delete track');
        });
    }
});