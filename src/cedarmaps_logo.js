'use strict';

var CedarmapsLogoControl = L.Control.extend({

    options: {
        position: 'bottomright',
    },

    initialize: function(options) {
        L.setOptions(this, options);
    },

    onAdd: function(map) {
        this._container = L.DomUtil.create('a', 'cedarmaps-logo');
        this._container.href = "https://www.cedarmaps.com";
        this._container.target = "_blank";

        return this._container;
    },

    _setTileJSON: function(json) {
        // If user is using our tileJSON file, cedarmaps' attribution
        // should be displayed
        L.DomUtil.addClass(this._container, 'cedarmaps-logo-true');
    }
});

module.exports.CedarmapsLogoControl = CedarmapsLogoControl;

module.exports.cedarmapsLogoControl = function(options) {
    return new CedarmapsLogoControl(options);
};
