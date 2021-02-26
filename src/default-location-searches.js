import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-new-york',
    predictionPlace: {
      address: 'New York City, New York, USA',
      bounds: new LatLngBounds(
        new LatLng(40.917576401307, -73.7008392055224),
        new LatLng(40.477399, -74.2590879797556)
      ),
    },
  },
  {
    id: 'default-helsinki',
    predictionPlace: {
      address: 'Helsinki, Finland',
      bounds: new LatLngBounds(
        new LatLng(60.29783, 25.25448),
        new LatLng(59.92248, 24.78287)
      ),
    },
  },
  {
  id: 'default-auckland',
  predictionPlace: {
    address: 'Auckland, New Zealand',
    bounds: new LatLngBounds(
      new LatLng(-36.545, 175.298), 
      new LatLng(-37.047,174.498)),
  },
},
  {
    id: 'default-seattle',
    predictionPlace: {
      address: 'Seattle, Washington, USA',
      bounds: new LatLngBounds(
        new LatLng(47.7779392908564, -122.216605992108),
        new LatLng(47.3403950185547, -122.441233019046)
      ),
    },
  },
  {
    id: 'default-portland',
    predictionPlace: {
      address: 'Portland, Oregon, USA',
      bounds: new LatLngBounds(
        new LatLng(45.858099013046, -122.441059986416),
        new LatLng(45.3794799927623, -122.929215816001)
      ),
    },
  },
];
export default defaultLocations;
