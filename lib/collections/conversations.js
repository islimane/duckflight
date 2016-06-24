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

Conversations = new Mongo.Collection('conversations');
ConversationAlerts = new Mongo.Collection('conversationAlerts');

Meteor.methods({
    insertConversation: function(conversation){
        return Conversations.insert(conversation);
    },
    updateLatestMsgConversation: function(conversation_id,message_id){
        var message = Messages.findOne(message_id);
        Conversations.update(conversation_id,{$set: {last_modified: message.createdAt}, $inc: {messages_count: 1}});
        ConversationAlerts.update({conversation_id: message.conversation_id, alertsAllow: true},{$inc: {alerts_count: 1}},{multi: true});
    },
    conversationUpdate: function(conversation_id,updateParams,updateMembersObject){
        var params = {};
        params.author = updateParams.leader;
        params.subject = updateParams.subject;
        params.members = updateParams.members;

        if(updateMembersObject){
            _(updateMembersObject.membersExpelled).each(function(member){
                ConversationAlerts.remove({conversation_id: conversation_id, user_id: member._id});
            });
            _(updateMembersObject.membersAdded).each(function(member){
                var conversationAlertObject = {
                    user_id: member._id,
                    conversation_id: conversation_id,
                    alertsAllow: true,
                    alerts_count: 0
                };
                ConversationAlerts.insert(conversationAlertObject);
            });
        }
        return Conversations.update(conversation_id,{$set: params});
    },
    conversationExit: function(conversation_id,user_id){
        var members = Conversations.findOne(conversation_id).members;
        members = _(members).filter(function(member){
            return member._id != user_id;
        });
        Conversations.update(conversation_id,{$set: {members: members}});
        ConversationAlerts.remove({conversation_id: conversation_id, user_id: user_id});
    },
    insertConversationAlerts: function(conversation_id,members){
        _(members).each(function(member){
            var conversationAlertObject = {
                user_id: member._id,
                conversation_id: conversation_id,
                alertsAllow: true,
                alerts_count: 0
            };
            return ConversationAlerts.insert(conversationAlertObject);
        });
    },
    changeDateFilterMessages: function(conversation_id,user_id){
        var members = Conversations.findOne(conversation_id).members;
        members = _(members).map(function(m){
            if(m._id == user_id) m.startDate = new Date();
            return m;
        });
        Conversations.update({_id: conversation_id},{$set: {members: members}});
    },
    allowAlerts: function(conversation_id,user_id){
        ConversationAlerts.update({user_id: user_id, conversation_id: conversation_id},{$set: {alertsAllow: true}},{upsert: true});
    },
    denyAlerts: function(conversation_id,user_id){
        ConversationAlerts.update({user_id: user_id, conversation_id: conversation_id},{$set: {alertsAllow: false, alerts_count: 0}},{upsert: true});
    }
});