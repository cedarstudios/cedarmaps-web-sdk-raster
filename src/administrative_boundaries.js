'use strict';

var isArray = require('isarray'),
    util = require('mapbox.js/src/util'),
    format_url = require('./format_url'),
    //feedback = require('./feedback'),
    request = require('./request');

module.exports = function(options) {
    if (!options) options = {};
    var administrativeBoundaries = {};

    administrativeBoundaries.getURL = function(type) {
        if (type == 'province') {
            return format_url('/' + type, options.accessToken);
        } else {
            return format_url('/' + type + '/{query}.json', options.accessToken);
        }
    };

    administrativeBoundaries.queryURL = function(type, query) {
        var url = L.Util.template(administrativeBoundaries.getURL(type), {query: query});
    
        return url;
    };

    administrativeBoundaries.query = function(type, query, callback) {
        util.strict(callback, 'function');

        request(administrativeBoundaries.queryURL(type, query), function(err, json) {
            if (json && (json.length || json.results)) {
                callback(null, json);
            } else callback(err || true);
        });

        return administrativeBoundaries;
    };

    return administrativeBoundaries;
};
