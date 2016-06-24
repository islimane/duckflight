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

Template.mainPage.events({
    'click .navigation-down': function(){
        $('#main-page-wrapper')
            .animate(
                {scrollTop: $(window).height() + $('#main-page-wrapper').scrollTop()},
                '500',
                'swing',
                function(){console.log('finish');}
            );
    },
    'click #tutorials': function(){
        window.open(Router.url('tutorials'));
    },
    'click .feature-description button': function(e){
        var id = $(e.currentTarget)[0].id;
        if (id !== 'tutorials'){
            window.open(Router.url('features',{},{query: 'section=' + id}));
        }
    },
    'click .social-icon': function(e){
        switch($(e.currentTarget)[0].id){
            case 'facebook':
                window.open('https://www.facebook.com/duckflight.duckflight');
                break;
            case 'google':
                window.open('https://plus.google.com/u/0/108177390557947103217/posts');
                break;
            case 'twitter':
                window.open('https://twitter.com/duckfligth');
                break;
            case 'github':
                window.open('https://github.com/duckflight');
                break;
        }
    }
});


