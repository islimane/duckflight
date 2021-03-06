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

Template.lessonEdit.events({
    'submit form': function(e){
        e.preventDefault();
        var channel_id = this._id;
        Meteor.call('lessonUpdate',this._id,Session.get('userObject'),function(err,res){
            if(res){
                Router.go('lesson',{_id: channel_id});
            }
            if (err){
                console.log('error: ' + err);
            }
        });
    }
});

Template.lessonEdit.created = function(){
    Session.set('formType','formProfileEdit');
    var arraySections = [];

    _(Sections.find({lesson_id: this.data._id},{sort: {order: 1}}).fetch()).each(function(section){
        arraySections.push({_id: section._id, title: section.title, order: section.order});
    });

    var lessonObject = {
        img: this.data.img || '/lessonDefault.png',
        description: this.data.description,
        imgDefault: '/lessonDefault.png',
        tagsAllow: this.data.tagsAllow || true,
        tags: (this.data.tags) ? this.data.tags : [],
        sectionConfigAllow: true,
        sections: arraySections
    };
    Session.set('userObject',lessonObject);
};

Template.lessonEdit.destroyed = function(){
    Session.set('userObject',null);
    Session.set('tagsChoosen',null);
    Session.set('sections',null);
};