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

get_avatar_from_service = function(user, size) {
    // this return the url that redirects to the according user image/avatar/profile picture
    // implemented services: google profiles, facebook, gravatar, twitter, tumblr, default fallback
    // for google   use get_avatar_from_service('google', profile-name or user-id , size-in-px )
    // for facebook use get_avatar_from_service('facebook', vanity url or user-id , size-in-px or size-as-word )
    // for gravatar use get_avatar_from_service('gravatar', md5 hash email@adress, size-in-px )
    // for twitter  use get_avatar_from_service('twitter', username, size-in-px or size-as-word )
    // for tumblr   use get_avatar_from_service('tumblr', blog-url, size-in-px )
    // everything else will go to the fallback
    // google and gravatar scale the avatar to any site, others will guided to the next best version
    // helper methods

    function isNumber(n) {
        // see http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var url = '';

    switch (user.service) {

        case "google":
            // see http://googlesystem.blogspot.com/2011/03/unedited-google-profile-pictures.html (couldn't find a better link)
            // available sizes: all, google rescales for you
            url = "http://profiles.google.com/s2/photos/profile/" + user.id + "?sz=" + size;
            break;

        case "facebook":
            // see https://developers.facebook.com/docs/reference/api/
            // available sizes: square (50x50), small (50xH) , normal (100xH), large (200xH)
            var sizeparam = '';
            if (isNumber(size)) {
                if (size >= 200) sizeparam = 'large';
                if (size >= 100 && size < 200) sizeparam = 'normal';
                if (size >= 50 && size < 100) sizeparam = 'small';
                if (size < 50) sizeparam = 'square';
            } else {
                sizeparam = size;
            }
            url = "https://graph.facebook.com/" + user.id + "/picture?type=" + sizeparam;
            break;

        case "gravatar":
            // see http://en.gravatar.com/site/implement/images/
            // available sizes: all, gravatar rescales for you
            url = "http://www.gravatar.com/avatar/" + user.id + "?s=" + size;
            break;

        case "twitter":
            // see https://dev.twitter.com/docs/api/1/get/users/profile_image/%3Ascreen_name
            // available sizes: bigger (73x73), normal (48x48), mini (24x24), no param will give you full size
            var sizeparam = '';
            if (isNumber(size)) {
                if (size >= 73) sizeparam = 'bigger';
                if (size >= 48 && size < 73) sizeparam = 'normal';
                if (size < 48) sizeparam = 'mini';
            } else {
                sizeparam = size;
            }

            url = "http://api.twitter.com/1/users/profile_image?screen_name=" + user.id + "&size=" + sizeparam;
            break;

        case "tumblr":
            // see http://www.tumblr.com/docs/en/api/v2#blog-avatar
            //TODO do something smarter with the ranges
            // available sizes: 16, 24, 30, 40, 48, 64, 96, 128, 512
            var sizeparam = '';
            if (size >= 512) {
                sizeparam = 512
            }
            ;
            if (size >= 128 && size < 512) {
                sizeparam = 128
            }
            ;
            if (size >= 96 && size < 128) {
                sizeparam = 96
            }
            ;
            if (size >= 64 && size < 96) {
                sizeparam = 64
            }
            ;
            if (size >= 48 && size < 64) {
                sizeparam = 48
            }
            ;
            if (size >= 40 && size < 48) {
                sizeparam = 40
            }
            ;
            if (size >= 30 && size < 40) {
                sizeparam = 30
            }
            ;
            if (size >= 24 && size < 30) {
                sizeparam = 24
            }
            ;
            if (size < 24) {
                sizeparam = 16
            }
            ;

            url = "http://api.tumblr.com/v2/blog/" + user.id + "/avatar/" + sizeparam;
            break;
        case 'github':
            url = 'https://avatars.githubusercontent.com/u/' + user.id;
            break;
        default:
            // http://www.iconfinder.com/icondetails/23741/128/avatar_devil_evil_green_monster_vampire_icon
            // find your own
            url = '/usericon.png'; // 48x48
    }


    return url;
};


getAvatar = function(userObject,size){
    return '';
};