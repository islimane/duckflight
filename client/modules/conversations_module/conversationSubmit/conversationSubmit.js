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

Template.conversationSubmit.created = function(){
    if(this.data.userToSend) Session.set('userToSend',this.data.userToSend);
};

Template.conversationSubmit.rendered = function(){
    Session.set('formType','conversationSubmitForm');
};

Template.conversationSubmit.destroyed = function(){
    Session.set('userToSend',null);
};

Template.conversationSubmit.events({
    'submit .conversation-form': function(e){
        e.preventDefault();
        var subject = $(e.target).find('[name=subject]').val();
        var memberObjects = Session.get('memberList');
        var message = $('#message-input').html();
        $('.errormsg').remove();

        if(message && memberObjects.length > 1){
            var membersArray = [];
            var startDate = new Date();

            _(memberObjects).each(function(member){
                membersArray.push({
                    _id: member._id,
                   startDate: startDate,
                   bg_img: '/conversationBGDefault.jpg'
                });
            });

            var message = {
                author: Meteor.userId(),
                createdAt: new Date(),
                message: message
            };
            var notification = {
                type: 'conversation',
                action: 'created',
                createdAt: new Date(),
                contextTitle: subject,
                from: Meteor.userId(),
                to: _(membersArray.slice(1)).pluck('_id')
            };
            var conversation = {
                members: membersArray,
                members_count: membersArray.length,
                author: membersArray[0]._id,
                last_modified: message.createdAt,
                subject: subject
            };

            Meteor.call('insertConversation',conversation,function(err,conversation_id){
                if (err) console.log('insertConversation ERROR: ' + err.reason);
                if (conversation_id){
                    message.conversation_id = conversation_id;
                    notification.urlParameters = {template: 'conversation', _id: conversation_id};
                    Meteor.call('insertConversationAlerts',conversation_id,Session.get('memberList'),function(err,res){
                        if(err) console.log('insertConversationAlerts ERROR: ' + err.reason);
                    });
                    Meteor.call('insertMessage',message,function(err,message_id){
                        if (err) console.log('insertMessage ERROR: ' + err.reason);
                    });
                    NotificationsCreator.createNotification(notification,function(err){
                        if (err) console.log('insertNotification ERROR: ' + err.reason);
                    });
                    Router.go('conversation',{_id: conversation_id});
                }
            });
        }else{
            if (!message){
                $("#inputMessageBox")
                    .append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Please, write a message before!!</p>');
            }
            if (memberObjects.length <2){
                $("#inputMembersBox")
                    .append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Conversation should have almost 2 members</p>');
            }
        }

    }
});
