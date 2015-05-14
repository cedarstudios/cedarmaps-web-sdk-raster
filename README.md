# cedarmaps.js

This is CedarMaps Javascript API. It's simply a wrapper for [Mapbox Javascript API](https://github.com/mapbox/mapbox.js/), which is itself built as a [Leaflet](http://leafletjs.com/) plugin. You can [read about its launch](http://mapbox.com/blog/mapbox-js-with-leaflet/).

## Usage

Recommended usage is via the CedarMaps CDN:

```html
<script src='http://api.cedarmaps.com/cedarmaps.js/v1.0.1/cedarmaps.js'></script>
<link href='http://api.cedarmaps.com/cedarmaps.js/v1.0.1/cedarmaps.css' rel='stylesheet' />
```

The `cedarmaps.js` file includes the Leaflet library. Alternatively, you can use `cedarmaps.standalone.js`, which does not include Leaflet (you will have to provide it yourself).

cedarmaps APIs only work with a valid "Acces Token". You must set your access token to `L.cedarmaps.accessToken` variable like this:

```js
L.cedarmaps.accessToken = 'your_hash';
```
Check out demos at `demos/` folder for better grasping the idea.

**Note:** If you've purchased our dedicated plan you should set your baseURL in the following manner in `<head>` tag *before* including cedarmaps' files:

```html
<script>
	apiBaseUrlHttp = 'http://...';
	apiBaseUrlHttps = 'https://...';
</script>
```

You can also see the [API documentation](http://mapbox.com/mapbox.js/api/) and [Mapbox's Examples](http://mapbox.com/mapbox.js/example/v1.0.0/) for further help.

## API

Managed as Markdown in `API.md`, following the standards in `DOCUMENTING.md`
API is almost the same as mapbox's API. [Check it out](http://mapbox.com/mapbox.js/api/).

## Building

Requires [node.js](http://nodejs.org/) installed on your system.
Grunt makes use of [Browserify](http://browserify.org/) under the hood to build the project while resolving dependencies.

``` sh
git clone http://gitlab.cedar.ir/cedar.studios/cedarmaps-sdk-web-public.git
cd cedarmaps-sdk-web-public
git submodule update --init
npm install
grunt build
```

built files are put in `dist/` folder.
Note that every time you pull new changes from repository, you should run `grunt build`.