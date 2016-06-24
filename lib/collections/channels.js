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

Channels = new Mongo.Collection ('channels');
Votes = new Mongo.Collection('votes');


Meteor.methods ({
	insertChannel: function(channel){
		var id = Channels.insert(channel);
		Meteor.call('updateTags',channel.tags);
		return {_id: id};
	},
	updateTags: function (tagsArray){
		if (tagsArray.length) {
			console.log(Tags.find().count());
			console.log(Tags)
			var oldTags = Tags.find().fetch();
			var newTags = _(tagsArray).filter(function (tag) {
				return _(oldTags).any(function (ot) {
					return ot.name !== tag.name;
				})
			});
			console.log(newTags);
			_(newTags).each(function (tag) {
				Tags.insert(tag);
			});
			console.log(Tags.find().count());
		}
	},
	voteChannel: function(channel_id,user_id,inc){
		Channels.update(channel_id,{$inc: {votes_count: inc}});
		if(inc > 0){
			Votes.insert({channel_id: channel_id,user_id: user_id});
		}else{
			Votes.remove({channel_id: channel_id,user_id: user_id});
		}

	},
	incrementChannelComment: function(channel_id){
		Channels.update(channel_id,{$inc: {comments_count: 1}});
	},
	incrementChannelRecord: function(channel_id){
		Channels.update(channel_id,{$inc: {records_count: 1}});
	},
	channelUpdate: function(channel_id,params){
		return Channels.update(channel_id,{$set: params});
	},
	insertUserEnrolledChannel: function(channel_id, user_id){
		Channels.update({_id: channel_id},{$inc: {users_count: 1}});
		return UsersEnrolled.insert({context_id: channel_id, user_id: user_id});
	},
	removeUserEnrolledChannel: function(channel_id,user_id){
		Channels.update({_id: channel_id},{$inc: {users_count: -1}});
		return UsersEnrolled.remove({context_id: channel_id, user_id: user_id});
	},
	channelRemove: function(channel_id){
		var channel = Channels.findOne(channel_id);
		//borrado de los usuarios subscritos
		UsersEnrolled.remove({context_id: channel._id});
		//borrado de los commentarios
		Comments.remove({context_id: channel._id});
		//borrado de los votos del canal
		Votes.remove({channel_id: channel._id});
		//borrado del canal.
		return Channels.remove(channel._id);
	}
});