# cedarmaps.js

This is CedarMaps Javascript API. It's simply a wrapper for [Mapbox Javascript API](https://github.com/mapbox/mapbox.js/), (Currently `v2.2.3`) which is itself built as a [Leaflet](http://leafletjs.com/) plugin. You can [read about its launch](http://mapbox.com/blog/mapbox-js-with-leaflet/).

# Table of Contents
- [Basic Usage](#usage)
- [API](#api)
	- [Forward/Reverse Geocoding](#forwardreverse-geocoding)
	- [Geocoding](#lcedarmapsgeocoderid-options)
	- [Geocoding Sample Codes](#geocoding-examples)
	- [Reverse Geocoding](#geocoderreversequerylocation-callback)
	- [Reverse Geocoding Sample Code](#reverse-geocoding-examples)
- [Building SDK](#building-sdk)
- [Updating SDK](#updating-sdk)
	- [Updating mapbox.js submodule](#updating-mapboxjs-submodule)
	- [Updating Cedarmaps.js](#updating-cedarmapsjs)

## Usage

Recommended usage is via the CedarMaps CDN:

```html
<script src='http://api.cedarmaps.com/cedarmaps.js/v1.5.0/cedarmaps.js'></script>
<link href='http://api.cedarmaps.com/cedarmaps.js/v1.5.0/cedarmaps.css' rel='stylesheet' />
```

The `cedarmaps.js` file includes the Leaflet library. Alternatively, you can use `cedarmaps.standalone.js`, which does not include Leaflet (you will have to provide it yourself).

cedarmaps APIs only work with a valid "Acces Token". You must set your access token to `L.cedarmaps.accessToken` variable like this:

```javascript
L.cedarmaps.accessToken = 'your_hash';
```
Check out demos at `demos/` folder for better grasping the idea.

**Note:** If you've purchased our dedicated plan you should set your baseURL in the following manner in `<head>` tag *before* including cedarmaps' files:

```html
<script>
	apiBaseUrlHttp = 'http://your-own-api-url.com';
	apiBaseUrlHttps = 'https://your-own-api-url.com';
</script>
```

You can also see the [API documentation](http://mapbox.com/mapbox.js/api/) and [Mapbox's Examples](http://mapbox.com/mapbox.js/example/v1.0.0/) for further help.

## API

API is almost the same as mapbox's API. [Check it out](http://mapbox.com/mapbox.js/api/). 
However two mostly used methods: forward and reverse geocoding APIs are described below for easy access:

## Forward/Reverse Geocoding

### L.cedarmaps.geocoder(id, options)

A low-level interface to geocoding, useful for more complex uses and reverse-geocoding.

| Options | Value | Description |
| ---- | ---- | ---- |
| id | string | currently `cedarmaps.streets` |
| options | Object | The second argument is optional. If provided, it may include: <ul><li>`accessToken`: Mapbox API access token. Overrides `L.cedarmaps.accessToken` for this geocoder.</li></ul> |

_Returns_ a `L.cedarmaps.geocoder` object.

example:
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
```

### geocoder.query(queryString|options, callback)

Queries the geocoder with a query string, and returns its result, if any.

| Options | Value | Description |
| ---- | ---- | ---- |
| queryString (_required_) | string | a query, expressed as a string, like 'Arkansas' |
| options | object | an object containing the query and options parameters like `{ query: 'ونک', limit: 5 }`. <br /><br />Other available parameteres: <br /><br /> <ul><li>`limit` *integer* - Max is 30</li><li>`distance` *float* - Unit is km, 0.1 means 100 meters</li><li>`location` *lat,lon* - For searching near a location. should be accompanied with distance param</li><li>`type` *enum* - Possible values: `locality`, `roundabout`, `street`, `freeway`, `expressway`, `boulevard` <br />(You can mix types by separating them with comma)</li><li>`ne` *lat,lon* - Specifies north east of the bounding box - should be accompanied with `sw` param</li><li>`sw` lat,lon - Specifies south west of the bounding box - should be accompanied with `ne` param</li></ul> |
| callback (_required_) | function | a callback |

The callback is called with arguments

1. An error, if any
2. The result. This is an object with the following members:
```javascript
{
    status: // OK
    results: // raw results
}
```

_Example_: [Live example of geocoder.query centering a map.](http://www.cedarmaps.com/websdk/demos/geocoder-control.html)

_Returns_: the geocoder object. The return value of this function is not useful - you must use a callback to get results.

#### Geocoding Examples:
using a single query parameter:
```javascript
geocoder.query('ونک', function(){});
```
using query string along with an option (Limiting the results):
```javascript
geocoder.query({query:'ونک', limit: 5}, function(){});
```
limiting results based on one or more feature types:
```javascript
geocoder.query({query:'ونک', type: 'locality'}, function(){});
geocoder.query({query:'ونک', type: 'locality,roundabout'}, function(){});
geocoder.query({query:'ونک', type: 'street', limit:2}, function(){});
```
searching within in a specific bounding box:
```javascript
geocoder.query({query:'لادن', ne: '35.76817388431271,51.41721725463867', sw: '35.75316460798604,51.39232635498047'}, function(){});
```

### geocoder.reverseQuery(location, callback)

Queries the geocoder with a location, and returns its result, if any.

| Options | Value | Description |
| ---- | ---- | ---- |
| location (_required_) | object | A query, expressed as an object:<ul><li>`[lon, lat] // an array of lon, lat`</li><li>`{ lat: 0, lon: 0 } // a lon, lat object`</li><li>`{ lat: 0, lng: 0 } // a lng, lat object`</li></ul> The first argument can also be an array of objects in that form to geocode more than one item. |
| callback (_required_) | function | The callback is called with arguments <ul><li>An error, if any</li><li>The result. This is an object of the raw result from Mapbox.</li></ul>

_Returns_: the geocoder object. The return value of this function is not useful - you must use a callback to get results.

#### Reverse Geocoding Examples
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
geocoder.reverseQuery({lat: 35.754592526442465, lng: 51.401896476745605}, function(){});
```


# Building SDK

Requires [node.js](http://nodejs.org/) installed on your system.
Grunt makes use of [Browserify](http://browserify.org/) under the hood to build the project while resolving dependencies.

```sh
git clone http://gitlab.cedar.ir/cedar.studios/cedarmaps-sdk-web-public.git
cd cedarmaps-sdk-web-public
npm install
grunt build
```

Built files are copied into `dist/` folder according to current SDK `version`. (See `package.json`)
Note that every time you pull new changes from repository, you should run `grunt build`.

# Updating SDK

## Updating Cedarmaps.js
In case of any updates in module itself the following files must be updated:

*   `version` in `./package.json`
*   `version` in `<script>` and `<link>` tags in demo files (`./demo`)
*   `version` in sample API usage in `README.md`
*   "Doc files" by running `grunt doc` command
*   building new dist files by running `grunt build` command