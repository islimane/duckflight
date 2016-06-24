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

SearchParamsManager = function(){
    var sessionIn, sessionOut, sessionLimit, limitDefault, defaultCategory;

    //parsea los parametros de busqueda en parametros mongoDB
    var parser = function(params){
        var currentSearch = (params.length)? {query: {}, options: {}, category: defaultCategory} : null;
        _(params).each(function(p){
            switch(p.key){
                case 'author':
                    currentSearch.query.author = p.user_id;
                    break;
                case 'from':
                    switch (p.value){
                        case 'channel':
                            currentSearch.query.channel_id = {$exists: true};
                            break;
                        case 'lesson':
                            currentSearch.query.lesson_id = {$exists: true};
                            break;
                    }
                    break;
                case 'sort':
                    currentSearch.options.sort = {};
                    switch(p.value){
                        case 'latest':
                            currentSearch.options.sort.createdAt = -1;
                            break;
                        case 'popular':
                            currentSearch.options.sort.votes = -1;
                            break;
                    }
                    break;
                case 'tag':
                    if (currentSearch.query.tags){
                        currentSearch.query.tags.$elemMatch.name.$in.push(p.value);
                    }else{
                        currentSearch.query.tags = {
                            $elemMatch: {
                                name: {
                                    $in: [p.value]
                                }
                            }
                        }
                    }
                    currentSearch.query.tags
                        .$elemMatch
                        .name
                        .$in = _(currentSearch.query.tags.$elemMatch.name.$in).uniq();
                    console.log(currentSearch);
                    break;
                case 'category':
                    currentSearch.category = (p.value === 'recordings')? 'records' : p.value;
                    break;
            }
        });
        return currentSearch;
    };

    //realiza las subscripciones y ejecuta un callback cuando las subscripciones están listas.
    var subscribe = function(params,callback){
        if (params){
            Meteor.subscribe('searchResults',params,{
                onReady: callback(params)
            });
        }else{
            callback(params);
        }
    };

    //establece los items como resultado de la busqueda.
    var getResults = function(params){
        console.log('getResults');
        var results = {
            records: [],
            channels: [],
            lessons: []
        };

        if (params){
            var paramsOmited = params;
            paramsOmited.query = _(params.query).omit('$exists');

            switch (params.category){
                case 'records':
                    results.records = Records.find(params.query,params.options).fetch();
                    break;
                case 'channels':
                    results.channels = Channels.find(paramsOmited.query,paramsOmited.options).fetch();
                    break;
                case 'lessons':
                    results.lessons = Lessons.find(paramsOmited.query,paramsOmited.options).fetch();
                    break;
                case 'all':
                    results.records = Records.find(params.query,params.options).fetch();
                    results.channels = Channels.find(paramsOmited.query,paramsOmited.options).fetch();
                    results.lessons = Lessons.find(paramsOmited.query,paramsOmited.options).fetch();
                    break;
            }
        }
        Session.set('results',results);
        Session.set('searching',false);
    };

    //bloque en el que se inicializa el deps para que con cada
    // introducción de un parametro se actualicen los resultados.
    var reactiveSubscriptionInitialize = function(){
        Deps.autorun(function(){
            Session.set('searching',true);
            var params = Session.get(sessionIn);
            if (params) {
                console.log('los parametros de busqueda han cambiado!!!');
                var currentSearch = parser(params);
                subscribe(currentSearch, getResults);
            }
        });
    };

    this.initialize = function(sIn, sOut, sLimit, lDef, defCategory){
        sessionIn = sIn;
        sessionOut = sOut;
        sessionLimit = sLimit;
        limitDefault = lDef;
        defaultCategory = defCategory;
        reactiveSubscriptionInitialize();
    }
};