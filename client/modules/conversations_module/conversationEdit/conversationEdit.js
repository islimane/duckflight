Template.conversationEdit.events({
    'submit form': function(e){
        e.preventDefault();
        var conversation_id = this._id;
        var objectUpdate = Session.get('userObject');
        var currentObject = this;
        var updateMembersObject = null;

        //componemos de nuevo los miembros.
        var members = [];
        _(objectUpdate.members).each(function(u_member){
            var obj;
            if(u_member._id == Meteor.userId()){ //si es el usuario que ha editado actualizamos su bg.
                console.log('soy yo');
                obj = _(currentObject.members).find(function(m){return m._id == u_member._id;});
                console.log(obj);
                obj.bg_img = objectUpdate.banner;
                console.log(obj);
            }else{
                obj = _(currentObject.members).find(function(m){return m._id == u_member._id;});
                if(!obj) obj = {_id: u_member._id, startDate: new Date(), bg_img: '/conversationBGDefault.jpg'}
            }
            members.push(obj);
        });

        var subjectChanged = function(){
            return objectUpdate.subject !== currentObject.subject;
        };

        var membersChanged = function(){
            var current_Ids = _(currentObject.members).pluck('_id');
            var update_Ids = _(objectUpdate.members).pluck('_id');
            return _(current_Ids).difference(update_Ids).length || _(update_Ids).difference(current_Ids);
        };

        var whoExpelled = function(){
            var current_Ids = _(currentObject.members).pluck('_id');
            var update_Ids = _(objectUpdate.members).pluck('_id');
            return _(current_Ids).difference(update_Ids); //los que ahora no estan.
        };

        var whoAdded = function(){
            var current_Ids = _(currentObject.members).pluck('_id');
            var update_Ids = _(objectUpdate.members).pluck('_id');
            return _(update_Ids).difference(current_Ids);
        };

        var leaderChanged = function(){
            return objectUpdate.leader != currentObject.author;
        };

        var messages = [];
        var notifications = [];
        if(subjectChanged()){
            messages.push({
                type: 'info',
                createdAt: new Date(),
                message: 'Subject has been changed to ' + objectUpdate.subject + '!',
                conversation_id: conversation_id
            });
            notifications.push({
                type: 'conversation',
                action: 'changedSubject',
                createdAt: new Date(),
                urlParameters: {template: 'conversation', _id: conversation_id},
                contextTitle: currentObject.subject,
                context: {title: objectUpdate.subject},
                from: Meteor.userId(),
                to: _(objectUpdate.members).chain().filter(function(m){return m._id !== Meteor.userId()}).pluck('_id')
            });
        };
        if(leaderChanged()){
            messages.push({
                type: 'info',
                createdAt: new Date(),
                message: Meteor.users.findOne(objectUpdate.leader).username + ' is the new leader!',
                conversation_id: conversation_id
            });
            notifications.push({
                type: 'conversation',
                action: 'newLeader',
                createdAt: new Date(),
                urlParameters: {template: 'conversation', _id: conversation_id},
                contextTitle: objectUpdate.subject,
                from: Meteor.userId(),
                to: objectUpdate.leader
            });
        };
        if(membersChanged()){
            var userNamesExp = [];
            var userNamesAdd = [];
            var membersExp = whoExpelled();
            var membersAdd = whoAdded();
            updateMembersObject = {
                membersExpelled: membersExp,
                membersAdded: membersAdd
            };
            _(whoExpelled()).each(function(user_id){
                userNamesExp.push(Meteor.users.findOne(user_id).username);
            });
            _(whoAdded()).each(function(user_id){
                userNamesAdd.push(Meteor.users.findOne(user_id).username);
            });
            if(userNamesExp.length){
                messages.push({
                    type: 'info',
                    createdAt: new Date(),
                    message: userNamesExp.join(', ') + ((userNamesExp.length > 1)? ' have' : ' has') + ' been expelled!',
                    conversation_id: conversation_id
                });
                notifications.push({
                    type: 'conversation',
                    action: 'removed',
                    createdAt: new Date(),
                    urlParameters: {template: 'conversation', _id: conversation_id},
                    contextTitle: objectUpdate.subject,
                    to: membersExp
                });
            }
            if(userNamesAdd.length){
                messages.push({
                    type: 'info',
                    createdAt: new Date(),
                    message: userNamesAdd.join(', ') + ((userNamesAdd.length > 1)? ' have' : ' has') + ' been Added!',
                    conversation_id: conversation_id
                });
                notifications.push({
                    type: 'conversation',
                    action: 'added',
                    createdAt: new Date(),
                    urlParameters: {template: 'conversation', _id: conversation_id},
                    contextTitle: objectUpdate.subject,
                    to: membersAdd,
                    from: Meteor.userId()
                });
            }
        };

        objectUpdate.members = members;

        Meteor.call('conversationUpdate',conversation_id,objectUpdate,updateMembersObject,function(err,res){
            if(res) {
                _(messages).each(function(msg){
                    Meteor.call('insertMessage', msg, function(err) {
                        if (err) console.log('insertMessage ERROR: ' + err.reason);
                    });
                });
                _(notifications).each(function(notif){
                   NotificationsCreator.createNotification(notif,function(err){
                       if (err) console.log('create Notification ERROR');
                   });
                });
                Router.go('conversation',{_id: conversation_id});
            }
            if (err) console.log('error: ' + err.reason);
        });
    }
});

Template.conversationEdit.created = function(){
    Session.set('formType','formProfileEdit');

    //copy array of members (only _id is needed)
    var membersIds = [];
    _(this.data.members).each(function(member){
        membersIds.push({_id: member._id});
    });

    var currentMember = _(this.data.members).find(function(member){return member._id == Meteor.userId()});


    var conversationObject = {
        editConversation: true,
        subject: this.data.subject,
        leader: this.data.author,
        members: membersIds,
        banner:  currentMember.bg_img  || '/conversationBGDefault.jpg',
        bannerDefault: '/conversationBGDefault.jpg'
    };
    Session.set('userObject',conversationObject);
};

Template.conversationEdit.rendered = function(){
    console.log(this.data);
};

Template.conversationEdit.destroyed = function(){
    Session.set('userObject',null);
    Session.set('memberList',null);
    Session.set('leaderChoosen',null);
};