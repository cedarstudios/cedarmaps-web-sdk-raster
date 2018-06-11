'use strict';

var isArray = require('isarray'),
    util = require('mapbox.js/src/util'),
    format_url = require('./format_url'),
    request = require('./request');

module.exports = function(options) {
    if (!options) options = {};
    var direction = {};

    direction.getURL = function(profile) {
        var profile = profile || 'cedarmaps.driving';

        return format_url('/direction/'+profile+'/{points}', options.accessToken);
    };

    direction.queryURL = function(profile, points) {
        var url = L.Util.template(direction.getURL(profile), {points: points});
    
        return url;
    };

    direction.route = function(profile, points, callback) {
        util.strict(callback, 'function');

        request(direction.queryURL(profile, points), function(err, json) {
            if (json && (json.length || json.result)) {
                callback(null, json);
            } else callback(err || true);
        });

        return direction;
    };

    return direction;
};
