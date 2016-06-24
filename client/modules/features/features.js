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

Template.features.helpers({
    sectionData: function(){
        Session.set('currentImage',Session.get('section').images[0]);
        return Session.get('section');
    }
});

Template.featureDetail.helpers({
    class: function(){
        return this.id.split('-')[0];
    }
});

Template.gallery.events({
    'click img': function(){
        Session.set('currentImage',this);
        $('.image-full-screen').addClass('active');
    }
});

Template.galleryFullScreen.helpers({
    imageFeature: function(){
        return Session.get('currentImage');
    },
    isPossibleNext: function(){
        var images = Session.get('section').images;
        var currentIdx = Session.get('currentImage').order;
        return images.length -1 > currentIdx;
    },
    isPossiblePrev: function(){
        var currentIdx = Session.get('currentImage').order;
        return currentIdx;
    },
});

Template.galleryFullScreen.events({
    'click #close-gallery': function(){
        $('.image-full-screen').removeClass('active');
    },
    'click #prev': function(){
        var newIdx = Session.get('currentImage').order - 1;
        Session.set('currentImage',Session.get('section').images[newIdx]);
    },
    'click #next': function(){
        var newIdx = Session.get('currentImage').order + 1;
        Session.set('currentImage',Session.get('section').images[newIdx]);
    }
});