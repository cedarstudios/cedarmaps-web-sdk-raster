# Cedarmaps Web SDK

CedarMaps JS is a javascript library for building interactive maps. It's simply a wrapper for [Mapbox Javascript API](https://github.com/mapbox/mapbox.js/), (The current version is `v3.1.1`) which is itself built as a [Leaflet](http://leafletjs.com/) plugin. You can [read about its launch](http://mapbox.com/blog/mapbox-js-with-leaflet/).

# Table of Contents
- [Basic Usage](#basic-usage)
- [API](#api)
	- [Forward Geocoding](#forward-geocoding)
	- [Forward Geocoding Sample Codes](#forward-geocoding-sample-code)
	- [Reverse Geocoding](#reverse-geocoding)
	- [Reverse Geocoding Sample Code](#reverse-geocoding-sample-code)
	- [Direction](#direction)
	- [Direction Sample Code](#direction-sample-code)
	- [Administrative Boundaries Lister](#administrative-boundaries-lister)
	- [Administrative Boundaries Lister Sample Code](#administrative-boundaries-lister-sample-code)
- [Updating SDK](#updating-sdk)

# Basic Usage

Recommended usage is via the CedarMaps CDN. Just include CSS and JavaScript files in `<head>` section of your HTML file.

```html
<script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.0/cedarmaps.js'></script>
<link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.0/cedarmaps.css' rel='stylesheet' />
```

and put the following code in the `<body>` of your HTML file:

```html
<div id='map' style='width: 400px; height: 300px;'></div>

<script type="text/javascript">
	L.cedarmaps.accessToken = "YOUR_ACCESS_TOKEN"; // See the note below on how to get an access token

	// Getting maps info from a tileJSON source
    var tileJSONUrl = 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=' + L.cedarmaps.accessToken;

    // initilizing map into div#map
    var map = L.cedarmaps.map('map', tileJSONUrl, {
        scrollWheelZoom: true
    }).setView([35.757448286487595, 51.40876293182373], 15);

</script>
```
**Note:** You can get an access token by filling out the demo account form in [Cedarmaps Website](https://www.cedarmaps.com/#demo).

If you prefer to have your local version of the libaray you can simply build it with the following commands:

**Note:** [node.js](http://nodejs.org/) must be installed on your machine.

```sh
git clone http://gitlab.cedar.ir/cedar.studios/cedarmaps-sdk-web-public.git
cd cedarmaps-sdk-web-public
npm install
grunt build
```

After the built process, the files are copied into `dist/` folder according to current SDK `version`. (See `package.json`).

**Note:** Every time you pull new changes from repository, you should run `grunt build` again.
```sh
git pull
grunt build
```

The `cedarmaps.js` file includes the Leaflet library. Alternatively, you can use `cedarmaps.standalone.js`, which does not include Leaflet (you will have to provide it yourself).


**Note:** If you've purchased our dedicated plan you should set your baseURL in the following manner in `<head>` tag *before* including cedarmaps' files:

```html
<script>
	apiBaseUrlHttp = 'http://your-own-api-url.com';
	apiBaseUrlHttps = 'https://your-own-api-url.com';
</script>
```

You can also see the [API documentation](http://mapbox.com/mapbox.js/api/) and [Mapbox's Examples](http://mapbox.com/mapbox.js/example/v1.0.0/) for further help.

# API

Cedarmaps' API is almost the same as mapbox's API. [Check it out](http://mapbox.com/mapbox.js/api/). However, Cedarmaps introduces some new API methods that are described below:

## Forward Geocoding
For both forward and reverse geocofing functionality you should use `L.cedarmaps.geocoder` object.

### `L.cedarmaps.geocoder(id [, options])`

A low-level interface to geocoding, useful for more complex uses and reverse-geocoding.

| Options | Value | Description |
| ---- | ---- | ---- |
| id (_required_) | String | Currently only `cedarmaps.streets` |
| options (_optional_) | Object | If provided, it may include: <ul><li>`accessToken`: Mapbox API access token. Overrides `L.cedarmaps.accessToken` for this geocoder.</li></ul> |

_Returns_ a `L.cedarmaps.geocoder` object.

Example:
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
```

### `geocoder.query(queryString|options, callback)`

Queries the geocoder with a query string, and returns the results, if any.

| Options | Value | Description |
| ---- | ---- | ---- |
| queryString (_required_) | string | a query, expressed as a string, like 'Arkansas' |
| options | object | An object containing the query and options parameters like `{ query: 'ونک', limit: 5 }`. Other available parameteres: <br /><br /> <ul><li>`limit` *integer* - Number of returned results. Default is `10`, Max is `30`</li><li>`distance` *float* - Unit is km, `0.1` means 100 meters</li><li>`location` *lat,lon* - For searching near a location. should be used only with distance param</li><li>`type` *enum* - Types of map features to filter the results. Possible values: `locality`, `roundabout`, `street`, `freeway`, `expressway`, `boulevard` <br />(You can mix types by separating them with commas)</li><li>`ne` *lat,lon* - Specifies north east of the bounding box - should be used with `sw` param</li><li>`sw` lat,lon - Specifies south west of the bounding box - should be used with `ne` param</li></ul> |
| callback (_required_) | function | A callback with passed params: `(error, result)`. |

_Returns_ a `L.cedarmaps.geocoder` object.

The results object's signature:

```javascript
{
    status: // OK
    results: // raw results
}
```

### Forward Geocoding Sample Code
_Example_: Check out a [Live example of geocoder.query](https://demo.cedarmaps.com/websdk/demos/geocoder-control.html).

Using a single query parameter:
```javascript
geocoder.query('ونک', function(err, res){});
```
Using query string along with an option (Limiting the number of results):
```javascript
geocoder.query({query:'ونک', limit: 5}, function(err, res){});
```
Filtering results based on one or more feature types:
```javascript
geocoder.query({query:'ونک', type: 'locality'}, function(err, res){});
geocoder.query({query:'ونک', type: 'locality,roundabout'}, function(err, res){});
geocoder.query({query:'ونک', type: 'street', limit:2}, function(err, res){});
```
Searching within in a specific bounding box:
```javascript
geocoder.query({query:'لادن', ne: '35.76817388431271,51.41721725463867', sw: '35.75316460798604,51.39232635498047'}, function(err, res){});
```
### Reverse Geocoding

### `geocoder.reverseQuery(location, callback)`

Queries the reverse geocoder with a location `object`/`array`, and returns the address.

| Options | Value | Description |
| ---- | ---- | ---- |
| location (_required_) | object | A query, expressed as an object:<ul><li>`[lon, lat] // an array of lon, lat`</li><li>`{ lat: 0, lon: 0 } // a lon, lat object`</li><li>`{ lat: 0, lng: 0 } `</li></ul> **Note:** This parameter can also be an array of objects in that form to geocode more than one item in a single request. |
| callback (_required_) | function | A callback with passed params: `(error, result)`. |

_Returns_: the geocoder object. The return value of this function is not useful - you must use a callback to get results.

### Reverse Geocoding Sample Code
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
geocoder.reverseQuery({lat: 35.754592526442465, lng: 51.401896476745605}, function callback(err, res){});
```

_Example_: Check out a [Live example of reverseQuery](https://demo.cedarmaps.com/websdk/demos/reverse-geocoder.html).

### Direction
Calculates a route between a start and end point (and optionally some middle points) up to 100 points in GeoJSON format:

| Options | Value | Description |
| ---- | ---- | ---- |
| Profile (_required_) | String | Default and the only current available value: `cedarmaps.driving`. |
| LatLngs (_required_) | String | A pair of `lat` and `lng` points indicating start, middle and end, in format: `lat,lng;lat,lng;[lat,lng...]` (Up to 100 points) |
| callback (_required_) | function | A callback with passed params: `(error, result)`. |

_Returns_: the `direction` object. The return value of this function is not useful - you must use a callback to get the results.

### Direction Sample Code
```javascript
direction.route('cedarmaps.driving', '35.764335,51.365622;35.7604311,51.3939486;35.7474946,51.2429727', function(err, json) {
		var RouteGeometry = json.result.routes[0].geometry;

		var RouteLayer = L.geoJSON(RouteGeometry, {
			// for more styling options check out:
			// https://leafletjs.com/reference-1.3.0.html#path-option
			style: function(feature) {
				return {
					color: '#f00',
					weight: 5
				}
			}
		}).addTo(map);

		map.fitBounds(RouteLayer.getBounds());
	});
});
```
_Example_: Check out a [Live example of Direction](https://demo.cedarmaps.com/websdk/demos/direction.html).


### Administrative Boundaries Lister
### `administrativeBoundaries.query(type, query, callback)`
Lists administrative boundaries in 3 different levels: `province`, `city`, `locality` (aka. neighborhood).

| Options | Value | Description |
| ---- | ---- | ---- |
| type (_required_) | string | Type of an administrative boundary. Possible values: `province`, `city`, `locality`. |
| query (_optional_) | string | The query to limit the `type` above. For example: list all cities of "Tehran" province: `query('city', 'تهران', function(){})`. This option is not neccessary for type: `province` as it has no parents. |
| callback (_required_) | function | A callback with passed params: `(error, result)`. |

_Returns_: the `L.cedarmaps.administrativeBoundaries` object.

### Administrative Boundaries Lister Sample Code
```javascript
var administrativeLister = L.cedarmaps.administrativeBoundaries();
	// Get list of all provinces of Iran.
    administrativeLister.query('province', '', function(err, res){});
	// Get list of cities of Tehran Province.
    administrativeLister.query('city', 'تهران', function(err, res){});
```

_Example_: Check out a [Live example of address locator](https://demo.cedarmaps.com/websdk/demos/address-locator.html).

# Updating SDK
In case of any updates in module itself the following files must be updated:

* `version` in `./package.json`
* `version` in `<script>` and `<link>` tags in demo files (`./demo`)
* `version` in sample API usage in `README.md`
* "Doc files" by running `grunt doc` command
* building new dist files by running `grunt build` command