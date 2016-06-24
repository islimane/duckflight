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
//expresion regular para identificar hipervinculos.
//var siesweb=/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/i.exec(cadena);
ellipsis = function(s,max){
    return (s.length > max) ? s.slice(0,max) + "..." : s;
};

smartDate = function(date){
    return moment(date).fromNow();
};

smartNumber = function(num){
    var MIL = 1000;
    var MILLION = Math.pow(1000,2);
    var MIL_MILLION = Math.pow(1000,3);
    var BILLION = Matth.pow(1000,4);

    var unities = ['K','M','KM','B'];
    var unity = '';
    var snum = num;

    if (num >= BILLION) {
        unity = unities[3];
    }else if(num >= MIL_MILLION){
        unity = unities[2];
    }else if(num >= MILLION){
        unity = unities[1];
    }else if(num >= MIL){
        unity = unities[0];
    }
    return sNum + unity;
};
