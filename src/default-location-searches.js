import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-sydney',
    predictionPlace: {
      address: 'Sydney, New South Wales, Australia',
      bounds: new LatLngBounds(
        new LatLng(-33.8389201,150.8578366),
        new LatLng(-33.8296235,150.9912072)
      ),
    },
  },
];
