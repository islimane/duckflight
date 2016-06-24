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

Template.tutorialsSidebar.helpers({
    channelsNav: function(){
        var channelsNav = [
            {title: 'Browse channels', section: 'channels', order: 0,video_id: 'QMyajwNo3b8',
            content: '<p>You can browse the channels by clicking on the relevant section from the sidebar or the main page.<br>You can view the latest and the most popular or if you prefer a more advanced search.</p>'},
            {title: 'Create a new channel', section: 'channels', order: 1,video_id: 'uqgWCiejgXM',
            content: '<p>You can create a new channels by clicking <i class="fa fa-plus-circle"></i> on the relevant section from the sidebar, the channels page or from the relevant tab from your profile.</p>'},
            {title: 'Create records', section: 'channels', order: 2,video_id: 'B6wJ14IPqoU',
            content: '<p>You can create new records for a channel on the relevant tab from the channel page</p>'},
            {title: 'Change settings', section: 'channels', order: 3,video_id: 'WMQz4lwYGCU',
            content: '<p>If you are the owner of a channel, you can change its settings (banner, miniature image, tags) by clicking <i class="fa fa-pencil"></i></p>'},
            {title: 'Comment a channel', section: 'channels', order: 4,video_id: 'tFA41xrcGlU',
            content: '<p>Comment a channel in the space destinied for that. You can write a reply for any comment.</p>'},
            {title: 'Subscribe & vote', section: 'channels', order: 5,video_id: 'v9kA_PpxoME',
            content: '<p>Subscribe to a channel for receive notifications about comments, contents and more!<br>Vote channels for view more recommendations.</p>'}
        ];
        return channelsNav;
    },
    lessonsNav: function(){
        var lessonsNav = [
            {title: 'Browse lessons', section: 'lessons', order: 0,video_id: 'driBJ-LyvD4',
                content: '<p>You can browse the lessons by clicking on the relevant section from the sidebar or the main page.<br>You can view the latest and the most popular or if you prefer a more advanced search.</p>'},
            {title: 'Create a new lesson', section: 'lessons', order: 1,video_id: 'KzelhogdWz4',
                content: '<p>You can create a new lesson by clicking <i class="fa fa-plus-circle"></i> on the relevant section from the sidebar, the lessons page or from the relevant tab from your profile.</p>'},
            {title: 'Create sections', section: 'lessons', order: 2,video_id: 'epDHxkhJB1M',
                content: '<p>If you are the owner of a lesson, you can create its main content based in sections in the sections tab.</p>'},
            {title: 'Create tracks', section: 'lessons', order: 3,video_id: 'IMJswwfTgfs',
                content: '<p>For each section from your lesson you can create a new track for its track list.</p>'},
            {title: 'Play contents', section: 'lessons', order: 4,video_id: 'jWxR_F5SRr0',
                content: "<p>For each section from your lesson you can play its track list and change the tracks's order</p>"},
            {title: 'Change settings & order', section: 'lessons', order: 5,video_id: 'gZT679jlDVc',
                content: '<p>If you are the owner of a lesson, you can change its settings (miniature image, tags) and change the order of its sections by clicking <i class="fa fa-pencil"></i></p>'},
            {title: 'PlayList options', section: 'lessons', order: 6,video_id: '4H8eqQ82CDw',
                content: "<p>You can access to player's playlist panel by clicking <i class='fa fa-menu'></i> on player's right corner. <br> You can set autoplay and autorepeat. </p>"},
            {title: 'Comment a lesson', section: 'lessons', order: 7,video_id: 'jrd5GRfUq0A',
                content: '<p>Comment a lesson in the space destinied for that. You can write a reply for any comment.</p>'},
            {title: 'Subscribe & vote', section: 'lessons', order: 8,video_id: 'lyq8SapMUTY',
                content: '<p>Subscribe to a lesson for receive notifications about comments, contents and more!<br>Vote channels for view more recommendations.</p>'}
        ];
        return lessonsNav;
    },
    recordsNav: function(){
        var recordsNav = [
            {title: 'Browse records', section: 'records', order: 0,video_id: 'OCfmpNfBH2Y',
                content: '<p>You can browse the records by clicking on the relevant section from the sidebar or the main page.<br>You can view the latest and the most popular or if you prefer a more advanced search.</p>'},
            {title: 'Create a new record', section: 'records', order: 1,video_id: 'Ds-TkabK-Xo',
                content: '<p>You can create a new record by clicking <i class="fa fa-plus-circle"></i> on the relevant section from the sidebar, the records page or from the relevant tab from your profile.</p>'},
            {title: 'Upload your record', section: 'records', order: 2,video_id: 'UQ4LA7pMjsE',
                content: '<p>First press <i class="fa fa-stop"></i>. Secondly press <i class="fa fa-save"></i> and later complete the form and submit.</p>'},
            {title: 'Play a record', section: 'records', order: 3,video_id: 'Y_RA_IQUorY',
                content: "<p>Click any record's miniature and enjoy.</p>"},
            {title: 'Comment a record', section: 'records', order: 4,video_id: 'G7kOPIwtiXM',
                content: '<p>Comment a record in the space destinied for that. You can write a reply for any comment.</p>'},
            {title: 'Create a reply', section: 'records', order: 5,video_id: 'oZEIx3xMaTc',
                content: "<p>To create a reply for a record you must pause it or wait to finish. Then click in the <i class='fa fa-code-fork'></i> button.<br> The recorder starts at the instant you have choosed by pausing or waitting for the record's end.</p>"},
            {title: 'Browse replies', section: 'records', order: 6,video_id: 'pE7Z45vs6pw',
                content: '<p>Browse replies for a specific record on the relevant tab in the record page.</p>'},
            {title: 'Browse related', section: 'records', order: 7,video_id: 'pE7Z45vs6pw',
                content: '<p>Browse related records for a specific record on the relevant tab in the record page.</p>'},
        ];
        return recordsNav;
    }
});

Template.tutorialsSidebar.events({
    'click #close-sidebar': function(e){
        $(e.currentTarget).removeClass('active');
        $('#sidebar-wrapper').addClass('unactive');
    },

    'click .close-toggle': function(){
        if($(window).width() <= 900){
            $('#sidebar-wrapper').addClass('unactive');
            $('#close-sidebar').removeClass('active');
        }
    },
    'click .section-title a': function(e){
        console.log($(e.currentTarget)[0].id);
        console.log('holaaaa');
        Session.set('section',$(e.currentTarget)[0].id);
        $($(e.currentTarget).parent().parent().find('li')[0]).children().click();
    },
    'click .nav-sidebar li a': function(e){
        $('.nav-sidebar li a').removeClass('active');
        $(e.currentTarget).addClass('active');
        Session.set('section', this.section);
        Session.set('subsection', this);
    }
});

Template.tutorialsSidebar.rendered = function(){
    var query = Router.current().params.query;
    if (query.section){
        console.log('holaaa section');
        $('#' + query.section + ' .section-title a').click();
    }else{
        $('#channels-section .section-title a').click();
    }
    if (query.subsection && query.section){
        $($('#' + query.section).find('li')[parseInt(query.subsection)]).children().click();
    }else{
        $($('#channels-section').find('li')[0]).children().click();
    }

    function closeSidebar(){
        $('#sidebar-wrapper').addClass('unactive');
        $(window).off('resize');
        openHandler();
    }

    function openSidebar(){
        $('#sidebar-wrapper').removeClass('unactive');
        $('#close-sidebar').removeClass('active'); //if it was active and we do click on it sidebar will close (important!!)
        $(window).off('resize');
        closeHandler();
    }

    function openHandler(){
        $(window).resize(function(){
            if($(window).width() > 990) openSidebar();
        });
    }

    function closeHandler(){
        $(window).resize(function(){
            if($(window).width() <= 990) closeSidebar();
        });
    }

    function initialzeSidebar (){
        ($(window).width()<= 990) ? closeSidebar() : openSidebar();
    }
    /* end sidebar display events */

    initialzeSidebar();
};

Template.tutorialsSidebar.destroyed = function(){
    Session.set('section',null);
    Session.set('subsection', null);
};