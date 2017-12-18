'use strict';

var util = require('mapbox.js/src/util'),
    MTileLayer = require('mapbox.js/src/tile_layer');
    //urlHelper = require('./url');

var TileLayer = MTileLayer.TileLayer.extend({

    getTileUrl: function(tilePoint) {
        var tiles = this.options.tiles,
            index = Math.floor(Math.abs(tilePoint.x + tilePoint.y) % tiles.length),
            url = tiles[index];

        var templated = L.Util.template(url, tilePoint);
        if (!templated) {
            // passing the `templated` variable to URL helper function, which takes
            // care of appending accessToken parameter
            
            // return urlHelper(templated);
            return templated;
        } else {
            return templated.replace('.png',
                (L.Browser.retina ? this.scalePrefix : '.') + this.options.format);
        }
    }
});

module.exports.TileLayer = TileLayer;

module.exports.tileLayer = function(_, options) {
    return new TileLayer(_, options);
};
