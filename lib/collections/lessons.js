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

Lessons = new Mongo.Collection ('lessons');
UsersEnrolled = new Mongo.Collection('usersEnrolled');

Meteor.methods ({
    insertLesson: function(lesson){
        var id = Lessons.insert(lesson);
        Meteor.call('updateTags',lesson.tags);
        return {_id: id};
    },
    insertUserEnrolledLesson: function(lesson_id, user_id){
        Lessons.update({_id: lesson_id},{$inc: {users_count: 1}});
        return UsersEnrolled.insert({context_id: lesson_id, user_id: user_id});
    },
    removeUserEnrolledLesson: function(lesson_id,user_id){
        Lessons.update({_id: lesson_id},{$inc: {users_count: -1}});
        return UsersEnrolled.remove({context_id: lesson_id, user_id: user_id});
    },
    incrementLessonComment: function(lesson_id){
        Lessons.update(lesson_id,{$inc: {comments_count: 1}});
    },
    lessonUpdate: function(lesson_id,objectUpdate){
        _(objectUpdate.sections).each(function(section){
            Sections.update(section._id,{$set: {order: section.order}});
        });
        return Lessons.update(lesson_id,{$set: _(objectUpdate).omit('sections')});
    },
    voteLesson: function(lesson_id,user_id,inc){
        Lessons.update(lesson_id,{$inc: {votes_count: inc}});
        if(inc > 0){
            Votes.insert({lesson_id: lesson_id,user_id: user_id});
        }else{
            Votes.remove({lesson_id: lesson_id,user_id: user_id});
        }
    },
    lessonRemove: function(lesson_id){
        var lesson = Lessons.findOne(lesson_id);
        //borrado de los usuarios subscritos
        UsersEnrolled.remove({context_id: lesson._id});
        //borrado de los commentarios
        Comments.remove({context_id: lesson._id});
        //borrado de los votos
        Votes.remove({lesson_id: lesson._id});
        //borrado de las secciones
        Sections.remove({lesson_id: lesson._id});
        //borrado del canal.
        return Lessons.remove(lesson._id);
    }
});