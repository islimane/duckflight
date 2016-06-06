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