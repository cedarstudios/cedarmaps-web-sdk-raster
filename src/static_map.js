'use strict';

var config = require('./config');

module.exports = function (container, options) {
// {
//     alttext: string,
//     maptype: string,
//     position: {
//         lat: 35.79,
//         lng: 51.41,
//         zoom: 13
//     },
//     dimensions: {
//         width: 800,
//         height: 600
//     }
//     scale: bool,
//     qs: [
//         {
//             marker_url: '',
//             lat: 35.79,
//             lng: 51.41,
//         }
//     ]
// }    
    if (!options.maptype) {
        options.maptype = 'light';
    }
    if (!options.alttext) {
        options.alttext = 'Cedarmaps static image.';
    }
    if (!options.position) {
        options.position = 'auto';
    } else {
        if(typeof options.position !== 'object') {
            throw 'Unknown value for position.'
        }
    }
    if (!options.dimensions) {
        throw 'Cedarmaps: No dimensions specified.';
    } else {
        if(typeof options.dimensions !== 'object') {
            throw 'Unknown value for position.'
        }
    }
    if (!container) {
        throw 'Cedarmaps: No container selector specified.';
    } else if (!document.querySelector(container)) {
        throw 'Cedarmaps: Could not find element ' + options.container;
    }
    var position = options.position.lat ? (options.position.lat + ',' + options.position.lng + ',' + options.position.zoom) : options.position;
    var baseUrl = (document.location.protocol === 'https:' || config.FORCE_HTTPS) ? config.HTTPS_URL : config.HTTP_URL;
    var url = baseUrl + '/static/' + options.maptype +
        '/' + position + '/' + options.dimensions.width + 'x' + options.dimensions.height +
        (options.scale ? '@2x' : '') + '?access_token=' + L.cedarmaps.accessToken;
    if (options.qs && options.qs.length > 0) {
        var qs = 'markers=';
        for (var i = 0, l = options.qs.length; i < l; i++) {
            if (!options.qs[i].marker_url) {
                options.qs[i].marker_url = 'marker-default';
            }
            qs += options.qs[i].marker_url + '|' + options.qs[i].lat + ',' + options.qs[i].lng + '|';
        }
        url += '&' + qs;
    }

    var img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('alt', options.alttext);

    var element = document.querySelector(options.container);
    element.appendChild(img);
}