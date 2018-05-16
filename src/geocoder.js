'use strict';

var isArray = require('isarray'),
    util = require('mapbox.js/src/util'),
    format_url = require('./format_url'),
    //feedback = require('./feedback'),
    request = require('./request');

// Low-level geocoding interface - wraps specific API calls and their
// return values.
module.exports = function(url, options) {
    if (!options) options = {};
    var geocoder = {};

    util.strict(url, 'string');

    if (url.indexOf('/') === -1) {
        url = format_url('/geocode/' + url + '/{query}.json', options.accessToken, 5);
    }

    function roundTo(latLng, precision) {
        var mult = Math.pow(10, precision);
        latLng.lat = Math.round(latLng.lat * mult) / mult;
        latLng.lng = Math.round(latLng.lng * mult) / mult;
        return latLng;
    }

    geocoder.getURL = function() {
        return url;
    };

    geocoder.queryURL = function(_) {
        var isObject = !(isArray(_) || typeof _ === 'string'),
            query = isObject ? _.query : _;

        if (isArray(query)) {
            var parts = [];
            for (var i = 0; i < query.length; i++) {
                parts[i] = encodeURIComponent(query[i]);
            }
            query = parts.join(';');
        } else {
            query = encodeURIComponent(query);
        }

        //feedback.record({ geocoding: query });

        var url = L.Util.template(geocoder.getURL(), {query: query});

        
        /*
         * Handling cedarmaps' API options for geocoding
         */
        if (isObject && _.limit) {
            url += '&limit=' + _.limit;
        }

        if (isObject && _.distance) {
            url += '&distance=' + _.distance;
        }

        if (isObject && _.ne && _.sw) {
            url += '&ne=' + _.ne + '&sw=' + _.sw;
        }

        if (isObject && _.type) {
            if (isArray(_.type)) {
                url += '&type=' + _.type.join(',');
            } else {
                url += '&type=' + _.type;
            }
        }

        return url;
    };

    geocoder.query = function(_, callback) {
        util.strict(callback, 'function');

        request(geocoder.queryURL(_), function(err, json) {
            if (json && (json.length || json.results)) {
                callback(null, json);
            } else callback(err || true);
        });

        return geocoder;
    };

    // a reverse geocode:
    //
    //  geocoder.reverseQuery([80, 20])
    geocoder.reverseQuery = function(_, callback) {
        var q = '';

        // sort through different ways people represent lat and lon pairs
        // in cedarmaps API we accept: {lon},{lat}.json
        function normalize(x) {
            if (x.lat !== undefined && x.lng !== undefined) {
                return x.lat + ',' + x.lng;
            } else if (x.lat !== undefined && x.lon !== undefined) {
                return x.lon + ',' + x.lat;
            } else {
                return x[0] + ',' + x[1];
            }
        }

        if (_.length && _[0].length) {
            for (var i = 0, pts = []; i < _.length; i++) {
                pts.push(normalize(_[i]));
            }
            q = pts.join(';');
        } else {
            q = normalize(_);
        }

        request(geocoder.queryURL(q), function(err, json) {
            callback(err, json);
        });

        return geocoder;
    };

    return geocoder;
};
