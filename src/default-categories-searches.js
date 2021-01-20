import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
    {
        id: 'default-health-practitioners',
        predictionCategories: {
            name: 'Health Practitioners',
            bounds: new LatLngBounds(
                new LatLng(40.917576401307, -73.7008392055224),
                new LatLng(40.477399, -74.2590879797556)
            ),
        },
    },
    {
        id: 'default-legal-expert',
        predictionPlace: {
            name: 'Legal Expert',
            bounds: new LatLngBounds(
                new LatLng(34.161440999758, -118.121305008073),
                new LatLng(33.9018913203336, -118.521456965901)
            ),
        },
    },
    {
        id: 'default-it-and-technology-gurus',
        predictionPlace: {
            address: 'IT & Technology Gurus',
            bounds: new LatLngBounds(
                new LatLng(37.8324430069081, -122.354995082683),
                new LatLng(37.6044780500533, -122.517910874663)
            ),
        },
    },
    {
        id: 'default-sports-and-fitness-instructor',
        predictionPlace: {
            address: 'Sports & Fitness Instructors',
            bounds: new LatLngBounds(
                new LatLng(47.7779392908564, -122.216605992108),
                new LatLng(47.3403950185547, -122.441233019046)
            ),
        },
    },
    {
        id: 'default-accountants-and-financial-advisors',
        predictionPlace: {
            address: 'Accountants & Financial Advisors',
            bounds: new LatLngBounds(
                new LatLng(45.858099013046, -122.441059986416),
                new LatLng(45.3794799927623, -122.929215816001)
            ),
        },
    },
    {
        id: 'default-fashionistas-and-beauticians',
        predictionPlace: {
            address: 'Fashionistas & Beauticians',
            bounds: new LatLngBounds(
                new LatLng(45.858099013046, -122.441059986416),
                new LatLng(45.3794799927623, -122.929215816001)
            ),
        },
    },
    {
        id: 'default-educators-and-teachers',
        predictionPlace: {
            address: 'Educators & Teachers',
            bounds: new LatLngBounds(
                new LatLng(45.858099013046, -122.441059986416),
                new LatLng(45.3794799927623, -122.929215816001)
            ),
        },
    },
    {
        id: 'default-home-improvement-and-homekeeping-consultants',
        predictionPlace: {
            address: 'Home Improvement & Homekeeping Consultants',
            bounds: new LatLngBounds(
                new LatLng(45.858099013046, -122.441059986416),
                new LatLng(45.3794799927623, -122.929215816001)
            ),
        },
    },
];
