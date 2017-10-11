'use strict';

var config = require('./config'),
    isArray = require('isarray'),
    request = require('./request');

module.exports = function (options, callback) {
    if(!options.profile) {
        options.profile = 'cedarmaps.driving';
    }
    if(options.points && isArray(options.points)) {
        var param = '';
        for(var i = 0, l = options.points.length; i < l; i++) {
            param += options.points[i].from.lat + ',' + options.points[i].from.lng + ';';
            param += options.points[i].to.lat + ',' + options.points[i].to.lng;
            param += '/';
        }
        var baseUrl = (document.location.protocol === 'https:' || config.FORCE_HTTPS) ? config.HTTPS_URL : config.HTTP_URL;
        var url = baseUrl + '/distance/' + options.profile + '/' + param + '?access_token=' + L.cedarmaps.accessToken;
        request(url, function(err, json) {
            callback(err, json);
        })
    } else {
        throw 'Cedarmaps: Bad input.';
    }
}