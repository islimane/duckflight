Records = new Mongo.Collection ('records');
HistoryRecords = new Mongo.Collection('historyRecords');

Meteor.methods ({
	insertRecord: function(record){
		var id = Records.insert(record);
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