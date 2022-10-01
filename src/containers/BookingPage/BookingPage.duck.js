// import unionWith from 'lodash/unionWith';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
// import { convertUnitToSubUnit, unitDivisor } from '../../util/currency';
import { formatDateStringToTz, getExclusiveEndDateWithTz } from '../../util/dates';
import { parse } from '../../util/urlHelpers';
import config from '../../config';

// Pagination page size might need to be dynamic on responsive page layouts
// Current design has max 3 columns 12 is divisible by 2 and 3
// So, there's enough cards to fill all columns on full pagination pages
const RESULT_PAGE_SIZE = 24;

// ================ Action types ================ //

export const BOOKING_SEARCH_LISTINGS_REQUEST = 'app/BookingPage/BOOKING_SEARCH_LISTINGS_REQUEST';
export const BOOKING_SEARCH_LISTINGS_SUCCESS = 'app/BookingPage/BOOKING_SEARCH_LISTINGS_SUCCESS';
export const BOOKING_SEARCH_LISTINGS_ERROR = 'app/BookingPage/BOOKING_SEARCH_LISTINGS_ERROR';

// export const BOOKING_SEARCH_MAP_LISTINGS_REQUEST = 'app/BookingPage/BOOKING_SEARCH_MAP_LISTINGS_REQUEST';
// export const BOOKING_SEARCH_MAP_LISTINGS_SUCCESS = 'app/BookingPage/BOOKING_SEARCH_MAP_LISTINGS_SUCCESS';
// export const BOOKING_SEARCH_MAP_LISTINGS_ERROR = 'app/BookingPage/BOOKING_SEARCH_MAP_LISTINGS_ERROR';

// export const BOOKING_SEARCH_MAP_SET_ACTIVE_LISTING = 'app/BookingPage/BOOKING_SEARCH_MAP_SET_ACTIVE_LISTING';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  bookingSearchParams: null,
  bookingSearchInProgress: false,
  bookingSearchListingsError: null,
  currentPageResultIds: [],
  //   searchMapListingIds: [],
  //   searchMapListingsError: null,
};

// Listing IDs
const resultIds = data => data.data.map(l => l.id);

const bookingSearchPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case BOOKING_SEARCH_LISTINGS_REQUEST:
      return {
        ...state,
        bookingSearchParams: payload.bookingSearchParams,
        bookingSearchInProgress: true,
        // searchMapListingIds: [],
        bookingSearchListingsError: null,
      };
    case BOOKING_SEARCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        bookingSearchInProgress: false,
      };
    case BOOKING_SEARCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, bookingSearchInProgress: false, bookingSearchListingsError: payload };

    // case BOOKING_SEARCH_MAP_LISTINGS_REQUEST:
    //   return {
    //     ...state,
    //     searchMapListingsError: null,
    //   };
    // case BOOKING_SEARCH_MAP_LISTINGS_SUCCESS: {
    //   const searchMapListingIds = unionWith(
    //     state.searchMapListingIds,
    //     resultIds(payload.data),
    //     (id1, id2) => id1.uuid === id2.uuid
    //   );
    //   return {
    //     ...state,
    //     searchMapListingIds,
    //   };
    // }
    // case BOOKING_SEARCH_MAP_LISTINGS_ERROR:
    //   // eslint-disable-next-line no-console
    //   console.error(payload);
    //   return { ...state, searchMapListingsError: payload };

    // case BOOKING_SEARCH_MAP_SET_ACTIVE_LISTING:
    //   return {
    //     ...state,
    //     activeListingId: payload,
    //   };
    default:
      return state;
  }
};

export default bookingSearchPageReducer;

// ================ Action creators ================ //

export const bookingSearchListingsRequest = bookingSearchParams => ({
  type: BOOKING_SEARCH_LISTINGS_REQUEST,
  payload: { bookingSearchParams },
});

export const bookingSearchListingsSuccess = response => ({
  type: BOOKING_SEARCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const bookingSearchListingsError = e => ({
  type: BOOKING_SEARCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

// export const searchMapListingsRequest = () => ({ type: BOOKING_SEARCH_MAP_LISTINGS_REQUEST });

// export const searchMapListingsSuccess = response => ({
//   type: BOOKING_SEARCH_MAP_LISTINGS_SUCCESS,
//   payload: { data: response.data },
// });

// export const searchMapListingsError = e => ({
//   type: BOOKING_SEARCH_MAP_LISTINGS_ERROR,
//   error: true,
//   payload: e,
// });

export const bookingSearchListings = bookingSearchParams => (dispatch, getState, sdk) => {
  dispatch(bookingSearchListingsRequest(bookingSearchParams));

  const availabilityParams = (datesParam, minDurationParam) => {
    const dateValues = datesParam ? datesParam.split(',') : [];
    const hasDateValues = datesParam && dateValues.length === 2;
    const startDate = hasDateValues ? dateValues[0] : null;
    const endDate = hasDateValues ? dateValues[1] : null;

    const minDurationMaybe =
      minDurationParam && Number.isInteger(minDurationParam) && hasDateValues
        ? { minDuration: minDurationParam }
        : {};

    // Find configs for 'dates-length' filter
    // (type: BookingDateRangeLengthFilter)
    const filterConfigs = config.custom.filters;
    const idOfBookingDateRangeLengthFilter = 'dates-length';
    const dateLengthFilterConfig = filterConfigs.find(
      f => f.id === idOfBookingDateRangeLengthFilter
    );
    // Extract time zone
    const timeZone = dateLengthFilterConfig.config.searchTimeZone;

    return hasDateValues
      ? {
          start: formatDateStringToTz(startDate, timeZone),
          end: getExclusiveEndDateWithTz(endDate, timeZone),

          // When we have `time-partial` value in the availability, the
          // API returns listings that don't necessarily have the full
          // start->end range available, but enough that the minDuration
          // (in minutes) can be fulfilled.
          //
          // See: https://www.sharetribe.com/api-reference/marketplace.html#availability-filtering
          availability: 'time-partial',

          ...minDurationMaybe,
        }
      : {};
  };

  const { perPage, dates, minDuration, ...rest } = bookingSearchParams;
  const availabilityMaybe = availabilityParams(dates, minDuration);

  const params = {
    ...rest,
    ...availabilityMaybe,
    per_page: perPage,
  };

  console.log(params);
  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(bookingSearchListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(bookingSearchListingsError(storableError(e)));
      throw e;
    });
};

export const setActiveListing = listingId => ({
  type: BOOKING_SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});

// export const searchMapListings = bookingSearchParams => (dispatch, getState, sdk) => {
//   dispatch(searchMapListingsRequest(bookingSearchParams));

//   const { perPage, ...rest } = bookingSearchParams;
//   const params = {
//     ...rest,
//     per_page: perPage,
//   };

//   return sdk.listings
//     .query(params)
//     .then(response => {
//       dispatch(addMarketplaceEntities(response));
//       dispatch(searchMapListingsSuccess(response));
//       return response;
//     })
//     .catch(e => {
//       dispatch(searchMapListingsError(storableError(e)));
//       throw e;
//     });
// };

export const loadData = (params, search) => {
  const queryParams = parse(search);
  const { page = 1, ...rest } = queryParams;
  //   const originMaybe = config.sortSearchByDistance && origin ? { origin } : {};
  return bookingSearchListings({
    ...rest,
    // ...originMaybe,
    page,
    perPage: RESULT_PAGE_SIZE,
    include: ['author', 'images'],
    'fields.listing': ['title', 'geolocation', 'price', 'availabilityPlan', 'publicData'],
    // 'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    // 'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  });
};
