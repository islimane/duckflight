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

var editor = "";
var date;
var recorder;
var currentAudio;
var docsManagerRecorder;

/**
 * DocsManagerRecorder: Organize all functions with docs.
 * @constructor
 */
var DocsManagerRecorder = function(){
    var startDocsValue = [];
    var docs, docsRC;
    var functions;

    //constructor para documentos.
    var Doc = function(title,mode,theme,value){
        this.title = title;
        this.mode = (mode) ?  "ace/mode/" + mode : "ace/mode/javascript";
        this.theme = (theme)? "ace/theme/" + theme : "ace/theme/twilight";
        this.value = value || "";
    };
    var copyDocs = function(array1,array2){
        _(array1).each(function (doc) {
            array2.push(new Doc(doc.title, doc.mode.split('/')[2], doc.theme.split('/')[2], doc.value));
        });
        return array2;
    };

    this.initialize = function(startDocsVal){
        //hago una copia para despues almacenar los iniciales.
        Session.set("titleAct","");
        if(startDocsVal.length) startDocsValue = copyDocs(startDocsVal,[]);
        docs = new ReactiveVar(startDocsVal);
        console.log(docs);
        docsRC = new ReactiveVar([]);
        functions = [];
    };
    this.isTitleValid = function(title){
        var arrayDocs = (Session.get('recording'))? docsRC : docs;
        return _(arrayDocs.get()).all(function(doc){
            return doc.title != title;
        });
    };
    this.createDoc = function(title,mode,theme,value){
        var nDoc = new Doc(title,mode,theme,value);
        var ObjectDocs = (Session.get('recording'))? docsRC : docs;
        var array = ObjectDocs.get();
        array.push(nDoc);
        ObjectDocs.set(array);
    };
    this.copyDocsFromCollection = function(){
        var arrayDocsCollection = Documents.find({}).fetch();
        var array = [];
        _(arrayDocsCollection).each(function(elem){
           array.push(
             new Doc(elem.doc.title,
                elem.doc.mode.split('/')[2],
                elem.doc.theme.split('/')[2],
                elem.doc.value)
           );
        });
        return array;
    };
    this.copyDocsToRecording = function(){
        var arrayDocs = copyDocs(docs.get(),docsRC.get());
        docsRC.set(arrayDocs);
    };

    this.getDocs = function(){
        return (Session.get('recording'))? docsRC : docs;
    };

    this.getDocsCount = function(){
        return docsRC.get().length;
    };

    this.getFunctions = function(){
        return functions;
    };

    this.saveDocs = function(record_id){
        Meteor.call('insertDocs',docs.get(),record_id,true,function(err){
            if(err) console.log('insertDocs ERROR: ' + err.reason);
        });
        Meteor.call('insertDocs',docsRC.get(),record_id,false,function(err){
            if(err) console.log('insertDocsRC ERROR: ' + err.reason);
        });
    };

    this.updateDoc = function(titlePrev,newTitle,mode,theme){
        var objDocs = (Session.get('recording'))? docsRC: docs;
        var docsArray = objDocs.get();
        _(docsArray).each(function(doc){
            if(doc.title == titlePrev){
                doc.title = newTitle;
                doc.mode = "ace/mode/" + mode;
                doc.theme = "ace/theme/" + theme;
            }
        });
        objDocs.set(docsArray);
        Session.set('titleAct',newTitle);
    };

    this.saveValue = function(title,value){
        var objDocs = (Session.get('recording'))? docsRC : docs;
        var arrayDocs = objDocs.get();
        _(arrayDocs).each(function (doc) {
            if(doc.title == title) doc.value = value;
        });
        objDocs.set(arrayDocs);
    };

    this.insertFunctions = function(arrayFunctions){
        _(arrayFunctions).each(function(func){functions.push(func);});
    };

    this.reset = function(){
        Session.set("titleAct","");
        docs.set([]);
        docs.set(startDocsValue);
        docsRC.set([]);
        functions = [];
    }
};



/**
 * UPLOAD PANEL
 */
Template.uploadPanel.helpers({
    uploaded: function(){
        return Session.get('uploaded');
    }
});

Template.uploadPanel.events({
    'click button': function(){
        Router.go('record',{_id: Session.get('uploadedRecordId')});
    }
});

Template.uploadPanel.created = function(){
    Session.set('uploaded',false);
};

Template.uploadPanel.destroyed = function(){
    Session.set('uploaded',null);
    Session.get('uploadedRecordId',null);
};
//DOCUMENTOS


/**
 * DOCENTRY
 */
Template.docEntry.helpers({
    shortTitle: function(title,max){
        return ellipsis(title,max);
    },
    optionTag: function(option){
        return option.split('/')[2];
    }
});

Template.docEntry.events({

    'click .doc-item': function(e){
        $('.doc-item').removeClass('selected');
        $(e.currentTarget).addClass('selected');
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
        if (Session.get('recording')){ //si está grabando hay que mostrar los cambios de documentos.
            docsManagerRecorder.insertFunctions([
                {
                    time: new Date() - date,
                    type: 'session',
                    arg: this.title
                }
            ]);
        }

        editor.focus();
        editor.setTheme(this.theme);
        editor.getSession().setMode(this.mode);
        editor.setValue(this.value);
        Session.set('titleAct',this.title);
        $('.documents-editor').removeClass('active');

        if ($(e.target).hasClass('config-doc')){
            Session.set('createDoc',false);
            Session.set('editDoc',this.title);
            var formDocEditor = $('.form-doc-editor').addClass('active');
            formDocEditor.find('[name="title"]').focus().val(this.title);

            var docItem = this;
            var optMode = _($('.lang')).find(function(option){return "ace/mode/" + $(option)[0].id == docItem.mode;});
            $('.lang').removeClass('active');
            $(optMode).addClass('active');

            var optTheme = _($('.theme')).find(function(option){return "ace/theme/" + $(option)[0].id == docItem.theme;});
            $('.theme').removeClass('active');
            $(optTheme).addClass('active');
        }else{
            var docForm = $('.form-doc-editor');
            docForm.find('[name="title"]').val('');
            docForm.find('.lang').removeClass('active');
            docForm.find('.theme').removeClass('active');
            docForm.removeClass('active');
            Session.set('editDoc','');
            Session.set('createDoc',false);
        }
    }
});


Template.docEntry.rendered = function(){
    $('.doc-item').removeClass('selected');
    $(this.firstNode).addClass('selected');
    console.log(editor);
    if (!editor){
        console.log('no hay editor');
        editor = ace.edit("editor-recorder");
        editor.setShowPrintMargin(false);
    }else{
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
    }
    editor.setValue(this.data.value);
    editor.setTheme(this.data.theme);
    editor.getSession().setMode(this.data.mode);
    editor.setShowPrintMargin(false);

    Session.set('titleAct',this.data.title);

    var docs = docsManagerRecorder.getDocs().get();
    var index = _(docs).indexOf(this.data);

    if (Router.current().params.query &&
        Router.current().params.query.parent &&
        Session.get('startDocument') &&
        !Session.get('loadedDocuments')){
        //cuando se trata de una respuesta en la que hay un documento inicial y no se han cargado los documentos.
        if(index == docs.length -1){
            //cojo el documenot de inicio y lo selecciono estableciendo su contenido en el editor.
            var initialDoc = Session.get('startDocument');
            $('.doc-item').removeClass('selected');
            var indexInitial = _(docs).indexOf(_(docs).find(function(d){return d.title == initialDoc.title;}));
            $($('.doc-item')[indexInitial]).addClass('selected');
            editor.setValue(initialDoc.value);
            editor.setTheme(initialDoc.theme);
            editor.getSession().setMode(initialDoc.mode);
            editor.setShowPrintMargin(false);

            Session.set('titleAct',initialDoc.title);
            Session.set('loadedDocuments',true);
        }
    }
};

//ACTIONS
Template.startRecord.helpers({
    notSelected: function(){
        console.log(Session.get('titleAct'));
        return Session.get('titleAct') === '';
    }
});

Template.recordProgressBar.rendered = function(){
    recorder.startProgress($('#timer'));
};

/**
 * RECORD SUBMIT
 */

Template.recordSubmit.helpers ({
    'titleAct': function(){
        console.log(Session.get('titleAct'));
        return Session.get('titleAct');
    },
    'recording': function(){
        return Session.get("recording");
    },
    'stop': function(){
        return Session.get("stop");
    },
    hasDocs: function(){
        return docsManagerRecorder.getDocs().get().length > 0 && !Session.get('stop');
    },
    createDoc: function(){
        return Session.get('createDoc');
    },
    editDoc: function(){
        return Session.get('editDoc');
    },
    documents: function(){
        return docsManagerRecorder.getDocs().get();
    },
    uploading: function(){
        return Session.get('uploading');
    },
    loadingRecorder: function(){
        return Session.get('loading');
    },
    supported: function(){
        return Session.get('supported');
    },
    helpEntries: function(){
        return [
            {text: 'How can I create a recording?', url: 'tutorials?section=records-section&subsection=1'},
            {text: 'How can I upload my recording?', url: 'tutorials?section=records-section&subsection=2'}
        ];
    }
});

Template.recordSubmit.events = {
    'click #explore-documents': function(){
        $('.documents-editor').addClass('active');
    },
    'click #close': function(){
        $('.documents-editor').removeClass('active');
    },
    'click #add-document': function() {
        if (!Session.get('stop')){
            Session.set('editDoc','');
            Session.set('createDoc',true); //creating no editing
            var docForm = $('.form-doc-editor');
            docForm.addClass('active');
            docForm.find('[name="title"]').val('').blur();
            docForm.find('.lang').removeClass('active');
            docForm.find('.theme').removeClass('active');
            $('.form-body').animate(
                {scrollTop: - $('.form-body').height()},
                '500',
                'swing',
                function(){console.log('finish');}
            );
        }
    },

    'click .lang': function(e){
        $('.lang').removeClass('active');
        $(e.currentTarget).addClass('active');
    },

    'click .theme': function(e){
        $('.theme').removeClass('active');
        $(e.currentTarget).addClass('active');
    },

    'submit .form-editor': function(e){
        e.preventDefault();
        var title = $(e.target).find('[name="title"]').val();
        var mode = $(e.target).find('.lang.active')[0].id;
        var theme = $(e.target).find('.theme.active')[0].id;

        var validTitle = false;
        if (Session.get('createDoc')){
            // We are creating the record document
            // before starting to record
            validTitle = docsManagerRecorder.isTitleValid(title);
            if (validTitle){
                docsManagerRecorder.createDoc(title,mode,theme);

                if (Session.get('recording')){
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            type: 'newDoc',
                            arg: [title,mode,theme]
                        },
                        {
                            time: new Date() - date,
                            type: 'session',
                            arg: title
                        }
                    ]);
                }
            }else{
                $('.title-document-input').append('<p class="errormsg">Sorry, already exists a document with this title!</p>');
                $('.form-body').animate(
                    {scrollTop: - $('.form-body').height()},
                    '500',
                    'swing',
                    function(){console.log('finish');}
                );
            }
        }else{
            validTitle = (Session.get('editDoc') == title)? true : docsManagerRecorder.isTitleValid(title);
            if (validTitle){
                docsManagerRecorder.updateDoc(Session.get('editDoc'),title,mode,theme);
                editor.setTheme("ace/theme/" + theme);
                editor.getSession().setMode("ace/mode/" + mode);

                if(Session.get('recording')){
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            type: 'editDoc',
                            arg: [Session.get('editDoc'),title,mode,theme]
                        },
                        { //solo si se le aplica a un documento durante la grabacion
                            time: new Date() - date,
                            type: 'mode',
                            arg: mode,
                            toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
                        },
                        { //solo si se le aplica a un documento durante la grabacion
                            time: new Date() - date,
                            type: 'theme',
                            arg: theme,
                            toDo: 'editor.setTheme("ace/theme/" + arg)'
                        }
                    ]);
                }

            }else{
                $('.title-document-input').append('<p class="errormsg">Sorry, already exists a document with this title!</p>');
                $('.form-body').animate(
                    {scrollTop: - $('.form-body').height()},
                    '500',
                    'swing',
                    function(){console.log('finish');}
                );
            }
        }

        if(validTitle){
            var docForm = $('.form-doc-editor');
            docForm.find('[name="title"]').val('');
            docForm.find('.lang').removeClass('active');
            docForm.find('.theme').removeClass('active');
            docForm.removeClass('active');
            $('.documents-editor').removeClass('active');
            Session.set('editDoc','');
            $(".errormsg").remove();
        }

    },

    'click #cancel': function(){
        var docForm = $('.form-doc-editor');
        docForm.find('[name="title"]').val('');
        docForm.find('.lang').removeClass('active');
        docForm.find('.theme').removeClass('active');
        docForm.removeClass('active');
        Session.set('editDoc','');
        Session.set('createDoc',false);
        $(".errormsg").remove();
    },

    'click #record-button': function(){
        var title = Session.get('titleAct');

        if(docsManagerRecorder.getDocs().get().length > 0 && title) { //recording is not able when there's not any document created!!

            docsManagerRecorder.saveValue(title, editor.getValue());
            docsManagerRecorder.copyDocsToRecording();
            docsManagerRecorder.insertFunctions([{
                time: new Date() - new Date(), //se ejecutará la primera.
                type: 'session',
                arg: title
            }]);

            recorder.startRecording(function(){
                Session.set('recording',true);
            });
        }
    },

    'click #stop-button': function(){
        //updating doc when recording process is finished!
        Session.set('audioDuration', recorder.getCurrentTime());
        console.log(Session.get('audioDuration'));
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
        Session.set("stop",true);
        Session.set("recording",false);
        $('.doc-item').removeClass('selected');
        $('#editor-recorder').removeClass('active');
        recorder.stopRecording(currentAudio,function(){console.log('stop recording success!');});
        Session.set('formType','saveRecordForm');
    },

    'click #discard-record': function(){ //dejo en estado inicial.
        Session.set("stop",false);
        Session.set('formType','formDoc');
        editor = '';
        if(this.parent_id && this.dataRecordObject){
            Session.set('loadedDocuments',false);
        }
        docsManagerRecorder.reset();
    },

    'submit #saveForm': function(e){
        //aqui compongo el objeto grabacion y lo guardo en la base de datos.
        //el titulo no tiene porqué ser unico.
        //pero debe de tener un título.
        e.preventDefault();
        console.log(docsManagerRecorder.getFunctions());
        success = true;
        var title = $(e.target).find("[name=title]").val();
        if (!title ){
            success = false;
            $("#inputTitle").addClass("has-error");
            $("#inputTitle").append('<p class="errormsg">Record must have a title!</p>');
        }else{
            $("#inputTitle").removeClass("has-error");
            $(".errormsg").remove();
        }
        var description = $(e.target).find("[name=description]").val();

        if (success){ //solo si se ha guardado correctamente. (solo depende del titulo).
            $('#savePanel').modal('hide');
            console.log('voy a upload');
            var record = {
                title: title,
                description: description,
                tags: Session.get('tagsChoosen'),
                author: Meteor.userId(),
                img: '/recordImgDefault.png',
                createdAt: new Date(),
                docs_count: docsManagerRecorder.getDocsCount(),
                comments_count: 0,
                votes_count: 0,
                replies_count: 0,
                ready: false,
                duration: Session.get('audioDuration'),
                RC: docsManagerRecorder.getFunctions() //aqui almaceno la lista de funciones para la reproducción.
            };
            var paramsNotif = {
                createdAt: new Date(),
                type: 'record'
            };

            //Setting Navigation params!!
            if(this.lesson_id){ //vinculado a una lección
                record.lesson_id = this.lesson_id;
                record.section_id = this.section_id;
                record.order = parseInt(this.order);

                //notification
                paramsNotif.type = 'lesson';
                paramsNotif.new = {title: title};
                paramsNotif.contextTitle = Lessons.findOne(this.lesson_id).title;
                paramsNotif.from = null;
                paramsNotif = _(UsersEnrolled.find({}).fetch()).pluck('user_id'); //a todos.
            }
            if(this.channel_id){ //vinculado a un canal
                record.channel_id = this.channel_id;
                //notification
                paramsNotif.type = 'channel';
                paramsNotif.new = {title: title}
                paramsNotif.contextTitle = Channels.findOne(this.channel_id).title;
                paramsNotif.from = Meteor.userId();

                var contextAuthor = Channels.findOne(this.channel_id).author;
                if (contextAuthor == Meteor.userId()){ //a todos menos el creador = creador del canal.
                    paramsNotif.to = _(UsersEnrolled.find({}).fetch()).pluck('user_id');
                }else{
                    paramsNotif.to = [contextAuthor]; //a todos menos el creador y tambien al creador del canal.
                    _(UsersEnrolled.find({}).fetch()).each(function(obj){
                        if (obj.user_id != Meteor.userId()){
                            paramsNotif.to.push(obj.user_id);
                        }
                    });
                }

            }

            if (this.parent_id){ //es reply
                record.parent_id = this.parent_id;
                record.isReply = true;
                record.timeMark = this.dataRecordObject.currentTime;
                //notification

                var contextAuthor = Records.findOne(this.parent_id).author;

                if (contextAuthor != Meteor.userId()){
                    paramsNotif.action = 'reply';
                    if (paramsNotif.type != 'record'){
                        paramsNotif.context = {title: Records.findOne(this.parent_id).title};
                    }else{
                        paramsNotif.contextTitle = Records.findOne(this.parent_id).title;
                    }
                    paramsNotif.to = [contextAuthor];
                    paramsNotif.from = Meteor.userId();
                }else{
                    paramsNotif = null;
                }

            }else{
                record.isReply = false;
                paramsNotif.action = 'newRecord';
            }

            Session.set('uploading',true);

            SC.connect().then(function(){
                console.log('connected');
               SC.upload({
                    file: currentAudio.get(), // a Blob of your WAV, MP3...
                    title: record.title
                }).then(function(track){
                   console.log(track.uri);
                   record.track = {
                       id: track.id,
                       link: track.uri
                   };
                   Meteor.call('insertRecord',record,function(err,res){
                       if(err){
                           console.log(err.reason);
                       }
                       if(res){
                           docsManagerRecorder.saveDocs(res._id);

                           if (paramsNotif){
                               paramsNotif.urlParameters = {template: 'record', _id: res._id};
                               NotificationsCreator.createNotification(paramsNotif,function(err){
                                   if (err) console.log('ERROR: notifications creator');
                               });
                           }
                           console.log('voy a guardar los documentos');
                           Session.set('uploadedRecordId',res._id);
                           Session.set('uploaded',true);
                       }
                   });
               }).catch(function(err){
                   console.log(err);
               });
            }).catch(function(e){
                console.log(e);
            });
        }
    },

};



Template.recordSubmit.created = function(){
    //if this record will be recorder with docs from another record.
    var arrayDocs = [];
    currentAudio = new ReactiveVar();
    docsManagerRecorder = new DocsManagerRecorder();
    Session.set('startDocument',null);

    if (this.data.parent_id && !this.data.dataRecordObject){
        //es una respuesta pero no hay datos sobre el instante ni los documentos
        //los buscamos en la collección.
        arrayDocs = docsManagerRecorder.copyDocsFromCollection();
        Session.set('loadedDocuments',true);
    }else{
        //es una respuesta y si estan los documentos o no es una respuesta
        //si es una respuesta entonces extraemos los documentos.
        if (this.data.dataRecordObject){
            Session.set('startDocument',this.data.dataRecordObject.docActual);
            Session.set('loadedDocuments',false);
        }
        arrayDocs = (this.data.dataRecordObject)? this.data.dataRecordObject.docs : [];
    };

    //inicializamos el manejador de documentos.
    docsManagerRecorder.initialize(arrayDocs);
};

Template.recordSubmit.rendered = function(){
    //cargamos el código fuente del grabador.
    //https://cdn.WebRTC-Experiment.com/RecordRTC.js
    // https://webrtcexperiment-webrtc.netdna-ssl.com/RecordRTC.js
    Session.set('loading',true);
    Session.set('supported',false);
    $.getScript("https://cdn.WebRTC-Experiment.com/RecordRTC.js",function(){
        recorder = new AudioRecorder();
        recorder.initialize();
        if (recorder.isSupported()){
            Session.set('supported',true);
        }
        Session.set('loading',false);
    });
    Meteor.call('getClientSC',function(err,res){
        if (res){
            SC.initialize({
                client_id: res.client_id,
                redirect_uri: res.redirect_uri,
                oauth_token: res.access_token,
                scope: 'non-expiring'
            });
        }
    });

    //variables de sesion.
    Session.set('formType','formDoc');
    Session.set("recording",false);
    Session.set("stop",false);
    Session.set("createDoc",false);
    Session.set("editDoc",'');
    Session.set('uploading',false);
    Session.set('audioDuration','');
    Session.set('loadedDocuments',false);
    editor = null;
};

Template.recordSubmit.destroyed = function(){
    recorder = null;
    editor = null;
    Session.set('dataRecordingObject',null);
    Session.set('audioDuration',null);
    Session.set('tagsChoosen',null);
    Session.set('loading',false);
    Session.set('startDocument',null);
    Session.set('loadedDocuments',false);
};

/**
 * TRACKER
 */
Tracker.autorun(function(){
    if(Session.get('recording')){
        console.log("esta grabando y voy a crear los eventos del editor");
        date = new Date(); //actualizo la fecha de inicio de grabación.
        console.log("he actualizado la fecha de inicio");

        //eventos del editor

        //change content events.
        editor.getSession().on('change', function(e) {
            switch (e.action) {
                case "remove":
                    console.log('remove case');
                    var rmRange = {
                        start: e.start,
                        end: e.end
                    };
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            arg: rmRange,
                            toDo: 'editor.getSession().getDocument().remove(arg);'
                        }
                    ]);
                    break;
                case "insert":
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            arg: {start: e.start, lines: e.lines},
                            toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)'
                        }
                    ]);
                    break;
            }
        });

        //selection events
        editor.getSession().selection.on('changeSelection', function(e) {
            var selection = editor.getSession().selection;

            if(!selection.isEmpty()){
                var range = selection.getRange();
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        arg: range,
                        toDo: 'editor.getSession().selection.setSelectionRange(arg);'
                    }
                ]);
            }else{
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        toDo: 'editor.getSession().selection.clearSelection();'
                    }
                ])
            }
        });

        //cursor events
        editor.getSession().selection.on('changeCursor',function(e){
            docsManagerRecorder.insertFunctions([
                {
                    time: new Date() - date,
                    arg: editor.getSession().selection.getCursor(),
                    toDo: 'editor.getSession().selection.moveCursorToPosition(arg);'
                }
            ]);
        });

        //scroll events
        editor.getSession().on('changeScrollTop',function(sT){
            if (Session.get('recording')){
                docsManagerRecorder.insertFuncions([
                    {
                        time: new Date() - date,
                        type: 'scroll',
                        arg: {type: 'top', value: sT}
                    }
                ])
            }
        });
        editor.getSession().on('changeScrollLeft',function(sL){
            if (Session.get('recording')){
                docsManagerRecorder.insertFuncions([
                    {
                        time: new Date() - date,
                        type: 'scroll',
                        arg: {type: 'left', value: sL}
                    }
                ])
            }
        });
    }
});

Template.helpModule.events({
    'click li': function(){
        window.open(Meteor.absoluteUrl() + this.url);
    }
});
