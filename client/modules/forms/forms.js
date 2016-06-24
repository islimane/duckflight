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

Template.formAwesome.helpers({
    formType: function(){
        return Session.get('formType');
    }
});

Template.formAwesome.events({
    'click .form-field label': function(event){
        var input = $(event.currentTarget).parent().children('input');
        input.focus();
    },

    'blur input, blur textarea': function(event){
        var input = $(event.currentTarget);
        if (input.val() === ''){
            var label = input.parent().children('label');
            label.removeClass('active');
            input.removeClass('active');
        }
    },

    'focus input, focus textarea': function(event){
        var input = $(event.currentTarget);
        var label = input.parent().children('label');
        label.addClass('active');
        input.addClass('active');
    }
});
Template.formDoc.helpers({
    themes: function(){
        var themes = [
            {name: 'Ambiance' ,module: 'ambiance'},
            {name: 'Chaos' ,module: 'chaos'},
            {name: 'Chrome' ,module: 'chrome'},
            {name: 'Clouds' ,module: 'clouds'},
            {name: 'Clouds Midnight' ,module: 'clouds_midnight'},
            {name: 'Cobalt' ,module: 'cobalt'},
            {name: 'Crimson Editor' ,module: 'crimson_editor'},
            {name: 'Dawn' ,module: 'dawn'},
            {name: 'Dreamweaver' ,module: 'dreamweaver'},
            {name: 'Eclipse' ,module: 'eclipse'},
            {name: 'GitHub' ,module: 'github'},
            {name: 'Gruvbox' ,module: 'gruvbox'},
            {name: 'idle Fingers' ,module: 'idle_fingers'},
            {name: 'IPlastic' ,module: 'iplastic'},
            {name: 'KatzenMilch' ,module: 'katzenmilch'},
            {name: 'krTheme' ,module: 'kr_theme'},
            {name: 'Kuroir' ,module: 'kuroir'},
            {name: 'Merbivore' ,module: 'merbivore'},
            {name: 'Mervibore Soft' ,module: 'mervibore_soft'},
            {name: 'Mono Indrustrial' ,module: 'mono_industrial'},
            {name: 'Monokai' ,module: 'monokai'},
            {name: 'Pastel on dark' ,module: 'pastel_on_dark'},
            {name: 'Solarized Dark' ,module: 'solarized_dark'},
            {name: 'Solarized Light' ,module: 'solarized_light'},
            {name: 'Terminal' ,module: 'terminal'},
            {name: 'Textmate' ,module: 'textmate'},
            {name: 'Tomorrow' ,module: 'tomorrow'},
            {name: 'Tomorrow Night' ,module: 'tomorrow_night'},
            {name: 'Tomorrow Night Blue' ,module: 'tomorrow_night_blue'},
            {name: 'Tomorrow Night Bright' ,module: 'tomorrow_night_bright'},
            {name: 'Tomorrow Night 80s' ,module: 'tomorrow_night_eighties'},
            {name: 'Twilight' ,module: 'twilight'},
            {name: 'Vibrant Ink' ,module: 'vibrant_ink'},
            {name: 'XCode' ,module: 'xcode'}
        ];
        return themes;
    },
    modes: function(){
        var modes = [
            {name: 'ADA',          module:'ada'},
            {name: 'ActionScript', module:'actionscript'},
            {name: 'C & C++',      module:'c_cpp'},
            {name: 'Clojure',      module:'clojure'},
            {name: 'Cobol',        module:'cobol'},
            {name: 'CoffeeScript', module:'coffee'},
            {name: 'C#',           module:'csharp'},
            {name: 'CSS',          module:'css'},
            {name: 'Django',       module:'django'},
            {name: 'Go',           module:'go'},
            {name: 'HTML',         module:'html'},
            {name: 'Handlebars',   module:'handlebars'},
            {name: 'HAML',         module:'haml'},
            {name: 'Jade',         module:'jade'},
            {name: 'Java',         module:'java'},
            {name: 'JavaScript',   module:'javascript'},
            {name: 'JSON',         module:'json'},
            {name: 'LaTex',        module:'latex'},
            {name: 'LESS',         module:'less'},
            {name: 'Markdown',     module:'markdown'},
            {name: 'MATLAB',       module:'matlab'},
            {name: 'MySQL',        module:'mysql'},
            {name: 'Objective-C',  module:'objectivec'},
            {name: 'Pascal',       module:'pascal'},
            {name: 'Perl',         module:'perl'},
            {name: 'pgSQL',        module:'pgsql'},
            {name: 'PHP',          module:'php'},
            {name: 'Python',       module:'python'},
            {name: 'Ruby',         module:'ruby'},
            {name: 'SASS',         module:'sass'},
            {name: 'Scala',        module:'scala'},
            {name: 'SCSS',         module:'scss'},
            {name: 'SQL',          module:'sql'},
            {name: 'SQLServer',    module:'sqlserver'},
            {name: 'Stylus',       module:'stylus'},
            {name: 'SVG',          module:'svg'},
            {name: 'Swift',        module:'swift'},
            {name: 'TypeScript',   module:'typescript'},
            {name: 'Velocity',     module:'velocity'},
            {name: 'XLM',          module:'xml'},
            {name: 'YAML',         module:'yaml'}
        ]
        return modes;
    }
})
Template.formDoc.events({
    'click .form-field label': function(event){
        var input = $(event.currentTarget).parent().children('input');
        input.focus();
    },

    'blur input': function(event){
        var input = $(event.currentTarget);
        if (input.val() === ''){
            var label = input.parent().children('label');
            label.removeClass('active');
            input.removeClass('active');
        }
    },

    'focus input': function(event){
        var input = $(event.currentTarget);
        var label = input.parent().children('label');
        label.addClass('active');
        input.addClass('active');
    }
});


/**
 * FORM PROFILE EDIT
 */

Template.formProfileEdit.helpers({
    avatar: function(){
        return Session.get('userObject').avatar || Session.get('userObject').img;
    },
    banner: function(){
        return Session.get('userObject').banner;
    },
    description: function(){
        return Session.get('userObject').description;
    },
    tagsAllow: function(){
        return Session.get('userObject').tagsAllow;
    },
    tags: function(){
        return (Session.get('userObject').tags)? Session.get('userObject').tags : [];
    },
    sectionConfigAllow: function(){
        return Session.get('userObject').sectionConfigAllow;
    },
    sections: function(){
        return (Session.get('userObject').sections)? Session.get('userObject').sections : [];
    },
    subject: function(){
        return Session.get('userObject').subject;
    },
    editConversation: function(){
        return Session.get('userObject').editConversation;
    },
    leaderName: function(){
        return (Session.get('userObject').leader)? Meteor.users.findOne(Session.get('userObject').leader).username : null;
    },
    leaderAvatar: function(){
        return (Session.get('userObject').leader)? Meteor.users.findOne(Session.get('userObject').leader).avatar : null;
    },
    isLeader: function(){
        return (this.author)? Meteor.userId() == this.author : false || (this.user_id)? Meteor.userId() == this.user_id : null;
    },
    isProfile: function(){
        return Router.current().route.getName() == 'profileEdit';
    },
    emails: function(){
        return Session.get('userObject').emails;
    },
    verified: function(){
        return (this.verified)? 'verified': '';
    },
    hasService: function(){
        return Router.current().route.getName() == 'profileEdit' && Meteor.user().services &&
            _(_(Meteor.user().services).keys()).all(function(k){return k != 'password'});
    }
});

Template.formProfileEdit.events({
    'click .edit-button': function(event){
        var section = $(event.currentTarget).parent().parent();
        $(section).children('.edited-block').addClass('hide');
        $(section).children('.edit-block').addClass('active');
        if ($(section).attr('id') == 'description-section'){
            var desc = Session.get('userObject').description;
            $(section).find('textarea').val(desc || '');
        }
    },

    'click .action-button.discard': function(event){
        var checkboxes = $(event.currentTarget).parent().parent().find('.checkbox-item');
        _(checkboxes).each(function(elem){
            $(elem).removeClass('selected');
            $(elem).find('label i').removeClass('fa-chevron-circle-down').addClass('fa-circle-o');
            $(elem).find('input').attr('disabled',true).val('');
        });
        var section = $(event.currentTarget).parent().parent().parent();
        $(section).children('.edit-block').removeClass('active');
        $(section).children('.edited-block').removeClass('hide');
    },

    'click .checkbox-item label': function(e){
        var checkboxes = $(e.currentTarget).parent().parent().find('.checkbox-item');
        _(checkboxes).each(function(elem){
            $(elem).removeClass('selected');
            $(elem).find('label i').removeClass('fa-chevron-circle-down').addClass('fa-circle-o');
            $(elem).find('input').attr('disabled',true).val('');
        });
        $(e.currentTarget).parent().addClass('selected');
        $(e.currentTarget).find('i').removeClass('fa-circle-o');
        $(e.currentTarget).find('i').addClass('fa-chevron-circle-down');
        $(e.currentTarget).parent().find('input').attr('disabled',false).focus();
    },
    'click #avatar-section .save': function(){

        var img = Session.get('userObject').imgDefault;

        function setImg (img){
            var obj = Session.get('userObject');
            obj.img = img;
            Session.set('userObject',obj);
            $('#avatar-section .discard').click();
        };

        var cbs = $('#avatar-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');

            switch($(input).attr('type')) {
                case 'text':
                    setImg($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setImg(reader.result);
                        };
                    }
                    break;
            }
        }else{
            if ($(selected)[0].id == 'from-service'){
                var serviceName = _(Meteor.user().services).keys()[0];
                var userService = {
                    service: serviceName,
                    id: Meteor.user().services[serviceName].id
                };
                setImg(get_avatar_from_service(userService,100));
            }else{
                setImg(img);
            }
        }

    },

    'click #banner-section .save': function(){
        var banner = Session.get('userObject').bannerDefault;

        function setBanner(banner){
            var obj = Session.get('userObject');
            obj.banner = banner;
            Session.set('userObject',obj);
            $('#banner-section .discard').click();
        }

        var cbs = $('#banner-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');
            switch($(input).attr('type')) {
                case 'text':
                    setBanner($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setBanner(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setBanner (banner);
        }
    },

    'click #description-section .save': function(){
        var obj = Session.get('userObject');
        obj.description = $('#description-section').find('textarea').val();
        Session.set('userObject',obj);
        $('#description-section .discard').click();
    },
    'click #tags-section .save': function(){
        var obj = Session.get('userObject');
        obj.tags = Session.get('tagsChoosen');
        Session.set('userObject',obj);
        $('#tags-section .discard').click();
    },
    'click #tags-section .discard': function(){
        Session.set('tagsChoosen',Session.get('userObject').tags);
    },

    'click #sections-config-section .save': function(){
        var obj = Session.get('userObject');
        obj.sections = Session.get('sectionsArray');
        Session.set('userObject',obj);
        $('#sections-config-section .discard').click();
    },

    'click #sections-config-section .discard': function(){
        Session.set('sectionsArray',Session.get('userObject').sections);
    },

    'click #subject-section .save': function(){
        var obj = Session.get('userObject');
        obj.subject = $('#subject-section input').val();
        Session.set('userObject',obj);
        $('#subject-section .discard').click();
    },

    'click #leader-section .save': function(){
        var obj = Session.get('userObject');
        obj.leader = Session.get('leaderChoosen');
        Session.set('userObject',obj);
        $('#leader-section .discard').click();
    },
    'click #members-section .save': function(){
        var obj = Session.get('userObject');
        obj.members = Session.get('memberList');
        Session.set('userObject',obj);
        $('#members-section .discard').click();
    },
    'click #emails-section .edit-button': function(){
        Session.set('emailsList',Session.get('userObject').emails);
    },
    'click #emails-section .save': function(){
        var obj = Session.get('userObject');
        obj.emails = Session.get('emailsList');
        Session.set('userObject',obj);
        $('#emails-section .discard').click();
    }
});


Template.formProfileEdit.rendered = function(){
    console.log(this.data);
    var sections = Session.get('userObject').sections;
    var tags = Session.get('userObject').tags;
    var members = Session.get('userObject').members;
    var emails = Session.get('userObject').emails;

    (tags)? Session.set('tagsChoosen', tags) : null;
    (sections) ? Session.set('sectionsArray', sections) : null;
    (members) ? Session.set('memberList', members) : null;
    (emails) ? Session.set('emailsList',emails) : null;
};

/**
 * changeOrderSections
 */

Template.changeOrderSections.helpers({
    sections: function() {
        return Session.get('sectionsArray');
    }
});

Template.sectionItemEdit.helpers({
    isNotFirst: function(){
        return this.order > 0;
    },
    isNotLast: function(){
        return this.order < Session.get('sectionsArray').length -1;
    }
});

Template.sectionItemEdit.events({
    'click .action': function(e){
        var sectionsArray = Session.get('sectionsArray');
        var $button = $(e.currentTarget);
        var currentOrder = this.order;
        var inc = ($button.hasClass('up')) ? -1 : 1;
        sectionsArray[currentOrder].order = currentOrder + inc;
        sectionsArray[currentOrder + inc].order = currentOrder;
        Session.set('sectionsArray',_(sectionsArray).sortBy('order'));
    }
});


/**
 * CONVERSATION SUBMIT FORM
 */

Template.conversationSubmitForm.created = function(){
    Session.set('memberList',[]);
};

Template.conversationSubmitForm.destroyed = function(){
    Session.set('memberList',null);
};


/**
 * INPUT MEMBER BOX
 */

Template.inputMemberBox.helpers({
    members: function(){
        return Session.get('memberList');
    },
    editMembersAllow: function(){
        return (Router.current().route.getName() == 'conversationEdit')?
        Conversations.findOne(Router.current().params._id).author == Meteor.userId() : true;
    }
});

Template.inputMemberBox.events ({
    'click button.add-member': function(e){
        if($(e.currentTarget).find('i').hasClass('fa-times')){
            $('.auto-complete-wrapper').find('input').val('');
            Session.set('activeSearch',false);
            $('.auto-complete-wrapper').fadeOut();
            $(e.currentTarget).find('i').removeClass('fa-times');
            $(e.currentTarget).find('i').addClass('fa-plus');
        }else{
            $('.auto-complete-wrapper').fadeIn();
            $(e.currentTarget).find('i').removeClass('fa-plus');
            $(e.currentTarget).find('i').addClass('fa-times');
        }
    },
    'click button.edit-members':function(e){
        if($(e.currentTarget).find('i').hasClass('fa-check')){
            $('.delete-member-button').removeClass('active');
            $(e.currentTarget).find('i').removeClass('fa-check');
            $(e.currentTarget).find('i').addClass('fa-pencil');
        }else{
            $('.delete-member-button').addClass('active');
            $(e.currentTarget).find('i').removeClass('fa-pencil');
            $(e.currentTarget).find('i').addClass('fa-check');
        }
    }
});

Template.inputMemberBox.rendered = function(){
    $('.auto-complete-wrapper').hide();
    Session.set('resultTemplate','memberResult');
    if(this.data.storageDynamic === 'true'){
        var members = Session.get('memberList');
        if (Router.current().route.getName() !== 'sendEmail'){
            members.push(Meteor.users.findOne(Meteor.userId()));
        }
        if(Session.get('userToSend')){
            members.push(Meteor.users.findOne(Session.get('userToSend')));
        }
        Session.set('memberList',members);
    }
};


/**
 * MEMBER RESULT
 */
Template.memberResult.helpers({
    inMembers: function(){
        var members = Session.get('memberList');
        var self = this;
        return _(members).any(function(member){return member._id == self._id;});
    }
});

Template.memberResult.events({
    'click .add-member-button': function(){
        var members = Session.get('memberList');
        members.push(this);
        Session.set('memberList',members);
    }
});

/**
 * MEMBER
 */
Template.member.helpers({
    isPossibleToDelete: function(){
        var isNotUserToSend = true;
        var posibleCurrentUser = Router.current().route.getName() == 'sendEmail';
        if(Session.get('userToSend')){
           isNotUserToSend = this._id != Session.get('userToSend');
        }
        return (posibleCurrentUser)? isNotUserToSend : this._id !== Meteor.userId() && isNotUserToSend;
    },
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this._id).username;
    }
});

Template.member.events({
    'click .delete-member-button': function(){
        var members = Session.get('memberList');
        var self = this;
        members = _(members).filter(function(member){
            return member._id != self._id;
        });
        Session.set('memberList',members);
    }
});


/**
 * CHOOSE LEADER BOX
 */
Template.chooseLeaderBox.helpers({
    members: function(){
        return Session.get('memberList');
    }
});
Template.chooseLeaderBox.rendered = function(){
    Session.set('leaderChoosen',Session.get('userObject').leader);
};
Template.chooseLeaderBox.destroyed = function(){
    Session.set('leaderChoosen',null);
};

/**
 * MEMBER TO CHOOSE
 */
Template.memberToChoose.helpers({
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this._id).username;
    },
    active: function(){
        return (this._id == Session.get('leaderChoosen'))? 'active' : '';
    }
});

Template.memberToChoose.events({
    'click .member-to-choose': function(e){
        Session.set('leaderChoosen',this._id);
    }
});

Template.memberList.helpers({
    members: function(){
        return Session.get('memberList');
    }
})

/**
 * INPUT MESSAGE BOX
 */
Template.inputMessageBox.helpers({
    avatar: function(){
        return Meteor.users.findOne(Meteor.userId()).avatar;
    },
    emojis: function(){
        var emojis = [{name: 'smile'},{name: 'smiley'},{name: 'heart_eyes'},{name: 'flushed'},{name: 'grin'},{name: 'grinning'},{name: 'grimacing'},
                      {name: 'laughing'},{name: 'wink'},{name: 'blush'},{name: 'worried'},{name: 'yum'},{name: 'kissing'},
            {name: 'kissing_heart'},{name: 'open_mouth'},{name: 'stuck_out_tongue'},{name: 'stuck_out_tongue_winking_eye'},{name: 'stuck_out_tongue_closed_eyes'},
            {name: 'joy'},{name: 'sunglasses'},{name: 'smirk'},
            {name: 'tired_face'},{name: 'unamused'},{name: 'disappointed_relieved'},{name: 'disappointed'},{name: 'weary'},{name: 'confounded'},{name: 'sweat'},
            {name: 'fearful'},{name: 'mask'},{name: 'cold_sweat'},{name: 'scream'},{name: 'sob'},
            {name: 'sleepy'},{name: 'sleeping'},{name: 'neutral_face'},{name: 'angry'},{name: 'rage'},{name: 'triumph'},{name: 'innocent'},
            {name: 'zzz'},{name: 'boom'},{name: 'imp'},{name: 'ghost'},{name: 'alien'},{name: 'clap'},
            {name: 'wave'},{name: 'thumbsup'},{name: 'v'},{name: 'ok_hand'},{name: 'pray'},{name: 'eyes'},{name: 'mortar_board'},
            {name: 'closed_umbrella'},{name: 'kiss'}];

        return emojis;
    }
});

Template.inputMessageBox.events({
    'click #emoticons-target': function(){
        $('#link-panel').fadeOut();
        $('#emoticons-panel').fadeIn();
    },
    'click #emoticons-panel img.emoji':function(e){
        var emojiCode = $(e.target).attr('alt');
        $('#message-input').html($('#message-input').html() + Emoji.convert(emojiCode));
    },
    'click #link-target': function(){
        $('#emoticons-panel').fadeOut();
        $('#link-panel').fadeIn();
    },
    'click .close-panel': function(e){
        var $target = $(e.currentTarget);

        switch($target.attr('id')){
            case 'close-emoticons':
                $('#emoticons-panel').fadeOut();
                break;
            case 'close-link':
                $('#link-panel').fadeOut();
                break;
        }
    },
    'focus #message-input': function(){
        $('.popover-panel').fadeOut();
        $('.link-panel').fadeOut();
    },
    'submit #link-input': function(e){
        e.preventDefault();
        var link = $(e.target).find('[name=link]').val();
        $(e.target).find('[name=link]').val('');
        $('#message-input').focus();
        $('#message-input').html($('#message-input').html() + '<a href="http://' + link + '" target="_blank">' + ellipsis(link,20) + '</a>');
    },
    'click #message-input a': function(e){
        window.open($(e.target).attr('href'));
    }
});

Template.inputMessageBox.rendered = function(){
    $('.popover-panel').hide();
};


/**
 * TAGS INPUT
 */

Template.tagsInput.helpers({
    tagsFounded: function(){
        return Tags.find({name: new RegExp(Session.get('searchValue'))});
    },
    tagsChoosen: function(){
        return Session.get('tagsChoosen');
    },
    hasTags: function(){
        return (Session.get('tagsChoosen'))? Session.get('tagsChoosen').length > 0 : false;
    },
    founded: function(){
        return Session.get('founded');
    },
    searching: function(){
        return Session.get('searching');
    }
});

Template.tagsInput.events({
    'keyup input': function(e){
        if ($(e.target).val() != ""){
            Session.set('searching',e.keyCode !== 16);
            Session.set('searchValue',$(e.target).val());
        }else{
            Session.set('searchValue',null);
        }
    },
    'click #eraser-button': function(e,template){
        $(template.find('[name=tags]')).val('');
        Session.set('searchValue',null);
    },
    'click #add-tag': function(e,template){
        var nameTag = Session.get('searchValue');
        var tagsChoosen = Session.get('tagsChoosen');
        if (!_(tagsChoosen).any(function(tag){return tag.name == nameTag})) {
            tagsChoosen.push({name: nameTag});
            Session.set('tagsChoosen', tagsChoosen);
        }
        $(template.find('[name=tags]')).val('');
        Session.set('searchValue',null);
    }
});

Template.tagsInput.rendered = function(){
    Session.set('searching',false);
    Session.set('founded',false);
    Session.set('searchValue',null);
    var tagsChoosen = Session.get('tagsChoosen');
    Session.set('tagsChoosen',(tagsChoosen)? tagsChoosen : []);

    var resultsDecisor = function(){
        Session.set('founded', Tags.find().count() > 0);
        Session.set('searching',false);
    };
    var self = this;
    self.autorun(function(){
        if(Session.get('searchValue')) {
            Meteor.subscribe('tagsBySearch', Session.get('searchValue'), resultsDecisor());
        }
    })
};

Template.tagsInput.destroyed = function(){
    Session.set('searching',null);
    Session.set('founded',null);
    Session.set('searchValue',null);
    Session.set('tagsChoosen',null);
};

/**
 * TAG RESULT
 */
Template.tagResult.helpers({
    choosen: function(){
        var self = this;
        return (_(Session.get('tagsChoosen')).any(function(tag){return tag.name == self.name;}))? 'choosen' : '';
    }
});

Template.tagResult.events({
    'click .tag': function(){
        var self = this;
        if (!_(Session.get('tagsChoosen')).any(function(tag){return tag.name == self.name})){
            var tagsChoosen = Session.get('tagsChoosen');
            tagsChoosen.push({name: this.name});
            Session.set('tagsChoosen',tagsChoosen);
        }
    }
});

/**
 * TAG CHOOSEN
 */
Template.tagChoosen.events({
    'click .tag-choosen .remove-tag': function(){
        var self = this;
        var tagsChoosen = _(Session.get('tagsChoosen')).filter(function(tag){
            return tag.name !== self.name;
        });
        Session.set('tagsChoosen',tagsChoosen);



    }
});

Template.inputEmailsBox.helpers({
    emails: function(){
        return Session.get('emailsList');
    }
});

Template.inputEmailsBox.events({
    'click .remove-email': function(){
        console.log('removeeee');
        var emails = Session.get('emailsList');
        var address = this.address;
        emails = _(emails).filter(function(e){
            return e.address != address;
        });
        Session.set('emailsList',emails);
    },
    'click .choose-button': function(e){
        e.preventDefault();
        e.stopPropagation();
        var emails = Session.get('emailsList');
        var address = this.address;
        var emailsUpdated = [];
        _(emails).each(function(e){
            if (e.primary){
                e.primary = false;
            }else if (e.address == address){
                e.primary = true;
            }
            emailsUpdated.push(e);
        });
        Session.set('emailsList',emailsUpdated);
    },
    'submit #email-form': function(e){
        e.preventDefault();
        e.stopPropagation();

        var address = $('#email-input').val();
        if (address) {
            $('.errormsg').remove();
            Meteor.call('checkEmail',address,function(err,res){
                if (err) console.log('ERROR CHECKING EMAIL: email in use');
                if (res){
                    var emails = Session.get('emailsList');
                    emails.push({
                        address: address,
                        verified: false
                    });
                    Session.set('emailsList', emails);
                    $('#email-input').val();
                }else{
                    $('#email-form').append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Sorry, email already exists!</p>');
                }
            });
        }
    }
});

