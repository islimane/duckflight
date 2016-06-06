//RECORDS
Meteor.publishComposite('records',function(){
	var sub = {
		collection: 'records',
		find: function(){
			return Records.find({},{params: {RC:0}});
		},
		children: [
			{
				find: function(record){
					return Meteor.users.find(record.author,{params: {username: 1}})
				}
			},
			{
				find: function(record){
					return Channels.find(record.channel_id,{params: {_id: 1}});
				}
			},
			{
				find: function(record){
					return Channels.find(record.lesson_id,{params: {_id: 1}});
				}
			},
			{
				find: function(record){
					return Records.find(record.parent_id,{params: {_id: 1}});
				}
			}
		]

	};
	return sub;
});

Meteor.publish('recordShort',function(record_id){
	return Records.find(record_id,{fields: {title: 1,author: 1}});
});
Meteor.publishComposite('recordComposite',function(record_id,user_id){
	var sub = {
		collection: 'records',
		find: function(){
			return Records.find({_id: record_id});
		},
		children: [
			{//documents
				find: function(){return Documents.find({record: record_id});}
			},
			{//author
				find: function(record){return Meteor.users.find({_id: record.author});}
			},
			{//channel
				collection: 'channels',
				find: function(record){return Channels.find(record.channel_id)},
				children: [
					{
						find: function(channel){
							return UsersEnrolled.find({context_id: channel._id});
						}
					}
				]
			},
			{//lesson
				collection: 'lessons',
				find: function(record){return Lessons.find(record.lesson_id)},
				children: [
					{
						find: function(lesson){
							return UsersEnrolled.find({context_id: lesson._id});
						}
					}
				]
			},
			{//sections
				find: function(record){return Sections.find(record.section_id)}
			},
			{//recordsSameSection
				find: function(record){
					if (record.lesson_id){
						return Records.find({lesson_id: record.lesson_id,section_id: record.section_id},
										{params:{RC: 0, createdAt: 0, description: 0, tags: 0},sort: {order: 1}});
					}
				}
			},
			{//votes
				find: function(record){
					return Votes.find({record_id: record._id,user_id: user_id});
				}
			},
			{//commentsByRecord
				collection: 'comments',
				find: function(record){
					return Comments.find({contextId: record._id});
				},
				children: [{
					find: function(comment){
						return Meteor.users.find(comment.author,{params: {avatar: 1, username: 1}});
					}
				}]
			},
			{//relatedByTags
				collection: 'records',
				find: function(record){
					Records.find({_id: {$ne: record._id}, isReply: false,tags: {$in: record.tags}},
								 {limit: 10, sort: {votes_count: -1},params: {RC:0, tags: 0}})
				},
				children: [
					{//author
						find: function(related){
							Meteor.users.find(related.author,{params: {avatar: 1,username: 1}});
						}
					}
				]
			},
			{//replies
				collection: 'records',
				find: function(record){
					return Records.find({parent_id: record._id},{params: {RC: 0, tags: 0}});
				},
				children: [
					{//author
						find: function(reply){
							return Meteor.users.find(reply.author,{params: {username: 1}})
						}
					}
				]
			}
		]
	};
	return sub;
});

Meteor.publish('recordsRanking',function(){
	return Records.find({},{params: {RC: 0}, limit: 5, sort: {votes_count: -1, createdAt: -1}});
});


Meteor.publish('recordsByUser',function(user_id){
	return Records.find({author: user_id});
});

Meteor.publish('recordsByUserRanking',function(user_id){
	return Records.find({author: user_id},{sort: {votes: -1}});
});


//CHANNELS
Meteor.publishComposite('channels',function(){

	var sub = {
		collection: 'channels',
		find: function(){
			return Channels.find({});
		},
		children: [{
			find: function(channel){
				return Meteor.users.find(channel.author,{params: {username: 1}});
			}
		}]
	};

	return sub;
});

Meteor.publish('channel',function(channel_id){
	return Channels.find({_id: channel_id});
});

Meteor.publishComposite('channelShort',function(channel_id){
	var sub = {
		collection: 'channels',
		find: function(){
			return Channels.find(channel_id,{fields: {title: 1,author: 1}});
		},
		children: [
			{
				find: function(channel){
					return UsersEnrolled.find({context_id: channel._id},{fields: {user_id: 1}});
				}
			}
		]
	}
	return sub;
});

Meteor.publishComposite ('channelComposite',function(channel_id, user_id){
	var sub = {
		collection: 'channels',
		find: function(){
			return Channels.find({_id: channel_id});
		},
		children: [
			{//authorChannel
				find: function(channel){
					return Meteor.users.find(channel.author);
				}
			},
			{//recordsByChannel
				collection: 'records',
				find: function(channel){
					return Records.find({channel_id: channel._id, isReply: false},{params: {RC: 0},sort: {createdAt: -1}});
				},
				children: [{
					find: function(record){
						return Meteor.users.find(record.author,{params: {username: 1}});
					}
				}]
			},
			{//commentsByChannel
				collection: 'comments',
				find: function(channel){
					return Comments.find({contextId: channel._id});
				},
				children: [{
					find: function(comment){
						return Meteor.users.find(comment.author,{params: {avatar: 1, username: 1}});
					}
				}]
			},
			{//UsersByChannel
				collection: 'usersEnrolledLesson',
				find: function(channel){
					return UsersEnrolled.find({context_id: channel._id});
				},
				children: [
					{
						find: function(userEnrolled){
							return Meteor.users.find(userEnrolled.user_id,{params: {avatar: 1, username: 1}});
						}
					}
				]
			},
			{//votesChannel
				find: function(channel){
					return Votes.find({channel_id: channel._id, user_id: user_id});
				}
			}
		]
	};
	return sub;
});


Meteor.publish('sidebarChannels',function(user_id){
	return Channels.find({author: user_id},{params: {title: 1},limit: 3});
});
Meteor.publish('channelsByUser',function(user_id){
	return Channels.find({author: user_id});
});

Meteor.publish('channelsRanking',function(){
	return Channels.find({},{params: {tags: 0, banner: 0, bannerDefault: 0, tagsAllow: 0},limit: 5 ,sort: {votes_count: -1}});
});

Meteor.publish('channelsByUserRanking',function(user_id){
	return Channels.find({author: user_id},{sort: {votes: -1}});
});





//COMMENTS
Meteor.publishComposite('commentsByContext',function(context_id){
	var sub = {
		collection: 'comments',
		find: function(){
			return Comments.find({contextId: context_id});
		},
		children: [{
			find: function(comment){
				return Meteor.users.find(comment.author,{params: {avatar: 1, username: 1}});
			}
		}]
	};
	return sub;
});





//TEAMS
Meteor.publish('teams',function(){
	return Teams.find({});
});

Meteor.publish('sidebarTeams',function(user_id){
	return Teams.find({author: user_id},{$limit: 3});
});

Meteor.publish('team',function(team_id){
	return Teams.find({_id: team_id});
});

Meteor.publish('teamsByUser',function(user_id){
	return Teams.find({author: user_id});
});

Meteor.publish('teamsRanking',function(){
	return Teams.find({$orderby: {votes: -1}});
});

Meteor.publish('teamsByUserRanking',function(user_id){
	return Teams.find({author: user_id, $orderby: {votes: -1}});
});





//LESSONS
Meteor.publishComposite('lessons',function(){
	var sub = {
		collection: 'lessons',
		find: function(){
			return Lessons.find();
		},
		children: [{
			find: function(lesson){
				return Meteor.users.find(lesson.author,{params: {username: 1}});
			}
		}]
	};
	return sub;
});

Meteor.publish('lesson',function(lesson_id){
	return Lessons.find({_id: lesson_id});
});

Meteor.publishComposite('lessonShort',function(lesson_id){
	var sub = {
		collection: 'lessons',
		find: function(){
			return Lessons.find(lesson_id,{fields: {title: 1,author: 1}});
		},
		children: [
			{
				find: function(lesson){
					return UsersEnrolled.find({context_id: lesson._id},{fields: {user_id: 1}});
				}
			}
		]
	}
	return sub;
});

Meteor.publishComposite('lessonComposite',function(lesson_id,user_id){
	var sub = {
		collection: 'lessons',
		find: function(){
			return Lessons.find({_id: lesson_id});
		},
		children: [
			{//authorLesson
				find: function(lesson){
					return Meteor.users.find(lesson.author);
				}
			},
			{//sectionsByLesson
				collection: 'sections',
				find: function(lesson){
					return Sections.find({lesson_id: lesson._id});
				},
				children: [{//recordsBySection
					find: function(section){
						return Records.find({section_id: section._id, isReply: false},{params: {RC: 0, author: 0}, sort: {order: 1}});
					}
				}]
			},
			{//commentsByLesson
				collection: 'comments',
				find: function(lesson){
					return Comments.find({contextId: lesson._id});
				},
				children: [{
					find: function(lesson){
						return Meteor.users.find(lesson.author,{params: {avatar: 1, username: 1}});
					}
				}]
			},
			{//UsersByLesson
				collection: 'usersEnrolledLesson',
				find: function(lesson){
					return UsersEnrolled.find({context_id: lesson._id});
				},
				children: [
					{
						find: function(userEnrolled){
							return Meteor.users.find(userEnrolled.user_id,{params: {avatar: 1, username: 1}});
						}
					}
				]
			},
			{//votesLesson
				find: function(lesson){
					return Votes.find({lesson_id: lesson._id, user_id: user_id});
				}
			}
		]
	};
	return sub;
});

Meteor.publish('sectionsByLesson',function(lesson_id){
	return Sections.find({lesson_id: lesson_id},{sort: {order: 1}});
});

Meteor.publish('sidebarLessons',function(user_id){
	return Lessons.find({author: user_id},{params: {title: 1},$limit: 3}); //title only
});

Meteor.publish('lessonsByUser',function(user_id){
	return Lessons.find({author: user_id});
});

Meteor.publishComposite('userSubscriptions',function(user_id){
	var sub = {
		collection: 'usersEnrolled',
		find: function(){
			return UsersEnrolled.find({user_id: user_id});
		},
		children: [
			{
				collection: 'channels',
				find: function(subscription){
					return Channels.find(subscription.context_id);
				},
				children:[{
					find: function(channel){
						return Meteor.users.find(channel.author, {params: {username: 1}});
					}
				}]
			},
			{
				collection: 'lessons',
				find: function(subscription){
					return Lessons.find(subscription.context_id);
				},
				children:[{
					find: function(lesson){
						return Meteor.users.find(lesson.author, {params: {username: 1}});
					}
				}]
			}
		]
	};
	return sub;
});

Meteor.publishComposite('historyRecords',function(user_id){
	var sub = {
		collection: 'historyRecords',
		find: function(){
			return HistoryRecords.find({user_id: user_id});
		},
		children: [{
			collection: 'records',
			find: function(historyEntry){
				return Records.find(historyEntry.record_id,{params: {RC: 0}});
			},
			children: [{
				find: function(record){
					return Meteor.users.find(record.author,{params: {username: 1}});
				}
			}]
		}]
	};
	return sub;
});

Meteor.publish('lessonsRanking',function(){
	return Lessons.find({}, {limit: 5}, {sort: {votes_count: -1}});
});

Meteor.publish('lessonsByUserRanking',function(user_id){
	return Lessons.find({author: user_id},{sort: {votes: -1}});
});



//CONVERSATIONS

Meteor.publishComposite ('conversationsByUser',function(user_id){
	var sub = {
		collection: 'conversations',
		find: function(){
			return Conversations.find({members: {$elemMatch: {_id: user_id}}});
		},
		children: [{
			collection: 'messages',
			find: function(conversation){
				return Messages.find({conversation_id: conversation._id,type: {$exists: false}, createdAt: {$gte: conversation.last_modified}});
			},
			children: [{
				find: function(message){
					return Meteor.users.find({_id: message.author});
				}
			}]
		}]
	};
	return sub;
});

Meteor.publishComposite('conversationById',function(conversation_id,user_id){
	var sub = {
		collection: 'conversations',
		find: function(){
			return Conversations.find(conversation_id);
		},
		children: [
			{
				collection: 'messages',
				find: function(conversation){
					var member = _(conversation.members).find(function(m){return m._id == user_id});
					return Messages.find({conversation_id: conversation._id, createdAt: {$gt: member.startDate}});
				},
				children: [{
					find: function(message){
						return Meteor.users.find({_id: message.author});
					}
				}]
			},
			{
				find: function(conversation){
					var arrayMembersIds = [];
					_(conversation.members).each(function(member){
						arrayMembersIds.push(member._id);
					});
					return Meteor.users.find({_id: {$in: arrayMembersIds}});
				}
			}
		]
	};
	return sub;
});

Meteor.publishComposite('conversationsAlerts',function(user_id){
	var sub = {
		collection: 'conversations',
		find: function(){
			return Conversations.find({members: {$elemMatch: {_id: user_id}}},{params: {members: 0, createdAt: 0, author: 0}});
		},
		children: [
			{
				collection: 'conversationAlerts',
				find: function(conversation){
					return ConversationAlerts.find({conversation_id: conversation._id, user_id: user_id, alertsAllow: true, alerts_count: {$gt: 0}});
				},
				children: [
					{
						collection: 'messages',
						find: function(conversationAlert,conversation){
							return Messages.find({conversation_id: conversation._id,type: {$exists: false}, createdAt: {$gte: conversation.last_modified}});
						},
						children: [
							{
								find: function(message){
									return Meteor.users.find({_id: message.author});
								}
							}
						]
					}
				]
			}
		]
	};
	return sub;
});



//NOTIFICATIONS
Meteor.publish('notifications',function(){
	return Notifications.find();
});

Meteor.publishComposite('userNotifications',function(user_id){
	var sub = {
		collection: 'notifications',
		find: function(){
			return Notifications.find({to: user_id});
		},
		children: [
			{
				find: function(notification) {
					return Meteor.users.find(notification.from);
				}
			},
			{
				find: function(notification){
					if (notification.type == 'conversation'){
						return Conversations.find(notification.parentContext_id,{fields: {title: 1}});
					}
				}
			}
		]
	};
	return sub;
});





//USERS
Meteor.publish('allUsers',function(){
	return Meteor.users.find({},{fields: {username: 1, avatar: 1, banner: 1, description: 1}});
});

Meteor.publish('usersBySearch',function(searchVal){
	return Meteor.users.find({$where: function(){
		return this.username.toLowerCase().match(new RegExp(searchVal));
	}});
});

Meteor.publish('userById',function(user_id){
	return Meteor.users.find(user_id);
});




//RELATIONS
Meteor.publishComposite('contactsByUser',function(user_id){
	var sub = {
		find: function(){
			return Relations.find({users: user_id});
		},
		children: [{
			find: function(){
				var arrayIds = [];
				var cursor = Relations.find({users: user_id});
				_(cursor.fetch()).each(function(relation){
					var matchIds = _(relation.users).filter(function(id){
						return id !== user_id;
					});
					arrayIds.push(matchIds[0]);
				});
				return Meteor.users.find({_id: {$in: arrayIds}},{fields: {username: 1, avatar: 1, description: 1, status: 1}});
			}
		}]
	}
	return sub;
});

Meteor.publishComposite('contactsByUserWithEmail',function(user_id){
	var sub = {
		collection: 'Relations',
		find: function(){
			return Relations.find({users: user_id});
		},
		children: [{
			find: function(relation){
				var contactId = _(relation.users).find(function(id){return id !== user_id;});
				return Meteor.users.find({_id: contactId, emails:  {$exists: true, $elemMatch: {verified: true}}},{fields: {username: 1, avatar: 1, emails: 1}});
				//return Meteor.users.find({_id: contactId, emails:  {$exists: true}},{fields: {username: 1, avatar: 1,emails: 1}});
			}
		}]
	};
	return sub;
});

/*
//USERS ENROLLED

Meteor.publishComposite('usersEnrolled',function(context_id){
	var sub = {
		collection: 'usersEnrolledLesson',
		find: function(){
			return UsersEnrolled.find({context_id: context_id});
		},
		children: [
			{
				find: function(userEnrolled){
					return Meteor.users.find(userEnrolled.user_id,{params: {avatar: 1, username: 1}});
				}
			}
		]
	};
	return sub;
});
*/


//REQUESTS

Meteor.publishComposite('requestsByUser',function(user_id){
	var sub = {
		find: function(){
			return Requests.find({$or: [{'requested.id': user_id},{'applicant.id': user_id}]});
		},
		children: [
			{
				find: function(){
					var arrayIds = [];
					_(Requests.find({'applicant.id': user_id}).fetch()).each(function(elem){
						arrayIds.push(elem.requested.id);
					});
					_(Requests.find({'requested.id': user_id}).fetch()).each(function(elem){
						arrayIds.push(elem.applicant.id);
					});
					return Meteor.users.find({_id: {$in: arrayIds}});
				}
			}]
	};

	return sub;
});

//AUDIOS

Meteor.publish('audioRCData',function(){
	return AudioRCData.find();
});


//TAGS

Meteor.publish('tagsBySearch',function(searchValue){
	return Tags.find({name: new RegExp(searchValue)});
});

Meteor.publish('tags',function(){
	return Tags.find();
});

//VOTES

//record
Meteor.publish('voteRecordByUser',function(record_id,user_id){
	return Votes.find({record_id: record_id, user_id: user_id});
});


//DOCUMENTS

Meteor.publish('documentsRecord',function(record_id,start){
	return Documents.find({record: record_id,start: start});
});


//SEARCHING

Meteor.publish('searchResults',function(params){
	var sub;

	var paramsOmited = params;
	paramsOmited.query = _(params.query).omit('$exists');

	switch(params.category){
		case 'records':
			sub = Records.find(params.query, params.options);
			break;
		case 'channels':
			sub = Channels.find(paramsOmited.query, paramsOmited.options);
			break;
		case 'lessons':
			sub = Lessons.find(paramsOmited.query, paramsOmited.options);
			break;
		case 'all':
			sub = [Records.find(params.query, params.options),
					Channels.find(paramsOmited.query, paramsOmited.options),
					Lessons.find(paramsOmited.query, paramsOmited.options)];
			break;
	}
	return sub;
});


Meteor.publishComposite('tagsVoted', function(userId){
	var sub = {
		collection: 'votes',
		find: function(){
			return Votes.find({user_id: userId});
		},
		children: [
			{
				collection: 'tags',
				find: function(vote){
					var tags = [];

					if (vote.channel_id) tags = Channels.findOne(vote.channel_id).tags;
					if (vote.lesson_id)  tags = Lessons.findOne(vote.lesson_id).tags;
					if (vote.record_id)  tags = Records.findOne(vote.record_id).tags;

					var tagNames = _(tags).pluck('name');
					return Tags.find({name: {$in: tagNames}});
				}
			}
		]
	};
	return sub;
});

Meteor.publish('recommendations',function(contextsIds,tagsNames,limit){
	var cursorChannels = Channels.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: limit, sort: {votes: -1}});
	var cursorLessons =  Lessons.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}}},{limit: limit, sort: {votes: -1}});
	var cursorRecords =  Records.find({_id: {$nin: contextsIds}, tags: {$elemMatch: {name: {$in: tagsNames}}},fields: {RC:0}},{limit: limit, sort: {votes: -1}});
	return [cursorChannels,cursorLessons,cursorRecords];
});

