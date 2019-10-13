# Cedarmaps Web SDK (Raster Tiles)
![CedarMaps address locator tool](https://github.com/cedarstudios/cedarstudios.github.io/raw/master/cedarmaps-web-sdk-raster.gif)

CedarMaps Web SDK (JS) is a javascript library for building interactive maps. It's built on top of [Mapbox Javascript API](https://github.com/mapbox/mapbox.js/), (The current version is `v3.1.1`). It uses [Leaflet.js](https://leafletjs.com/) for map interactinons so you can use all of this library's methods for your purpose.

**Note:** This repo is for "raster tiles". If you prefer to use our "vector tiles" please visit: https://github.com/cedarstudios/cedarmaps-web-sdk-vector

# Table of contents
- [Basic usage via CDN](#basic-usage-via-cdn)
- [Checking out demo files](#checking-out-demo-files)
- [Building SDK locally](#building-sdk-locally)
- [Pulling new changes from repo](#pulling-new-changes-from-repo)
- [API](#api)
  * [Forward & Reverse Geocoding](#forward--reverse-geocoding)
    + [Initializing Forward/Reverse Geocoder](#initializing-forwardreverse-geocoder)
    + [Forward Geocoder](#forward-geocoder)
    + [Forward Geocoder Sample Code](#forward-geocoder-sample-code)
    + [Reverse Geocoding](#reverse-geocoding)
    + [Reverse Geocoding Sample Code](#reverse-geocoding-sample-code)
  * [Direction](#direction)
    + [Direction Sample Code](#direction-sample-code)
  * [Administrative Boundaries Lister](#administrative-boundaries-lister)
    + [Administrative Boundaries Lister Sample Code](#administrative-boundaries-lister-sample-code)
  * [Nearby POI Finder](#nearby-poi-finder)
  * [Static Image Generator](#static-image-generator)
- [Upgrading SDK](#upgrading-sdk)
- [Issues](#issues)

# Basic usage via CDN
1. Get an access token from [Cedar Maps website](https://www.cedarmaps.com/) (Menu link: "درخواست اکانت رایگان"). It may take a couple of hours until your request is processed and your credentials are emailed to you.
2. Include these CSS and JavaScript files in `<head>` section of your HTML file.
```html
<script src='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.js'></script>
<link href='https://api.cedarmaps.com/cedarmaps.js/v1.8.1/cedarmaps.css' rel='stylesheet' />
```
3. Put the following code in the <body> of your HTML file:
```html
<!-- Make a div with id "map" and set its dimensions -->
<div id="map" style="width: 400px; height: 300px;"></div>

<script type="text/javascript">
	// In order to use Cedar Maps you **MUST** have an access token
	L.cedarmaps.accessToken = "YOUR_ACCESS_TOKEN";

	// Setting up our layer
    var tileJSONUrl = 'https://api.cedarmaps.com/v1/tiles/cedarmaps.streets.json?access_token=' + L.cedarmaps.accessToken;

    // Initilizing map into div#map
    var map = L.cedarmaps.map('map', tileJSONUrl, {
        scrollWheelZoom: true
    }).setView([35.757448286487595, 51.40876293182373], 15);

</script>
```
# Checking out demo files
In order to check out demo files in `/demos` folder you need to build the SDK locally or change the script and css paths to our CDN ones mentioned above. 

# Building SDK locally
1. Clone this repo:
```
git clone https://github.com/cedarstudios/cedarmaps-web-sdk-raster
```
3. In the root folder of your cloned repo make a new file called `access-token.js` and put your access token in it:
```
var accessToken = 'YOUR_ACCESS_TOKEN';
```
4. Install the required backages: (You have to have [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) installed on your machine.)
```
 npm install
```

5. Build the SDK. It stores the files in `/dist/[sdk-version]` folder. (See `package.json`).

```
grunt build
```
6. Go to `/demos` folder and pick one for the start.

The `cedarmaps.js` file includes the Leaflet library. Alternatively, you can use `cedarmaps.standalone.js`, which does not include Leaflet (you will have to provide it yourself).

**Note:** If you've purchased our dedicated plan you should set your baseURL in the following manner in `<head>` tag *before* including cedarmaps' files:

```html
<script>
	apiBaseUrlHttp = 'http://your-own-api-url.com';
	apiBaseUrlHttps = 'https://your-own-api-url.com';
</script>
```

# Pulling new changes from repo
Every time you pull new changes from repository, you should run `grunt build` again.
```sh
git pull
grunt build
```

# API
Cedarmaps' API is almost the same as mapbox. [Check it out](http://mapbox.com/mapbox.js/api/). However, Cedarmaps introduces some new API methods that are described below:

## Forward & Reverse Geocoding
For both forward and reverse geocofing functionality you should use `L.cedarmaps.geocoder` object.

### Initializing Forward/Reverse Geocoder
Signature: `L.cedarmaps.geocoder(id [, options])`

Before using forward/reverse Geocoder object, you must initialize it using the desired profile (id).

| Options | Value | Description |
| ---- | ---- | ---- |
| id (_required_) | String | Available profiles: <ul><li> `cedarmaps.streets` Only searches through map features - 1 API Call</li><li> `cedarmaps.places` Only searches through places (Source: [kikojas.com](https://www.kikojas.com)) - 2 API Calls</li><li> `cedarmaps.mix` Searches through both profiles above - 3 API Calls</li></ul>|
| options (_optional_) | Object | If provided, it may include: <ul><li>`accessToken`: CedarMaps API access token. Overrides `L.cedarmaps.accessToken` for this geocoder.</li></ul> |

_Returns_ a `L.cedarmaps.geocoder` object.

Example:
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
```

### Forward Geocoder
Signature: `geocoder.query(queryString|options, callback)`

Queries the geocoder with a query string, and returns the results, if any.

| Options | Value | Description |
| ---- | ---- | ---- |
| queryString (_required_) | String | a query, expressed as a string, like 'Arkansas' |
| options | Object | An object containing the query and options parameters like `{ query: 'ونک', limit: 5 }`. Other available parameteres: <br /><br /> <ul><li>`limit` *integer* - Number of returned results. Default is `10`, Max is `30`.</li><li>`distance` *float* - Unit is km, `0.1` means 100 meters.</li><li>`location` *lat,lng* - For searching near a location. should be used only with `distance` param.</li><li>`type` *enum* - Types of map features to filter the results. Possible values: `street`, `poi`, `village`, `roundabout`, `expressway`, `locality`, `town`, `city`, `junction`, `freeway`, `boulevard`, `region`, `state` <br />(You can mix types by separating them with commas).</li><li>`ne` *lat,lng* - Specifies north east of the bounding box - should be used with `sw` param.</li><li>`sw` lat,lng - Specifies south west of the bounding box - should be used with `ne` param.</li></ul> |
| callback (_required_) | Function | A callback with passed params: `(error, result)`. |

_Returns_ a `L.cedarmaps.geocoder` object.

The results object's signature:

```javascript
{
    status: // OK
    results: // raw results
}
```

### Forward Geocoder Sample Code
_Example_: Check out a [Live example of geocoder.query](https://demo.cedarmaps.com/websdk/demos/geocoder-control.html). If you want more control over your searchbox rendering, please check out another example implementing a [custom seachbox](http://demo.cedarmaps.com/websdk/demos/custom-searchbox.html) with a third-party auto complete library.

Using a single query parameter:
```javascript
geocoder.query('ونک', function(err, res){ });
```
Using query string along with an option (Limiting the number of results):
```javascript
geocoder.query({query:'ونک', limit: 5}, function(err, res){ });
```
Filtering results based on one or more feature types:
```javascript
geocoder.query({query:'ونک', type: 'locality'}, function(err, res){ });
geocoder.query({query:'ونک', type: 'locality,roundabout'}, function(err, res){ });
geocoder.query({query:'ونک', type: 'street', limit:2}, function(err, res){ });
```
Searching within in a specific bounding box:
```javascript
geocoder.query({query:'لادن', ne: '35.76817388431271,51.41721725463867', sw: '35.75316460798604,51.39232635498047'}, function(err, res){ });
```
### Reverse Geocoding
Signature: `geocoder.reverseQuery(location, callback)`

Queries the reverse geocoder with a location and returns the address in desired format.

| Options | Value | Description |
| ---- | ---- | ---- |
| location (_required_) | Mixed |<ul><li>`String`: Only a single `lat,lng` pair separated by comma. Example: `'35.763,51.40'`</li><li>`Object`: If you want to provide options for reverse geocoding: Example: `{query: {lat:35.763 ,lng:51.40 }, verbosity: true, prefix: 'short', separator: '، '}` <br> Options are: <ul><li>`format: "{province}{sep}{city}{sep}{locality}{sep}{district}{sep}{address}{sep}{place}"`</li><li>`Prefix: "short"`</li><li>`Separator: "، "`</li><li>`Verbosity: false`</li></ul> </li><li>`Array`: For geocoding more than one point in a single request. Example: `[{lat: 35.763, lng: 51.40},{...}]`</li></ul> A point can be formatted in one of the forms below:<ul><li>`[lon, lat] // an array of lon, lat`</li><li>`{ lat: 0, lon: 0 } // a lon, lat object`</li><li>`{ lat: 0, lng: 0 } `</li></ul> |
| callback (_required_) | Function | A callback with passed params: `(error, result)`. |

_Returns_: the geocoder object. The return value may not come handy since it runs asynchronously and you must use a callback to get the results.

### Reverse Geocoding Sample Code
```javascript
var geocoder = L.cedarmaps.geocoder('cedarmaps.streets');
geocoder.reverseQuery({lat: 35.754592526442465, lng: 51.401896476745605}, function callback(err, res){});
```

_Example_: Check out a [Live example of reverseQuery](https://demo.cedarmaps.com/websdk/demos/reverse-geocoder.html).

## Direction
Calculates a route between a start and end point (and optionally some middle points) up to 100 points in GeoJSON format:

| Options | Value | Description |
| ---- | ---- | ---- |
| Profile (_required_) | String | Default and the only current available value: `cedarmaps.driving`. |
| LatLngs (_required_) | String | A pair of `lat` and `lng` points indicating start, middle and end, in format: `lat,lng;lat,lng;[lat,lng...]` (Up to 100 points) |
| callback (_required_) | Function | A callback with passed params: `(error, result)`. |

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


## Administrative Boundaries Lister
Lists administrative boundaries in 3 different levels: `province`, `city`, `locality` (aka. neighbourhood).

Signature: `administrativeBoundaries.query(type, query, callback)`

| Options | Value | Description |
| ---- | ---- | ---- |
| type (_required_) | String | Type of an administrative boundary. Possible values: `province`, `city`, `locality`. |
| query (_optional_) | String | The query to limit the `type` above. For example: list all cities of "Tehran" province: `query('city', 'تهران', function(error, result){})`. This option is not neccessary for type: `province` as it has no parents. |
| callback (_required_) | Function | A callback with passed params: `(error, result)`. |

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

## Nearby POI Finder
CedarMaps is integrated with its sister project [kikojas.com](https://www.kikojas.com) and has access to all of the curated POIs available in it. It gives you the ability to query public places near a certain point on map.
The available categories are: 
- Parks
- Bus Stations
- Shopping Malls
- Hospitals
- Schools

**Note:** You may purchase the availability of other categories for your project. Please [contact us](mailto:support@cedarmaps.com) for more information.

Signature: `L.cedarmaps.nearby(mapContainer, centerPoint, {options})`

| Options | Value | Description |
|-------------------------------|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| categories (_required_) | Array | List of categories you want to have in your map. Available options are `bus`, `park`, `shopping`, `hospital` and `school` |
| searchDistance (_optional_) | Float | Distance radius to search for POIs, in Kilometer. For 500 meters use `0.5`. |
| popupContent (_required_) | Function | A callback with passed params: `(error, result)`. |
| centerMarkerIcon (_optional_) | [Leaflet Marker](https://leafletjs.com/reference-1.5.0.html#marker) | You may use your custom [leaflet marker](https://leafletjs.com/reference-1.5.0.html#marker) for your central point. Example: `window.L.icon({"slug":"@default","iconUrl":"https://api.cedarmaps.com/v1/markers/marker-default.png","iconRetinaUrl":"https://api.cedarmaps.com/v1/markers/marker-default@2x.png","iconSize":[82,98]})` |
| popupContent (_optional_) | String | Popup content for centralMarker. Can contain HTML code. |
| defaultZoom (_optional_) | Integer | Your desired zoom level for map. |

_Example_: Check out a [Live example of nearby widget](http://demo.cedarmaps.com/websdk/demos/nearby.html).

## Static Image Generator
If you don't want to include a bunch of script tags into your HTML and just need an image showing a map with a marker representing a point on it, you may use this API. 

Signature: `L.cedarmaps.staticMap({options})`

| Options | Value | Description |
|------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| maptype (_required_) | String | The only available profile is `light` for now. |
| position (_required_) | String | The center point and zoom level with which map should be generated, in format: `lat,lng,zoom` (e.g.: `35.791124154289,51.415790319443,13`). If your generated image has markers on it and they should be fit in your map, use value `auto`. |
| dimension (_required_) | String | Dimension of the generated image in format: `widthxheight`. (e.g.: 800x600). Either values for width and height should not exceed 1280 pixels. |
| scale (_optional_) | String | For retina displays with more pixels density use this option. It doubles the size for both maps and markers. |
| markers (_optional_) | String | For adding optional markers on the map, in format: `marker-name\|lat,lng`. (e.g.: `marker-circle-orange\|35.79,51.41\|marker-default\|35.83,51.45`). Here, `marker-circle-orange` and `marker-default` are from CedarMaps preset marker names. You may use your own custom markers by providing their absolute url path starting with `http://`. <br> **Note:** If you request for a static map with your custom marker URL, the first request caches the marker image and the second request actually responds with your static map. <br>Available marker presents are: <ul><li>`marker-default`</li><li> `marker-circle-blue`</li><li> `marker-circle-green`</li><li> `marker-circle-orange`</li><li> `marker-circle-red`</li><li> `marker-square-blue`</li><li> `marker-square-green`</li><li> `marker-square-orange`</li><li> `marker-square-red`</li></ul> If your marker has an anchor point, the anchor must be positioned in the center of the image. For a sample checkout this [marker image](https://api.cedarmaps.com/v1/markers/marker-circle-green@2x.png) from our preset markers. |

_Example_: Check out a [Live example of static image generator](https://demo.cedarmaps.com/websdk/demos/static-image.html).

# Upgrading SDK
In case of any updates in module itself the following files must be updated:

* `version` in `./package.json`
* `version` in `<script>` and `<link>` tags in demo files (`./demo`)
* `version` in sample API usage in `README.md`
* "Doc files" by running `grunt doc` command
* building new dist files by running `grunt build` command

# Issues
If you have any questions while implementing Cedar Maps Web SDK, please feel free to open a [new issue](https://github.com/cedarstudios/cedarmaps-web-sdk-raster/issues).