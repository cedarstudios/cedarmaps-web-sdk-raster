'use strict';

var MMap = require('mapbox.js/src/map'),
    tileLayer = require('./tile_layer').tileLayer,
    cedarmapsLogoControl = require('./cedarmaps_logo').cedarmapsLogoControl;

function withAccessToken(options, accessToken) {
    if (!accessToken || options.accessToken)
        return options;
    return L.extend({
        accessToken: accessToken
    }, options);
}

var CMap = MMap.Map.extend({
    initialize: function (element, _, options) {

        MMap.Map.prototype.initialize.call(this, element, _,
            L.extend({}, MMap.Map.prototype.options, options));


        if (this.options.tileLayer && Object.keys(this.options.tileLayer).length !== 0) {
            this.tileLayer = tileLayer(undefined,
                withAccessToken(this.options.tileLayer, this.options.accessToken));
            this.addLayer(this.tileLayer);
        }

        this._cedarmapsLogoControl = cedarmapsLogoControl(this.options.cedarmapsLogoControl);
        this.addControl(this._cedarmapsLogoControl);
    },

    _initialize: function (json) {
        MMap.Map.prototype._initialize.call(this, json);

        this._cedarmapsLogoControl._setTileJSON(json);
    }
});

module.exports.Map = CMap;

module.exports.map = function (element, _, options) {
    options = options || {}    
    
    options.legendControl = false
    options.attributionControl = false    
    
    return new CMap(element, _, options);
};