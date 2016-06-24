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

editor = {};

EditorPlayerManager = function(){
    //VARIABLES
    var docs,
        startDocs,
        finishDocs,
        listPending,
        docActual,
        RC;

    var Doc = function(title,mode,theme,value){
        this.title = title;
        this.mode = mode || "ace/mode/javascript"; //por defecto
        this.theme = theme ||"ace/theme/twilight"; //por defecto
        this.value = value || "";
    };

    //INITIALIZATION
    function initializeDynamicDocs (){
        docs = [];
        docActual = '';
        Session.set('docAct',"");
        _(startDocs).each(function(elem){
            docs.push(
                new Doc (elem.doc.title,
                    elem.doc.mode,
                    elem.doc.theme,
                    elem.doc.value)
            );
        });
    }
    function defaultEditorSettings (){
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        editor.setValue('');
        $('.ace_gutter').css('z-index','0');
    }
    function initEditor(id){
        editor = ace.edit(id);
        defaultEditorSettings();
    }

    this.initialize = function(params){
        startDocs = params.startDocs;
        finishDocs = params.finishDocs;
        initializeDynamicDocs();
        initEditor(params.id);
        RC = params.RC;
        listPending = RC;
        Session.set('docAct','');
    };
    this.getDocs = function(ended){
        var documents = docs;
        if(docActual){ //actualizo el valor del documento actual.
            docActual.value = editor.getValue();
        }
        if (ended){
            documents = [];
            _(finishDocs).each(function(elem){
               documents.push(
                   new Doc(elem.doc.title,
                           elem.doc.mode,
                           elem.doc.theme,
                           elem.doc.value
                        ));
            });
        }
        return documents;
    };
    this.getDocActual = function(){
        return docActual;
    };
    //start method from a playTime.
    this.update = function(pos){
        //esta es la funcion en la que ejecutare las funciones toDo almacenadas
        //en la lista de reproduccion de eventos del editor
        //filtramos las funciones a aplicar al editor en la pos actual
        var listToDo = (pos)? _(listPending).filter(function(e){return e.time <= parseInt(pos) + 1400;}) : [];
        //ejecutamos las funciones filtradas en el editor
        _(listToDo).each(function(e){
            if (e.type){
                switch(e.type){
                    case 'newDoc':
                        docs.push(new Doc(e.arg[0], 'ace/mode/' + e.arg[1], 'ace/theme/' + e.arg[2]));
                        break;
                    case 'editDoc':
                        _(docs).each(function(doc){
                            if(doc.title == e.arg[0]){
                                doc.title = e.arg[1];
                                doc.mode = "ace/mode/" + e.arg[2];
                                doc.theme = "ace/theme/" + e.arg[3];
                            }
                        });
                        editor.getSession().setMode('ace/mode/' + e.arg[2]);
                        editor.setTheme('ace/theme/' + e.arg[3]);
                        break;
                    case 'session':
                        //no ejecutará cuando la plantilla comienze a renderizarse.
                        if (docActual){ //si ya existia un docActual.
                            docActual.value = editor.getValue(); //guardo su estado antes de cambiar a otro.
                        }
                        docActual = _(docs).find(function(doc){return doc.title == e.arg});
                        Session.set('docAct',docActual); //cambiar la session de docAct.
                        editor.setValue(docActual.value);
                        editor.getSession().setMode(docActual.mode);
                        editor.setTheme(docActual.theme);
                        break;
                    case 'scroll':
                        switch(e.arg.type){
                            case 'top':
                                editor.getSession().setScrollTop(e.arg.value);
                                break;
                            case 'left':
                                editor.getSession().setScrollLeft(e.arg.value);
                                break;
                        }
                        break;
                }
            }else{
                var func = new Function('editor','arg',e.toDo);
                func(editor, e.arg);
            }
        });

        //actualizamos la lista de funciones a aplicar borrando las que ya se han aplicado.
        listPending = _(listPending).difference(listToDo);
    };

    //method to execute tasks.
    this.seek = function(pos){
        //vaciamos el editor y lo dejamos en estado inicial.
        defaultEditorSettings();
        listPending = RC; //estado inicial.
        initializeDynamicDocs();
        this.update (pos);
    };
};