'use strict';

var config = require('./config')
var corslite = require('corslite')

module.exports = function (container, center, options) {
    /* 
    {        
        defaultZoom: int,
        centerMarkerIcon: L.icon,
        categories: [string, string],
        poiLimit: int,
        seachDistance: int,
        popupContent: string,
        noPoiLink: boolean,
        lockScroll: boolean,        
    }
    */
    var stringHelpers = {
        toFarsi: function (string) {
            if (!string) {
                return;
            }
            var foreignChars = ['ي', 'ك', '‍', 'دِ', 'بِ', 'زِ', 'ذِ', 'ِشِ', 'ِسِ', '‌', 'ى', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                persianChars = ['ی', 'ک', '', 'د', 'ب', 'ز', 'ذ', 'ش', 'س', '', 'ی', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];

            for (var i = 0, charsLen = foreignChars.length; i < charsLen; i++) {
                string = string.replace(new RegExp(foreignChars[i], 'g'), persianChars[i]);
            }

            return string;
        },
        digitSeperator: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    var getPois = function (center) {
        for(var cfg in categoryFeatureGroups) {
            map.removeLayer(categoryFeatureGroups[cfg])
        }        
        if (options.categories) {
            for (var i = 0, l = options.categories.length; i < l; i++) {
                (function (cat_index) {
                    var category = options.categories[cat_index];
                    if (availableCategories[category]) {
                        var categoryFeatureGroup = new L.FeatureGroup();
                        corslite('https://www.kikojas.com/api/search?cat=' + availableCategories[category].name + '&latlng=' + center.lat + ',' + center.lng + '&limit=' + (options.poiLimit ? options.poiLimit : 3) + '&distance=' + (options.seachDistance ? options.seachDistance : 2), function (err, resp) {
                            if (err) {
                                throw err;
                            }
                            var kikojasResponse = JSON.parse(resp.response);
                            if (kikojasResponse.meta.code === 200) {
                                var pois = kikojasResponse.response.items;
                                pois.forEach(function (poi) {
                                    var popupContent = '<div class="tooltip-wrapper">\
                                                <div class="basic-info">\
                                                    <div class="icon"><img width="32" height="32" alt="' + availableCategories[category].name + '" src="https://www.kikojas.com' + poi.categories[0].icon + '"></div>\
                                                    <div class="details">';
                                    if (options.noPoiLink && options.noPoiLink == true) {
                                        popupContent += '<div class="title">' + poi.full_name + '</div>';
                                    } else {
                                        popupContent += '<div class="title"><a href="https://www.kikojas.com' + poi.url + '" target="_blank">' + poi.full_name + '</a></div>';
                                    }
                                    popupContent += '<div class="category">' + poi.categories[0].name + '</div>\
                                                        <div class="address">' + poi.address + '</div>\
                                                    </div>\
                                                </div>\
                                                <div class="routing" data-from="' + center.lat + ',' + center.lng + '" data-to="' + poi.latlng + '" onclick="routing(this)")">\
                                                    <span class="distance">در حال محاسبه فاصله <img src="https://tools.kikojas.com/images/loading-14-blue.gif"/></span>\
                                                    <div class="route">مسیریابی <img src="https://tools.kikojas.com/images/route-icon.png"/></div>\
                                                </div>\
                                                <div class="clear"></div>\
                                            </div>';
                                    var catMarker = L.marker({
                                        lon: poi.lng,
                                        lat: poi.lat
                                    }, {
                                            icon: L.divIcon({
                                                html: category == 'bus' ? '' : '<img style="width:27px; margin:2px;" src="https://www.kikojas.com/img/categories/red/64/' + availableCategories[category].slug + '.png"/>',
                                                iconSize: [34, 44],
                                                className: 'kikojas-map-marker',
                                                iconAnchor: [31, 41],
                                                shadowUrl: 'https://www.kikojas.com/img/marker-shadow.png',
                                                shadowSize: [61, 20],
                                                shadowAnchor: [59, 5],
                                                bgPos: {
                                                    x: category == 'bus' ? 33 * 36 : 30 * 36,
                                                    y: 0
                                                }
                                            })
                                        }).bindPopup(popupContent, {
                                            offset: new L.Point(-15, -33),
                                            closeButton: false,
                                            maxWidth: 420,
                                            autoPan: true
                                        });
                                    var marker_tools = new markerTools(catMarker)
                                    catMarker.on('mouseover', marker_tools.onMarkerMouseOver).on('mouseout', marker_tools.onMarkerMouseOut);
                                    categoryFeatureGroup.addLayer(catMarker);
                                    pois.push(catMarker);
                                }, this);
                            }
                        }, true);
                        categoryFeatureGroups[category] = categoryFeatureGroup;
                        map.addLayer(categoryFeatureGroup);
                    }
                })(i);
            }
        }
    }

    var markerTools = function (marker) {
        this.activeMarker = null;

        function _toggleMarkerStatus(status) {
            var markerIcon = marker._icon,
                currentBgPosition = markerIcon.style.backgroundPosition,
                bgPosition = currentBgPosition.split(' '),
                newBgPostion;
            switch (status) {
                case 'hover':
                    var currentZIndex = parseInt(markerIcon.style.zIndex);
                    markerIcon.style.zIndex = currentZIndex + 10000; // TODO: set through leaflet's zIndexOffset method
                    newBgPostion = bgPosition[0] + ' -53px';
                    break;
                case 'normal':
                    var currentZIndex = parseInt(markerIcon.style.zIndex);
                    markerIcon.style.zIndex = currentZIndex - 10000;
                    newBgPostion = bgPosition[0] + ' 0px';
                    break;
                case 'active':
                    newBgPostion = bgPosition[0] + ' -53px';
                    marker.isActive = true;
                    break;
                case 'inactive':
                    newBgPostion = bgPosition[0] + ' 0px';
                    marker.isActive = false;
                    break;
            }

            markerIcon.style.backgroundPosition = newBgPostion;
        };
        return {
            onMarkerMouseOver: function (evt) {
                if (!marker.isActive) {
                    if (self.activeMarker !== null) _toggleMarkerStatus('inactive');
                    _toggleMarkerStatus('hover');
                }
            },
            onMarkerMouseOut: function (evt) {
                if (!marker.isActive) {
                    _toggleMarkerStatus('normal');
                }
            }
        }
    }
    if (!options.lockScroll) {
        options.lockScroll = false;
    }
    var availableCategories = {
        park: {
            slug: 'park',
            id: 11,
            parentId: 1,
            name: 'پارک و بوستان',
            short_name: 'پارک'
        },
        bus: {
            slug: 'bus-stop',
            id: 3,
            parentId: 1,
            name: 'ایستگاه اتوبوس',
            short_name: 'اتوبوس'
        },
        shopping: {
            slug: 'shopping-center',
            id: 208,
            parentId: 160,
            name: 'پاساژ و مرکز خرید',
            short_name: 'خرید'
        },
        hospital: {
            slug: 'hospital',
            id: 59,
            parentId: 55,
            name: 'بیمارستان',
            short_name: 'درمانی'
        },
        school: {
            slug: 'school',
            id: 36,
            parentId: 28,
            name: 'مدرسه',
            short_name: 'مدرسه'
        }
    },
        // Tehran bounds with extra padding
        southWest = new L.LatLng(35.3930, 51.0219),
        northEast = new L.LatLng(35.8267, 51.6426),
        bounds = new L.LatLngBounds(southWest, northEast),
        categoryFeatureGroups = {},
        pois = [],
        geoJsonLayer;

    /**
     * Initilizing Map View
     */

    // Getting maps info from a tileJSON source
    var tileJSONUrl = 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=' + L.cedarmaps.accessToken;

    var containerElement = document.getElementById(container);
    containerElement.className += ' kikojas-nearby-widget';
    var map = L.cedarmaps.map(container, tileJSONUrl, {
        maxBounds: bounds,
        minZoom: 12,
        maxZoom: 17,
        zoomControl: options.lockScroll,
        scrollWheelZoom: !options.lockScroll
    }).setView(center, options.defaultZoom ? options.defaultZoom : 15);
    map.on('popupopen', function (e) {
        window.distance(e.popup._contentNode.getElementsByClassName('routing')[0]);
    });

    getPois({lat: center[0], lng: center[1]});

    var centerMarker = L.marker({
        lon: center[1],
        lat: center[0]
    }, {
            zIndexOffset: 1000,
            icon: options.centerMarkerIcon ? options.centerMarkerIcon : L.divIcon({
                iconSize: [34, 44],
                className: 'kikojas-map-marker',
                iconAnchor: [31, 41],
                shadowUrl: 'https://www.kikojas.com/img/marker-shadow.png',
                shadowSize: [61, 20],
                shadowAnchor: [59, 5],
                bgPos: {
                    x: 34 * 36,
                    y: 0
                }
            })
        }).addTo(map);
    var center_marker_tools = new markerTools(centerMarker);
    centerMarker.on('mouseover', center_marker_tools.onMarkerMouseOver)
        .on('mouseout', center_marker_tools.onMarkerMouseOut)
        .on('move', function (evt) {
            getPois(evt.latlng)
        })
    if (options.popupContent) {
        centerMarker.bindPopup('<div class="basic-info">' + options.popupContent + '</div>', {
            offset: new L.Point(-15, -33),
            closeButton: false,
            className: 'leaflet-popup-poi',
            maxWidth: document.getElementById(container).offsetWidth - 20
        }).on('popupopen', function (e) {
            e.popup.update();
        });
    }    
    L.Control.CategoryToggle = L.Control.extend({
        onAdd: function (map) {
            var divControlContainer = L.DomUtil.create('div');
            L.DomUtil.addClass(divControlContainer, 'category-panel slider js_slider');

            var mapWidth = document.getElementById(container).offsetWidth;
            var panelWidth = (mapWidth - 20);
            var frameWidth = (panelWidth - 50);
            var ul = L.DomUtil.create('ul');
            L.DomUtil.addClass(ul, 'tg-list');
            if (options.categories) {
                for (var i = 0, l = options.categories.length; i < l; i++) {
                    var category = options.categories[i];
                    if (availableCategories[category]) {
                        var cat = availableCategories[category];
                        var categoryListItem = L.DomUtil.create('li', 'tg-list-item');
                        var categoryInput = L.DomUtil.create('input', 'tgl tgl-flip');
                        categoryInput.setAttribute('type', 'checkbox');
                        categoryInput.setAttribute('id', cat.slug);
                        var categoryLabel = L.DomUtil.create('label', 'tgl-btn');
                        categoryLabel.setAttribute('data-tg-off', cat.short_name);
                        categoryLabel.setAttribute('data-tg-on', cat.short_name);
                        categoryLabel.setAttribute('data-toggle', 'on');
                        categoryLabel.setAttribute('data-cat', options.categories[i]);
                        categoryLabel.setAttribute('for', cat.slug);
                        categoryListItem.appendChild(categoryInput);
                        categoryListItem.appendChild(categoryLabel);

                        categoryListItem.onclick = function (event) {
                            if (event.target.getAttribute('data-cat')) {
                                if (event.target.getAttribute('data-toggle') == "on") {
                                    map.removeLayer(categoryFeatureGroups[event.target.getAttribute('data-cat')]);
                                    event.target.setAttribute('data-toggle', 'off');
                                } else {
                                    map.addLayer(categoryFeatureGroups[event.target.getAttribute('data-cat')]);
                                    event.target.setAttribute('data-toggle', 'on');
                                }
                                var bounds = [];
                                for(var cfg in categoryFeatureGroups) {
                                    if (categoryFeatureGroups[cfg].getBounds().isValid()) {
                                        bounds.push(categoryFeatureGroups[cfg].getBounds());
                                    }
                                }
                                if (bounds.length > 0) {
                                    map.fitBounds(bounds);
                                }
                            }
                        }
                        ul.appendChild(categoryListItem);
                    }
                }
            }
            divControlContainer.appendChild(ul);

            return divControlContainer;
        },

        onRemove: function (map) { }
    });
    L.control.categoryToggle = function (opts) {
        return new L.Control.CategoryToggle(opts);
    }
    var ctrl = L.control.categoryToggle({
        position: 'topright'
    })
    ctrl.addTo(map)
    window.routing = function (el) {
        if (el && el.getAttribute('data-from') && el.getAttribute('data-to')) {
            corslite('https://api.cedarmaps.com/v1/direction/cedarmaps.driving/' + el.getAttribute('data-from') + ';' + el.getAttribute('data-to') + '?access_token=' + L.cedarmaps.accessToken, function (err, result) {
                if (err) {
                    throw err;
                }
                var r = JSON.parse(result.response).result;
                if (r.routes && r.routes.length > 0) {
                    if (geoJsonLayer) {
                        map.removeLayer(geoJsonLayer);
                    }
                    geoJsonLayer = L.geoJson(r.routes[0].geometry);
                    geoJsonLayer.addTo(map);
                }
            });
        }
    }
    window.distance = function (el) {
        if (el && el.getAttribute('data-from') && el.getAttribute('data-to')) {
            var url = 'https://api.cedarmaps.com/v1/direction/cedarmaps.driving/' + el.getAttribute('data-from') + ';' + el.getAttribute('data-to') + '?access_token=' + L.cedarmaps.accessToken;
            var old_el = document.getElementById('to-replace');
            if (old_el) {
                old_el.removeAttribute('id');
            }
            el.getElementsByClassName('distance')[0].setAttribute('id', 'to-replace')
            corslite(url, function (err, result) {
                if (err) {
                    throw err;
                }
                var r = JSON.parse(result.response).result,
                    el = document.getElementById('to-replace');
                if (el) {
                    if (r.routes && r.routes.length > 0) {
                        var d = r.routes[0].distance,
                            unit = 'متر';
                        if (d > 1000) {
                            d = d / 1000;
                            unit = 'کیلومتر';
                        }
                        el.innerHTML = 'فاصله رانندگی تا مکان مورد نظر شما: ' + stringHelpers.toFarsi(stringHelpers.digitSeperator(Math.round(d))) + ' ' + unit;
                    }
                    el.removeAttribute('id');
                }
            });
        }
    }

    return {
        updateCategories: function(categories) {
            options.categories = categories
            getPois(centerMarker.getLatLng())
            map.removeControl(ctrl)
            ctrl = L.control.categoryToggle({
                position: 'topright'
            })
            ctrl.addTo(map)
        },
        updateSearchDistance: function(distance) {
            options.seachDistance = distance
            getPois(centerMarker.getLatLng())
        },
        map: map,
        centerMarker: centerMarker
    }
}