import React from 'react';
import { string, shape, number, object } from 'prop-types';
import polyline from '@mapbox/polyline';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { circlePolyline } from '../../util/maps';
import config from '../../config';

const formatColor = color => {
  return color.replace(/^#/, '');
};

const fuzzyCircleOverlay = (center, mapsConfig) => {
  const strokeWeight = 1;
  const strokeColor = mapsConfig.fuzzy.circleColor;
  const strokeOpacity = 0.5;
  const fillColor = mapsConfig.fuzzy.circleColor;
  const fillOpacity = 0.2;

  const path = circlePolyline(center, mapsConfig.fuzzy.offset);
  const styles = `-${strokeWeight}+${formatColor(strokeColor)}-${strokeOpacity}+${formatColor(
    fillColor
  )}-${fillOpacity}`;
  return `path${styles}(${encodeURIComponent(polyline.encode(path))})`;
};

const customMarkerOverlay = (center, mapsConfig) => {
  const { url } = mapsConfig.customMarker;
  return `url-${encodeURIComponent(url)}(${center.lng},${center.lat})`;
};

const markerOverlay = center => {
  return `pin-s(${center.lng},${center.lat})`;
};

const mapOverlay = (center, mapsConfig) => {
  if (mapsConfig.fuzzy.enabled) {
    return fuzzyCircleOverlay(center, mapsConfig);
  }
  if (mapsConfig.customMarker.enabled) {
    return customMarkerOverlay(center, mapsConfig);
  }
  return markerOverlay(center);
};

const StaticMapboxMap = props => {
  const { address, center, zoom, mapsConfig, dimensions } = props;
  const { width, height } = dimensions;

  const libLoaded = typeof window !== 'undefined' && window.mapboxgl;
  if (!libLoaded) {
    return null;
  }

  const overlay = mapOverlay(center, mapsConfig);
  const src =
    'https://api.mapbox.com/styles/v1/mapbox/light-v10/static' +
    (overlay ? `/${overlay}` : '') +
    `/${center.lng},${center.lat},${zoom}` +
    `/${width}x${height}` +
    `?access_token=${config.maps.mapboxAccessToken}`;

  return <img src={src} alt={address} />;
};
map.on('load', function () {
// Insert the layer beneath any symbol layer.
var layers = map.getStyle().layers;
var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}
var map = new mapboxgl.Map({
style: 'mapbox://styles/mapbox/light-v10',
center: [-74.0066, 40.7135],
zoom: 15.5,
pitch: 45,
bearing: -17.6,
container: 'map',
antialias: true
});
// The 'building' layer in the Mapbox Streets
// vector tileset contains building height data
// from OpenStreetMap.
map.addLayer(
{
'id': 'add-3d-buildings',
'source': 'composite',
'source-layer': 'building',
'filter': ['==', 'extrude', 'true'],
'type': 'fill-extrusion',
'minzoom': 15,
'paint': {
'fill-extrusion-color': '#aaa',

// Use an 'interpolate' expression to
// add a smooth transition effect to
// the buildings as the user zooms in.
'fill-extrusion-height': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'height']
],
'fill-extrusion-base': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'min_height']
],
'fill-extrusion-opacity': 0.6
}
},

labelLayerId
);
});
StaticMapboxMap.defaultProps = {
  address: '',
  center: null,
  zoom: config.maps.fuzzy.enabled ? config.maps.fuzzy.defaultZoomLevel : 11,
  mapsConfig: config.maps,
};

StaticMapboxMap.propTypes = {
  address: string,
  center: shape({
    lat: number.isRequired,
    lng: number.isRequired,
  }).isRequired,
  zoom: number,
  mapsConfig: object,

  // from withDimensions
  dimensions: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,
};

export default lazyLoadWithDimensions(StaticMapboxMap, { maxWidth: '640px' });
