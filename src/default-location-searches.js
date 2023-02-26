import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-lothians',
    predictionPlace: {
      address: 'Edinburgh, Lothians, South East Scotland',
      bounds: new LatLngBounds(
        new LatLng(56.106745, -1.597070),
        new LatLng(55.636759, -3.393334)
      ),
    },
  },
  {
    id: 'default-glasgow',
    predictionPlace: {
      address: 'Glasgow, Ayrshire, South West Scotland',
      bounds: new LatLngBounds(
        new LatLng(55.922704, -3.809119),
        new LatLng(55.291280, -4.959937)
      ),
    },
  },
  {
    id: 'default-st-andrews',
    predictionPlace: {
      address: 'St Andrews, Fife, Central East Scotland',
      bounds: new LatLngBounds(
        new LatLng(56.599990, -2.438575),
        new LatLng(56.216292, -4.002753)
      ),
    },
  },
  {
    id: 'default-fort-william',
    predictionPlace: {
      address: 'Fort William, Mull, Central West Scotland',
      bounds: new LatLngBounds(
        new LatLng(56.864419, -4.158744),
        new LatLng(56.321528,-6.2488987)
      ),
    },
  },
  {
    id: 'default-aberdeen',
    predictionPlace: {
      address: 'Aberdeen, North East Scotland',
      bounds: new LatLngBounds(
        new LatLng(57.768393, -1.774467),
        new LatLng(57.134479, -3.090080)
      ),
    },
  },
  {
    id: 'default-highlands',
    predictionPlace: {
      address: 'Highlands, North & West Scotland',
      bounds: new LatLngBounds(
        new LatLng(58.763670, -2.936271),
        new LatLng(58.037480, -5.462041)
      ),
    },
  },
];
export default defaultLocations;
