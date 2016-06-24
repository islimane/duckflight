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

Records = new Mongo.Collection ('records');
HistoryRecords = new Mongo.Collection('historyRecords');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
		Meteor.call('updateTags',record.tags);
		if (record.channel_id){
			Meteor.call('incrementChannelRecord',record.channel_id);
		}
		if(record.lesson_id){
			Meteor.call('incrementSectionRecord',record.section_id);
		}
		if(record.parent_id){
			Records.update(record.parent_id,{$inc: {replies_count: 1}});
		}
		return {_id: id};
	},
	voteRecord: function(record_id,user_id,inc){
		Records.update(record_id,{$inc: {votes_count: inc}});
		if(inc > 0){
			Votes.insert({record_id: record_id,user_id: user_id});
		}else{
			Votes.remove({record_id: record_id,user_id: user_id});
		}
	},
	insertHistoryRecord: function(record_id,user_id){
		if (HistoryRecords.find().count() > 1){
			var first = HistoryRecords.findOne();
			HistoryRecords.remove(first._id);
		};
		return HistoryRecords.update({record_id: record_id, user_id: user_id},
							  {$setOnInsert: {record_id: record_id, user_id: user_id}},
							  {upsert: true});
	},
	incrementRecordComment: function(record_id){
		Records.update(record_id,{$inc: {comments_count: 1}});
	},
	changeTrackOrder: function(object){
		var toUpRecord,toDownRecord;
		var currentRecord = Records.findOne({_id: object.record_id});
		switch(object.mode){
			case 'up':
				toUpRecord = currentRecord;
				toDownRecord = Records.findOne({section_id: object.section_id, order: object.order -1});
				break;
			case 'down':
				toUpRecord = Records.findOne({section_id: object.section_id, order: object.order + 1});
				toDownRecord = currentRecord;
				break;
		}

		Records.update(toUpRecord._id,{$inc: {order: -1}},function(err,res){
			if(res){
				Records.update(toDownRecord._id,{$inc: {order: 1}});
			}
		});
	},
	recordRemove: function(record_id){
		var record = Records.findOne(record_id);
		//borrado de los votos
		Votes.remove({record_id: record_id});
		//borrado de los documentos
		Documents.remove({record: record_id});
		//borrado de los comentarios
		Comments.remove({context_id: record_id});
		//decrease counters and re-ordering sections.
		if (record.channel_id && !record.isReply){
			Channels.update(record.channel_id,{$inc: {records_count: -1}});
		}
		if(record.section_id && !record.isReply){
			//update counter in section
			Sections.update(record.section_id,{$inc: {records_count: -1}});
			//update order in section
			var sectionRecords = Records.find({section_id: record.section_id, order: {$gt: record.order}}).fetch();
			_(sectionRecords).each(function(r){
				Records.update(r._id,{$inc: {order: -1}});
			});
		}
		if(record.parent_id){
			Records.update(record.parent_id,{$inc: {replies_count: -1}});
		}
		return Records.remove(record_id);
	}
});