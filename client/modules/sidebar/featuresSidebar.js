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

Template.featuresSidebar.helpers({
    navFeatures: function(){
        var features = [
            {
                name: 'Code + audio recordings',
                id: 'records-section',
                icon: 'fa-film',
                mainImage: 'record-mockup.png',
                mainDescription: 'Create rich audio recordings on a code editor based in documments, publish them and modify them at any time while playing',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7463/26448642584_d7c1e98a89_b.jpg',
                        description: 'Explore records',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7488/26448642604_ec7827f87e_b.jpg',
                        description: 'Play a record',
                        order: 1
                    },
                    {
                        link:'https://farm8.staticflickr.com/7628/26779565860_4fc9df0d7a_b.jpg',
                        description: 'Comment a record',
                        order: 1
                    }
                ]
            },
            {
                name: 'Organize recordings in Channels',
                id: 'channels-section',
                icon: 'fa-desktop',
                mainImage: 'channel-mockup.png',
                mainDescription: 'Create a channel for you and other users contribute content and subscribe to receive notifications.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7355/26985840801_4b55b7fe34_b.jpg',
                        description: 'Explore channels',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7054/26779566000_4fc9df0d7a_b.jpg',
                        description: 'Explore a channel',
                        order: 1
                    },
                    {
                        link:'https://farm8.staticflickr.com/7628/26779565860_4fc9df0d7a_b.jpg',
                        description: 'Comment a channel',
                        order: 2
                    },
                    {
                        link:'https://farm8.staticflickr.com/7580/26448644634_0acdc29d66_b.jpg',
                        description: 'Edit your channel',
                        order: 3
                    },
                    {
                        link:'https://farm8.staticflickr.com/7014/26960030582_38c2151e5c_b.jpg',
                        description: 'Subscribe and vote',
                        order: 4
                    }
                ]
            },
            {
                name: 'Learn & share with Lessons',
                id: 'lessons-section',
                icon: 'fa-graduation-cap',
                mainImage: 'lesson-mockup.png',
                mainDescription: 'Create a lesson to share your knowledge on a topic or subscribe to any and learn.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7453/26448643224_272b572d6b_b.jpg',
                        description: 'Explore lessons',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7528/26450493073_18ac059e2a_b.jpg',
                        description: 'Explore your lesson',
                        order: 1
                    },
                    {
                        link:'https://farm8.staticflickr.com/7628/26779565860_4fc9df0d7a_b.jpg',
                        description: 'Comment a lesson',
                        order: 2
                    },
                    {
                        link:'https://farm8.staticflickr.com/7538/26779564480_1a630b904a_b.jpg',
                        description: 'Edit your lesson',
                        order: 3
                    },
                    {
                        link:'https://farm8.staticflickr.com/7014/26960030582_38c2151e5c_b.jpg',
                        description: 'Subscribe and vote',
                        order: 4
                    }
                ]
            },
            {
                name: 'Replies for code + audio recordings',
                id: 'replies-section',
                icon: 'fa-code-fork',
                mainImage: 'replies-mockup.png',
                mainDescription: 'Pause playback at any time and creates a response from that state.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7711/27021058466_618797fcbd_b.jpg',
                        description: 'Create a reply for a record',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7711/27021058466_618797fcbd_b.jpg',
                        description: 'Explore replies from a record',
                        order: 1
                    }
                ]
            },
            {
                name: 'Browse your profile',
                id: 'profile-section',
                icon: 'fa-user',
                mainImage: 'profile-mockup.png',
                mainDescription: 'Explore your profile page and discover awesome functionalities and settings.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7566/26448642974_246e76fd99_b.jpg',
                        description: 'Explore your channels, lessons and records in your profile page',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7572/26779566160_d760db6e08_m.jpg',
                        description: 'Access in you profile through box user placed in sidebar',
                        order: 1
                    },
                    {
                        link:'https://farm8.staticflickr.com/7046/26779564280_3f9edd9b79_b.jpg',
                        description: 'Edit your profile',
                        order: 2
                    },
                    {
                        link:'https://farm8.staticflickr.com/7633/26448644134_a9fa54ed67_b.jpg',
                        description: 'View your contacts list',
                        order: 3
                    },
                    {
                        link:'https://farm8.staticflickr.com/7724/26779565040_2f2085c2be_b.jpg',
                        description: 'View you conversations list',
                        order: 4
                    },
                    {
                        link:'https://farm8.staticflickr.com/7480/26779564660_8785c2e59a_z.jpg',
                        description: 'Recover your password',
                        order: 5
                    },
                    {
                        link:'https://farm8.staticflickr.com/7507/26779566040_624b4ec23a_m.jpg',
                        description: 'Change your password',
                        order: 6
                    },
                    {
                        link:'https://farm8.staticflickr.com/7276/26960030342_8ced666148_z.jpg',
                        description: 'Verify your emails',
                        order: 7
                    },
                    {
                        link:'https://farm8.staticflickr.com/7577/26779682990_d599823185_b.jpg',
                        description: 'Manage your contents',
                        order: 8
                    }
                ]
            },
            {
                name: 'Add other users to your contacts',
                id: 'contacts-section',
                icon: 'fa-user-plus',
                mainImage: 'contacts-mockup.png',
                mainDescription: 'Make grow your contacts list for better experience.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7300/26779565450_b44c9b1d05_b.jpg',
                        description: 'send contact requests from your profile',
                        order: 0
                    }
                ]
            },
            {
                name: 'Interact with your contacts',
                id: 'conversations-section',
                icon: 'fa-users',
                mainImage: 'conversation-mockup.png',
                mainDescription: 'Create conversations with your contacts and communicate in an amazing way. No limits! The more the merrier!',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7155/26779565280_a3c434ba94_b.jpg',
                        description: 'Create a conversation with your contacts and enjoy!',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7059/26779565440_7e30050dba_b.jpg',
                        description: 'Change settings for a conversation. You will have more flexibility if you are the leader!',
                        order: 1
                    }
                ]
            },
            {
                name: 'Email sender',
                id: 'emails-section',
                icon: 'fa-envelope-o',
                mainImage: 'email-sender-mockup.png',
                mainDescription: 'Once verified your email you can send emails to all your contacts whose emails are verified. Share images, files and more.',
                images: [
                    {
                        link:'https://farm8.staticflickr.com/7455/26779564780_bbb59993cb_z.jpg',
                        description: 'Choose one of your emails to set the origin address.',
                        order: 0
                    },
                    {
                        link:'https://farm8.staticflickr.com/7132/26779564800_6a918bc4ce_c.jpg',
                        description: 'Choose from your contacts to set destination addresses and write you mail',
                        order: 1
                    }
                ]
            }
        ];
        return features;
    }
});

Template.featuresSidebar.events({
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
    'click .section-title': function(e){
        $('.section-title').removeClass('active');
        $(e.currentTarget).addClass('active');
        Session.set('section',this);
    }
});

Template.featuresSidebar.rendered = function(){
    var query = Router.current().params.query;
    if (query.section){
        $('#' + query.section + '-section').click();
    }else{
        $('#records-section').click();
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