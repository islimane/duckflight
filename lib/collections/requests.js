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

Requests = new Mongo.Collection('requests');

Meteor.methods({
    insertRequest: function(request){
        return Requests.insert(request);
    },
    acceptRequest: function(request){
        Requests.update(request._id,{$set: {status: 'accepted'}});
        var relation = {users: [request.requested.id, request.applicant.id], createAt: new Date()};
        return Meteor.call('insertRelation',relation);
    },
    refuseRequest: function(request){
        request.requested.deleted = true;
        request.status = 'refused';
        return Requests.update(request._id,request);
    },
    checkRequest: function(request,user_id){
        var userChecked = (request.requested.id === user_id)? request.requested : request.applicant;
        userChecked.deleted = true;

        if (request.requested.deleted && request.applicant.deleted){
            Requests.remove(request._id);
        }else{
            Requests.update(request._id, request);
        }
    },
    resendRequest: function(request){
        request.requested.deleted = false;
        request.status = 'pending';
        return Requests.update(request._id,request);
    }
});