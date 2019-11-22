import React from 'react';
import { string } from 'prop-types';
import { txIsEnquired } from '../../util/transaction';
import { propTypes } from '../../util/types';

import { TimeRange } from '../../components';

const bookingData = tx => {
  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { start, end, displayStart, displayEnd } = tx.booking.attributes;
  const bookingStart = displayStart || start;
  const bookingEnd = displayEnd || end;
  return { bookingStart, bookingEnd };
};

const BookingTimeInfo = props => {
  const { bookingClassName, tx, dateType, timeZone } = props;
  const isEnquiry = txIsEnquired(tx);

  if (isEnquiry) {
    return null;
  }

  const { bookingStart, bookingEnd } = bookingData(tx);

  return (
    <TimeRange
      className={bookingClassName}
      startDate={bookingStart}
      endDate={bookingEnd}
      dateType={dateType}
      timeZone={timeZone}
    />
  );
};

BookingTimeInfo.defaultProps = { dateType: null, timeZone: null };

BookingTimeInfo.propTypes = {
  tx: propTypes.transaction.isRequired,
  dateType: propTypes.dateType,
  timeZone: string,
};

export default BookingTimeInfo;
