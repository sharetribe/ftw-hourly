import React from 'react';
import { withRouter } from 'react-router-dom';
import { stringify, parse } from '../../util/urlHelpers';
import { parseDateFromISO8601, stringifyDateToISO8601 } from '../../util/dates';
import BookingDateRangeLengthFilter from './BookingDateRangeLengthFilter';

const URL_PARAM = 'dates';

const handleSubmit = (urlParam, values, history) => {
  const hasDates = values && values.dates;
  const { startDate, endDate } = hasDates ? values.dates : {};

  const start = startDate ? stringifyDateToISO8601(startDate) : null;
  const end = endDate ? stringifyDateToISO8601(endDate) : null;

  const queryParams =
    start != null && end != null ? `?${stringify({ [urlParam]: [start, end].join(',') })}` : '';
  history.push(`${window.location.pathname}${queryParams}`);
};

const BookingDateRangeLengthFilterWrapper = withRouter(props => {
  const { history, location } = props;

  const params = parse(location.search);
  const dates = params[URL_PARAM];
  const rawValuesFromParams = !!dates ? dates.split(',') : [];
  const valuesFromParams = rawValuesFromParams.map(v => parseDateFromISO8601(v));
  const initialValues =
    !!dates && valuesFromParams.length === 2
      ? {
          dates: { startDate: valuesFromParams[0], endDate: valuesFromParams[1] },
        }
      : { dates: null };

  return (
    <BookingDateRangeLengthFilter
      {...props}
      initialValues={initialValues}
      onSubmit={(urlParam, values) => {
        console.log('Submit BookingDateRangeLengthFilter with (unformatted) values:', values);
        handleSubmit(urlParam, values, history);
      }}
    />
  );
});

export const BookingDateRangeLengthFilterPopup = {
  component: BookingDateRangeLengthFilterWrapper,
  props: {
    id: 'BookingDateRangeLengthFilterPopupExample',
    urlParam: URL_PARAM,
    liveEdit: false,
    showAsPopup: true,
    contentPlacementOffset: -14,
    // initialValues: handled inside wrapper
    // onSubmit: handled inside wrapper
  },
  group: 'misc',
};

export const BookingDateRangeLengthFilterPlain = {
  component: BookingDateRangeLengthFilterWrapper,
  props: {
    id: 'BookingDateRangeFilterPlainExample',
    urlParam: URL_PARAM,
    liveEdit: true,
    showAsPopup: false,
    contentPlacementOffset: -14,
    // initialValues: handled inside wrapper
    // onSubmit: handled inside wrapper
  },
  group: 'misc',
};
