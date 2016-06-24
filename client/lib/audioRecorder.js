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

AudioRecorder = function(){
    var r = /([^&=]+)=?([^&]*)/g;
    var params = {};
    var recorder;
    var audioStream;
    var currentTime = 0;
    var interval;
    var $timer;

    this.initialize = function(){

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }

        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);

        window.params = params;

        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    };
    this.isSupported = function(){
        return navigator.getUserMedia;
    };
    this.startRecording = function(callback){

        var audioConstraints = {
            audio: true,
            video: false
        };
        if (!this.recorder){
            navigator.getUserMedia(audioConstraints,
                function(stream){
                    audioStream = stream;
                    recorder = window.RecordRTC(stream,{
                        type: 'audio/webm',
                        bufferSize: typeof params.bufferSize == 'undefined' ? 16384 : params.bufferSize,
                        sampleRate: typeof params.sampleRate == 'undefined' ? 44100 : params.sampleRate,
                        leftChannel: params.leftChannel || false,
                        disableLogs: params.disableLogs || false
                    });
                    recorder.startRecording();
                    callback();
                },
                function(err){
                    console.log('getUserMedia ERROR: ' + err.reason);
                }
            );
        }else{
            audioStream.start();
            recorder.startRecording();
            callback();
        }
    };

    this.startProgress = function(timerElem){
        $timer = timerElem;
        this.loop();
    };

    this.loop = function(){
        var d = new Date(currentTime * 1000);
        var minuto = (d.getMinutes()<=9)?"0"+d.getMinutes():d.getMinutes();
        var segundo = (d.getSeconds()<=9)?"0"+d.getSeconds():d.getSeconds();
        if (currentTime == 3600){
            $('#stop-button').click();
        }else{
            $timer.text(minuto + ':' + segundo);
            currentTime ++;
            interval = window.setInterval(this.loop,1000); //se ejecutara cada seg.
        }

    };

    this.getCurrentTime = function(){
        return currentTime * 1000;
    };

    this.stopProgress = function(){
        currentTime = 0;
        $timer.text(currentTime);
        window.clearInterval(interval);
    };

    this.stopRecording = function(reactiveVar, callback){
        this.stopProgress();
        if(recorder){
            recorder.stopRecording(function(){
                reactiveVar.set(recorder.blob);
                audioStream.stop();
                (callback)? callback() : null;
            });
        }
    };
};