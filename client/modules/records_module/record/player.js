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

Template.player.helpers({
    loading: function(){
        return Session.get('loading');
    },
    errorLoad: function(){
        return Session.get('errorLoad');
    },
    record: function(){
        return Records.findOne(this.recordId);
    },
    playing: function(){
        return Session.get('playing');
    },
    hVol:function(){
        return Session.get('audioVolume') === 'hight';
    },
    nVol: function(){
        return Session.get('audioVolume') === 'normal';
    },
    autoPlay: function(){
        return (!this.isReply) ? Meteor.user().auto_play : false;
    },
    autoRepeat: function(){
        return (!this.isReply)? Meteor.user().auto_repeat: false;
    },
    isEnded: function(){
        return Session.get('ended');
    },
    notPlayListEnded:function(){
        if (!this.isReply) {
            var section = Sections.findOne({_id: this.section_id});
            var records_section = Records.find({section_id: section._id});
            return Meteor.user().auto_repeat && this.order <= records_section.count() -1 ||
                   !Meteor.user().auto_repeat && this.order < records_section.count() -1;
        }
    },
    recordsPlayList: function(){
        return Records.find({section_id: this.section_id, isReply: false},{sort: {order: 1}});
    },
    records_count_PL: function(){
        return Records.find({section_id: this.section_id, isReply: false}).count();
    },
    section_title: function(){
        return Sections.findOne({_id: this.section_id}).title;
    },
    countDownData: function(){
        return {
            time: 15000,
            record: this
        }
    },
    seekByReply: function(){
        return Router.current().params.query.startInstant;
    }
});

Template.player.events({
    'click .player-help i': function(){
        $helpList = $('.player-help-items');
        ($helpList.hasClass('active'))? $helpList.removeClass('active') : $helpList.addClass('active');
    },
    'click #play': function(){
        this.recordPlayer.play();
    },
    'click #pause': function(){
        this.recordPlayer.pause();
    },
    'click #seeker': function(){
        this.recordPlayer.seek();
    },
    'click #volume': function(e){
        this.recordPlayer.setVolume($(e.target).val());
    },
    'click .cover': function(e) {
        this.recordPlayer.updateCover($(e.target));
    },
    'click #view-parent': function(){
        console.log(this);
        Router.go('record',{_id: this.parent_id},{query: 'startInstant=' + this.timeMark});
    },
    'click #browse-channel': function(){
        console.log(this);
        Router.go('channel', {_id: this.channel_id});
    },
    'click #browse-lesson': function(){
        Router.go('lesson', {_id: this.lesson_id});
    },
    'click #create-reply': function(){
        Session.set('dataRecordingObject',this.recordPlayer.getState());
        console.log(Session.get('dataRecordingObject'));
        console.log(this);
        var record = Records.findOne(this.recordId);
        console.log(record);
        var query = '';
        query += (record.channel_id)? 'channel=' + record.channel_id + '&' : '';
        query += (record.lesson_id)? 'lesson=' + record.lesson_id + '&' : '';
        query += (record.section_id)? 'section=' + record.section_id + '&' : '';
        query += 'parent=' + record._id;
        Router.go('recordSubmit',{},{query: query});
    },
    'click .nav-button-pl': function(e){
        var RecordsPLArray = Records.find({section_id: this.section_id,isReply: false},{sort: {order: 1}}).fetch();
        var currentIdx = parseInt(_(RecordsPLArray).find(function(elem){return elem._id == Session.get('currentRecordId');}).order);
        var index = 0;
        switch($(e.currentTarget)[0].id){
            case 'bw':
                console.log('bw');
                index = (Meteor.user().auto_repeat && this.order == 0)? RecordsPLArray.length -1 : currentIdx -1;
                break;
            case 'fw':
                console.log('fw');
                index = (Meteor.user().auto_repeat && this.order == RecordsPLArray.length -1) ? 0 : currentIdx + 1;
                break;
            case 'fast-fw':
                console.log('ffw');
                index = RecordsPLArray.length -1;
                break;
        }
        console.log(index);
        if(index <= RecordsPLArray.length -1 || index >= 0){
            var record_id = _(RecordsPLArray).find(function(elem){return elem.order == index;})._id;
            Router.go('record',{_id: record_id});
        }
    },
    'click #auto-play-set input': function(e){
        console.log($(e.currentTarget).is(':checked'));
        Meteor.call('updateSectionPlayOption',Meteor.userId(),'auto-play',$(e.currentTarget).is(':checked'));
    },
    'click #auto-repeat-set input': function(e){
        Meteor.call('updateSectionPlayOption',Meteor.userId(),'auto-repeat',$(e.currentTarget).is(':checked'));
    },
    'click #yes': function(){
        this.recordPlayer.seek(parseFloat(Router.current().params.query.startInstant));
        $('.seek-reply-dialog').fadeOut();
    },
    'click #no': function(){
        $('.seek-reply-dialog').fadeOut();
    }
});
Template.player.created = function(){
    Session.set('loading',true);
    Session.set('errorLoad',true);
};

Template.player.rendered = function(){
    var recordPlayer = this.data.recordPlayer;
    var editorPlayerManager = this.data.editorPlayerManager;
    var record = Records.findOne(this.data.recordId);
    var trackId = this.data.trackId;
    $('.seek-reply-dialog').fadeIn();

    //SoundCloud initialization.
    Meteor.call('getClientSC',function(err,res){
        if(res){
            console.log(res);
            SC.initialize({
                client_id: res.client_id,
                redirect_uri: res.redirect_uri,
                oauth_token: res.access_token,
                scope: 'non-expiring'
            });
            //SoundCloud connect process.
            SC.connect().then(function(){
                SC.stream('/tracks/' + trackId).then(function(s){
                    console.log(s);
                    //params to recordPlayer
                    var $elements = {
                        playButton: $('#play'),
                        pauseButton: $('#pause'),
                        progress: $('#progress'),
                        seeker: $('#seeker'),
                        playedProgress: $('#played-bar'),
                        timer: $('#timer'),
                        touchScreenWrapper: $('.touch'),
                        playerActionsWrapper: $('.player-actions'),
                        playerHelpWrapper: $('.player-help')
                    };

                    //params to editorPlayer
                    var editorParams = {
                        id: 'editor',
                        startDocs: Documents.find({start: true},{params: {doc: 1}}).fetch(),
                        finishDocs: Documents.find({start: false},{params: {doc: 1}}).fetch(),
                        RC: record.RC
                    };

                    $elements.stream = s;
                    $elements.duration = s.options.duration;

                    editorPlayerManager.initialize(editorParams);
                    recordPlayer.initialize($elements,editorPlayerManager);
                    recordPlayer.play();

                }).catch(function(error){
                    Session.set('loading',false);
                    console.log(error);
                });
            });
        }
    });







};

Template.player.destroyed = function(){
    this.data.recordPlayer.destroy();
    Session.set('currentRecordId',null);
    Session.set('loading',null);
    Session.set('errorLoad',null);
};

Template.recordItemPlayList.helpers({
    active: function(){
        return (Session.get('currentRecordId') == this._id)? 'active': '';
    }
});

Template.recordItemPlayList.events({
    'click .record-item-play-list': function(){
        Router.go('record',{_id: this._id});
    }
});

Template.countDown.helpers({
    timeOut: function(){
        return Session.get('timeOut');
    }
});

Template.countDown.events({
    'click #cancel-auto-play': function(){
        Session.set('ended',false);
        this.countDownManager.abort();
    },
    'click #next': function(){
        var RecordsPLArray = Records.find({section_id: this.objectCountDown.record.section_id,isReply: false},{sort: {order: 1}}).fetch();
        var currentIdx = parseInt(this.objectCountDown.record.order);
        var index = (Meteor.user().auto_repeat &&  currentIdx == RecordsPLArray.length -1) ? 0 : currentIdx + 1;
        if(index <= RecordsPLArray.length -1 || index >= 0){
            var record_id = _(RecordsPLArray).find(function(elem){return elem.order == index;})._id;
            Router.go('record',{_id: record_id});
        }
    }
});

Template.countDown.rendered = function(){
    $('.seek-reply-dialog').hide();
    var CountDownObject = function(){
        var interval,
            record,
            currentTime;
        this.initialize = function(object){
            interval = null;
            currentTime = object.time;
            record = object.record;
            console.log(currentTime);
        };
        this.start = function(){
            Session.set('timeOut',currentTime/1000);
            interval = window.setInterval(this.loop,1000);
        };
        this.loop = function(){
            console.log(currentTime);
            if(currentTime/1000 == 0){
                window.clearInterval(interval);
                console.log('ya ha terminado me voy al record');
                $('#next').click();
            }else{
                currentTime = currentTime - 1000;
                Session.set('timeOut',currentTime/1000);
            }
        };
        this.abort = function(){
            window.clearInterval(interval);
            Session.set('ended',false);
            $('.seek-reply-dialog').fadeIn();
        };
    };
    Session.set('timeOut',null);
    this.data.countDownManager = new CountDownObject();
    this.data.countDownManager.initialize(this.data.objectCountDown);
    this.data.countDownManager.start();
};

Template.countDown.destroyed = function(){
    Session.set('timeOut',null);
    this.data.countDownManager.abort();
};