//SMART SEARCH

Template.smartSearch.helpers({
    searching: function(){
        return Session.get('searching');
    },
    showAutocomplete: function(){
        return Session.get('showAutocomplete');
    },
    currentResultTab: function(){
        return Session.get('currentResultTab');
    },
    counter: function(){
        var counter = 0;
        if (Session.get('results')){
            var resultsObj = Session.get('results')
            _(_(resultsObj).keys()).each(function(key){
                counter += resultsObj[key].length;
            });
        }
        return counter;
    },
    modifiers: function(){
        return Session.get('modifiers');
    },
    dynamicTabNameAutocomplete: function(){
        return (Session.get('currentModifier'))? Session.get('currentModifier').autocompleteTabName : 'modifiersAutocompleteTab';
    },
    autocompleteData: function(){
        if (!Session.get('currentModifier')){
            var modifiers = [];
            if (this.data.context == 'all') modifiers.push({key: 'category',tabName: 'categoryAutocompleteTab',description: "set a category"});
            modifiers.push({key: 'author' ,tabName: 'authorAutocompleteTab', description: 'author name'});
            modifiers.push({key: 'state', tabName: 'stateAutocompleteTab', description: 'filter by subscriptions'});
            modifiers.push({key: 'tag', tabName: 'tagAutocompleteTab', description: 'filter by tag'});
            modifiers.push({key: 'sort', tabName: 'sortAutocompleteTab', description: 'set a sort flag'});
            modifiers.push({key: 'from', tabName: 'fromAutocompleteTab', description: 'set a context from'});
            return {modifiers: modifiers};
        }else{
            return {};
        }
    },
    contextSearch: function(){
        return this.data;
    },
    results: function(){
        var results = Session.get('results');
        var keys = _(results).keys();
        return _(keys).any(function(key){
            return results[key].length;
        });
    }
});
Template.smartSearch.events({
    'click #input-search-wrapper':function(e){
        var wrapper = document.getElementById('input-search-wrapper');
        wrapper.scrollLeft = wrapper.scrollWidth;
        $('input').focus();
    },
    'keyup input': function(e){
        switch(e.keyCode){
            case 187: //plus key
                Session.set('showAutocomplete',true);
                break;
            case 8: //delete key
                var modifiers = Session.get('modifiers');
                if (modifiers.length){
                    if (Session.get('currentModifier')){
                        if(!Session.get('showAutocomplete')){
                            var currentModifier = modifiers.pop();
                            Session.set('searchParams',modifiers);
                            $('input').val(currentModifier.key);
                            Session.set('currentModifier',null);
                            if (modifiers.length){
                                Session.set('deletingModifier',true);
                            }
                        }
                    }else{
                        if(Session.get('deletingModifier')){
                            if($('input').val() == ''){
                                Session.set('deletingModifier',false);
                            }
                        }else{
                            var currentModifier = modifiers[modifiers.length -1];
                            $('input').val(currentModifier.value);
                            currentModifier.value = '';
                            currentModifier.completed = false;
                            Session.set('currentModifier',currentModifier);
                        }
                    }
                    Session.set('modifiers',modifiers);
                }
                break;
            case 13://enter key
                Session.set('showAutocomplete',false);
                break;
        }
        Session.set('searchValue',$('input').val());
    },

    'click #eraser-button': function(){
        $('input').val('');
        Session.set('searchValue',$('input').val());
        Session.set('modifiers',[]);
        Session.set('currentModifier', null);
        Session.set('modifiersChanged',true);
    }
});
Template.smartSearch.created = function(){
    Session.set('searchParams',[]); //parametros de busqueda para el manejador
    Session.set('modifiersChanged', false); //modifiers have changed
    var searchManager = new SearchParamsManager();
    searchManager.initialize('searchParams','results',null,null,this.data.data.context);
};
Template.smartSearch.rendered = function(){
    Session.set('showAutocomplete',false);
    Session.set('searchValue',''); //sirve para las plantillas de autocompletado.
    Session.set('modifiers',[]); //modifiers added
    Session.set('currentModifier', null); //current and incomplete modifier
    Session.set('limitResults',5); //limite de resultados a mostrar.

    var self = this;
    self.autorun(function(){
        if(Session.get('modifiersChanged')){
            Session.set('modifiersChanged', false);
            var wrapper = document.getElementById('input-search-wrapper');
            wrapper.scrollLeft = wrapper.scrollWidth;
        }
        var searchVal = Session.get('searchValue');
        Session.set('showAutocomplete',(searchVal != '')? true : false);
    });
};

//---------------------------------------------------------------

//NAV RESULTS
Template.navResults.helpers({
    navResultsFilters: function(){
        console.log(this.data);
        var filters = [];
        switch(this.data.context){
            case 'records':
                filters.push({icon: 'fa-film',initialActive: 'true', template: 'records', resultTemplate: 'recordItemHorizontal'});
                break;
            case 'channels':
                filters.push({icon: 'fa-desktop',initialActive: 'true', template: 'channels', resultTemplate: 'channelItemHorizontal'})
                break;
            case 'lessons':
                filters.push({icon: 'fa-graduation-cap',initialActive: 'true', template: 'lessons', resultTemplate: 'lessonItemHorizontal'})
                break;
            default:
                filters = [{icon: 'fa-film',initialActive: 'true', template: 'records', resultTemplate: 'recordItemHorizontal'},
                    {icon: 'fa-desktop', template: 'channels', resultTemplate: 'channelItemHorizontal'},
                    {icon: 'fa-graduation-cap', template: 'lessons', resultTemplate: 'lessonItemHorizontal'}];
                break;
        }
        return filters;
    }
});

Template.navResults.destroyed = function(){
    Session.set('currentResultTab',null);
    Session.set('resultTemplate',null);
    Session.set('results',null);
};
//---------------------------------------------------------------


//NAV RESULT FILTER
Template.navResultFilter.helpers({
    template: function(){
        return this.template.charAt(0).toUpperCase() + this.template.substring(1).toLowerCase();
    },
    active: function(){
        return (this.initialActive)? 'active' : '';
    },
    counter: function(){
        return Session.get('results')[this.template].length;
    }
});

Template.navResultFilter.events({
    'click .results-filter': function(e){
        $('.results-filter').removeClass('active');
        $(e.currentTarget).addClass('active');
        Session.set('currentResultTab',this.template);
        Session.set('resultTemplate',this.resultTemplate);
    }
});

Template.navResultFilter.rendered = function(){
    if (this.data.initialActive){
        Session.set('currentResultTab',this.data.template);
        Session.set('resultTemplate',this.data.resultTemplate);
    }
};
//---------------------------------------------------------------

//RESULTS TAB CONTENT
Template.resultsTabContent.helpers({
    results: function(){
        var results = [];
        switch(Session.get('currentResultTab')){
            case 'records':
                results = Session.get('results').records.slice(0,Session.get('limit'));
                break;
            case 'channels':
                results = Session.get('results').channels.slice(0,Session.get('limit'));
                break;
            case 'lessons':
                results = Session.get('results').lessons.slice(0,Session.get('limit'));
                break;
        }
        return results;
    },
    resultTemplate: function(){
        return Session.get('resultTemplate');
    }
});

Template.resultsTabContent.events({
    'click #load-more-button': function(){
        Session.set('limit', Session.get('limit') + MORE_LIMIT);
    }
});

Template.resultsTabContent.rendered = function(){
    Session.set('limit',LOAD_INITIAL);
};


/*======================================================
    AUTOCOMPLETE TABS
 =======================================================*/

//MODIFIERS AUTOCOMPLETE

Template.modifiersAutocompleteTab.helpers({
    modifiersList: function(){
        return Session.get('modifiersSuggested');
    },
    isValid: function(){
        var valid = false;
        switch(this.key){
            case 'category':
                valid = _(Session.get('modifiers')).all(function(mod){
                    return mod.key != 'category';
                });
                break;
            case 'from':
                valid = _(Session.get('modifiers')).any(function(mod){
                    return mod.key == 'category' && mod.value != 'channels' && mod.value != 'lessons';
                });
                break;
            case 'state':
                valid = _(Session.get('modifiers')).any(function(mod){
                    return mod.key == 'category' && mod.value != 'records';
                });
                break;
            default:
                valid = true;
                break;
        }
        return valid;
    }
});

Template.modifiersAutocompleteTab.events({
    'click .search-filter': function(){
        var modifier = {
            key: this.key,
            value: '',
            completed: false,
            autocompleteTabName: this.key + 'AutocompleteTab'
        };
        var modifiers = Session.get('modifiers');
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('currentModifier',modifier);
        $('input').val('');
        $('input').focus();
    }
});

Template.modifiersAutocompleteTab.rendered = function(){
    Session.set('modifiersSuggested',this.data.modifiers);
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Session.set('modifiersSuggested',self.data.modifiers);
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                var regExp = new RegExp (searchVal);
                var modifiers = _(self.data.modifiers).filter(function(mod){
                    return regExp.exec(mod.key);
                });
                Session.set('modifiersSuggested',modifiers);
                break;
        }
    })
};
Template.modifiersAutocompleteTab.destroyed = function(){
    Session.set('modifiersSuggested',null);
};

Template.modifiersChoosed.helpers({
    listModifiers: function(){
        return Session.get('modifiers');
    }
});

Template.modifierChoosedItem.helpers({
    incomplete: function(){
        return (this.completed)? '' : 'incomplete';
    }
});

//CATEGORY AUTOCOMPLETE
Template.categoryAutocompleteTab.helpers({
    categories: function(){
        return Session.get('categories');
    }
});
Template.categoryAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.name;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});
Template.categoryAutocompleteTab.created = function(){
    this.data.categories = [
        {name: 'recordings'},
        {name: 'channels'},
        {name: 'lessons'},
        {name: 'all'}
    ];
};

Template.categoryAutocompleteTab.rendered = function(){
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Session.set('categories',self.data.categories);
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                var regExp = new RegExp (searchVal);
                var categories = _(self.data.categories).filter(function(elem){
                    return regExp.exec(elem.name);
                });
                Session.set('categories',categories);
                break;
        }

    })
};

Template.categoryAutocompleteTab.destroyed = function(){Session.set('categories',null)};



//AUTHOR AUTOCOMPLETE
Template.authorAutocompleteTab.helpers({
    users: function(){
        return Session.get('usersMatch');
    }
});
Template.authorAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.username;
        modifier.user_id = this._id;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});
Template.authorAutocompleteTab.rendered = function(){
    var self = this;
    Session.set('usersMatch',Meteor.users.find().fetch());
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Meteor.subscribe('allUsers');
                Session.set('usersMatch',Meteor.users.find().fetch());
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                Meteor.subscribe('usersBySearch',searchVal);
                Session.set('usersMatch',Meteor.users.find({username: new RegExp(searchVal)}).fetch());
                break;
        }
    });
};





//TAG AUTOCOMPLETE
Template.tagAutocompleteTab.helpers({
    tags: function(){
        return Tags.find();
    }
});
Template.tagAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.name;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});

Template.tagAutocompleteTab.rendered = function(){
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Meteor.subscribe('tags');
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                Meteor.subscribe('tagsBySearch',searchVal);
                break;
        }

    });
};



//SORT AUTOCOMPLETE
Template.sortAutocompleteTab.helpers({
    options: function(){
        return Session.get('options');
    }
});
Template.sortAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.name;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});
Template.sortAutocompleteTab.created = function(){
    this.data.options = [
        {name: 'latest'},
        {name: 'popular'}
    ];
};
Template.sortAutocompleteTab.rendered = function(){
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Session.set('options',self.data.options);
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                var regExp = new RegExp (searchVal);
                var options = _(self.data.options).filter(function(elem){
                    return regExp.exec(elem.name);
                });
                Session.set('options',options);
                break;
        }
    });
};
Template.sortAutocompleteTab.destroyed = function(){Session.set('options',null)};


//FROM AUTOCOMPLETE
Template.fromAutocompleteTab.helpers({
    options: function(){
        return Session.get('options');
    }
});
Template.fromAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.name;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});
Template.fromAutocompleteTab.created = function(){
    this.data.options = [
        {name: 'channel'},
        {name: 'lesson'}
    ];
};
Template.fromAutocompleteTab.rendered = function(){
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Session.set('options',self.data.options);
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                var regExp = new RegExp (searchVal);
                var options = _(self.data.options).filter(function(elem){
                    return regExp.exec(elem.name);
                });
                Session.set('options',options);
                break;
        }
    });
};
Template.sortAutocompleteTab.destroyed = function(){Session.set('options',null)};



//STATE AUTOCOMPLETE
Template.stateAutocompleteTab.helpers({
    options: function(){
        return Session.get('options');
    }
});
Template.stateAutocompleteTab.events({
    'click .element': function(){
        var modifier = Session.get('currentModifier');
        modifier.completed = true;
        modifier.value = this.name;
        var modifiers = Session.get('modifiers');
        modifiers.pop();
        modifiers.push(modifier);
        Session.set('modifiers',modifiers);
        Session.set('searchParams',modifiers);
        Session.set('currentModifier',null);
        Session.set('showAutocomplete',false);
        Session.set('modifiersChanged', true);
        $('input').val('');
        $('input').focus();
    }
});
Template.stateAutocompleteTab.created = function(){
    this.data.options = [
        {name: 'subscribed'}
    ];
};
Template.stateAutocompleteTab.rendered = function(){
    var self = this;
    self.autorun(function(){
        var searchVal = Session.get('searchValue');
        switch(searchVal){
            case '+':
                Session.set('options',self.data.options);
                break;
            default:
                if (searchVal[0] == '+') searchVal = searchVal.slice(1);
                var regExp = new RegExp (searchVal);
                var options = _(self.data.options).filter(function(elem){
                    return regExp.exec(elem.name);
                });
                Session.set('options',options);
                break;
        }
    });
};
Template.stateAutocompleteTab.destroyed = function(){Session.set('options',null)};

