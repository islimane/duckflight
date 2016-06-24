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

Sections = new Mongo.Collection('sections');


Meteor.methods({
    insertSection: function(section){
        Lessons.update({_id: section.lesson_id},{$inc: {sections_count: 1}});
        return Sections.insert(section);
    },
    updateSectionPlayOption: function(user_id,option,value){
        switch(option){
            case 'auto-play':
                return Meteor.users.update({_id: user_id},{$set: {auto_play: value}});
                break;
            case 'auto-repeat':
                return Meteor.users.update({_id: user_id},{$set: {auto_repeat: value}});
                break;
        }
    },
    incrementSectionRecord: function(section_id){
        Sections.update({_id: section_id},{$inc: {records_count: 1}});
    },
    removeSection: function(section_id){
        var section = Sections.findOne(section_id);
        var nextSections = Sections.find({lesson_id: section.lesson_id, order: {$gt: section.order}}).fetch();
        _(nextSections).each(function(s){
            Sections.update(s._id,{$inc: {order: -1}});
        });
        Lessons.update({_id: section.lesson_id},{$inc: {sections_count: -1}});
        return Sections.remove(section_id);
    }
});
