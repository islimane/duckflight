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

RecordPlayer = function(){

//VARIABLES
    var $audio,
        $progress,
        $seeker,
        $playedProgress,
        $timer,
        $touchScreenWrapper,
        $playerActionsWrapper,
        $playerHelpWrapper,
        intervalAudio,
        duration,
        editorManager,
        ended,
        RCP;
//FUNCTIONS
    function getCurrentTime(){
        var d = new Date($audio.currentTime());
        return {
            min: (d.getMinutes() > 9)? '' + d.getMinutes(): '0' + d.getMinutes(),
            sec: (d.getSeconds() > 9)? '' + d.getSeconds(): '0' + d.getSeconds()
        };
    };

    function updatePlayer(){
        var current = getCurrentTime();
        Session.set('currentInstant',$audio.currentTime());
        $timer.text(current.min + ':' + current.sec);
        $seeker.width($progress.width());
        var progressVal = ($audio.currentTime() * 100) / duration;
        $progress.val(progressVal);
        $playedProgress.width(($progress.width() * progressVal)/100 + 1);
        if(Session.get('playing')) editorManager.update($audio.currentTime());
    }
    function changeStatePlayer(){
        ($touchScreenWrapper.hasClass('active'))? $touchScreenWrapper.removeClass('active') : $touchScreenWrapper.addClass('active');
        ($playerActionsWrapper.hasClass('active'))? $playerActionsWrapper.removeClass('active') : $playerActionsWrapper.addClass('active');
        ($playerHelpWrapper.hasClass('active'))? $playerHelpWrapper.removeClass('active') : $playerHelpWrapper.addClass('active');

    }

//METHODS

    //INITIALIZATION

    this.initialize = function($elements,editorPlayer){
        $audio = $elements.stream;
        $progress = $elements.progress;
        $seeker = $elements.seeker;
        $playedProgress = $elements.playedProgress;
        $timer = $elements.timer;
        $touchScreenWrapper = $elements.touchScreenWrapper;
        $playerActionsWrapper = $elements.playerActionsWrapper;
        $playerHelpWrapper = $elements.playerHelpWrapper;
        Session.set('playing',false);
        Session.set('ended',false);
        Session.set('audioVolume','normal');
        $audio.volume = 0.4;
        duration = $elements.duration;
        editorManager = editorPlayer;
        RCP = this;
        $audio.on('finish',function(){
            this.seek(0);
            RCP.ended();
        });
        $audio.on('created',function(){
            $audio.seek(0);
        });
        $audio.on('metadata',function(){
            Session.set('errorLoad',false);
            Session.set('loading',false);
        });
        $audio.on('destroyed',function(){
            console.log('destroyed audio');
        });
        ended = false;
    };

    //MAIN METHODS
    this.setVolume = function(level){
        var newVol= level/10;
        if(newVol > 0.5){
            Session.set('audioVolume','hight');
        }else if(newVol == 0){
            Session.set('audioVolume','mute');
        }else{
            Session.set('audioVolume','normal');
        }
        $audio.setVolume(newVol);
    };

    this.updateCover = function($cover){
        ($touchScreenWrapper.hasClass('active')) ? this.pause() : this.play();

        $cover.find('button').addClass('active');
        window.setTimeout(function(){
            $cover.find('button').removeClass('active');
        },500);
    };

    this.play = function(){
        changeStatePlayer();
        Session.set('playing',true);
        Session.set('ended',false);
        $audio.play();
        if (!intervalAudio){
            intervalAudio = window.setInterval(updatePlayer,20);
        }
        ended = false;
    };

    this.pause = function(){
        changeStatePlayer();
        Session.set('playing',false);
        $audio.pause();
        while($audio._isPlaying) $audio.pause();
    };

    this.seek = function(pos){
        if (pos) $seeker.val((pos * 100)/duration);
        $audio.seek(($seeker.val() * duration)/100);
        updatePlayer();
        editorManager.seek($audio.currentTime());
    };

    this.ended = function(){
        changeStatePlayer();
        $playerActionsWrapper.addClass('active');
        $playedProgress.width(0);
        $progress.val(0);
        $seeker.val(0);
        window.clearInterval(intervalAudio);
        editorManager.seek(0);
        intervalAudio = null;
        Session.set('playing',false);
        Session.set('ended',true);
        $timer.text('00:00');
        ended = true;
    };

    this.getState = function(){
        var state = {
            docs: editorManager.getDocs(ended),
            docActual: editorManager.getDocActual(),
            currentTime: Math.round($audio.currentTime())
        };
        return state;
    };

    this.destroy = function(){
        $audio.pause();
        $audio = null;
        window.clearInterval(intervalAudio);
    };

};