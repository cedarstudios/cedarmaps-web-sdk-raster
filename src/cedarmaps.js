'use strict';

var map = require('./map'),
	tileLayer = require('./tile_layer'),
    geocoderControl = require('./geocoder_control');    

L.cedarmaps = L.mapbox;

// Overrides
L.cedarmaps.VERSION = require('../package.json').version;
L.cedarmaps.geocoder = require('./geocoder');
L.cedarmaps.staticMap = require('./static_map');
L.cedarmaps.nearby = require('./nearby');
L.cedarmaps.distance = require('./distance');
L.cedarmaps.administrativeBoundaries = require('./administrative_boundaries');
L.cedarmaps.direction = require('./direction');
L.cedarmaps.map = map.map;
L.cedarmaps.Map = map.Map;
L.cedarmaps.tileLayer = tileLayer.tileLayer;
L.cedarmaps.TileLayer = tileLayer.TileLayer;
L.cedarmaps.geocoderControl = geocoderControl.geocoderControl;
L.cedarmaps.GeocoderControl = geocoderControl.GeocoderControl;

module.exports = L.cedarmaps;

// Hardcode image path, because Leaflet's autodetection
// fails, because mapbox.js is not named leaflet.js
window.L.Icon.Default.imagePath =
    // Detect bad-news protocols like file:// and hardcode
    // to https if they're detected.
    ((document.location.protocol === 'https:' ||
    document.location.protocol === 'http:') ? '' : 'https:') +
    '//api.cedarmaps.com/cedarmaps.js/' + 'v' +
    require('../package.json').version + '/images/';