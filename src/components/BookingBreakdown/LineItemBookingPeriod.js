import React from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import moment from 'moment';
import { LINE_ITEM_NIGHT, LINE_ITEM_UNITS, DATE_TYPE_DATE, propTypes } from '../../util/types';

import css from './BookingBreakdown.module.css';

const BookingPeriod = props => {
  const { startDate, endDate, dateType, timeZone } = props;

  const timeFormatOptions =
    dateType === DATE_TYPE_DATE
      ? {
        weekday: 'long',
      }
      : {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      };

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const timeZoneMaybe = timeZone ? { timeZone } : null;

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSection}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingStart" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={startDate} {...timeFormatOptions} {...timeZoneMaybe} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={startDate} {...dateFormatOptions} {...timeZoneMaybe} />
          </div>
        </div>

        <div className={css.bookingPeriodSectionRigth}>
          <div className={css.dayLabel}>
            <FormattedMessage id="BookingBreakdown.bookingEnd" />
          </div>
          <div className={css.dayInfo}>
            <FormattedDate value={endDate} {...timeFormatOptions} {...timeZoneMaybe} />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={endDate} {...dateFormatOptions} {...timeZoneMaybe} />
          </div>
        </div>
      </div>
    </>
  );
};

const LineItemBookingPeriod = props => {
  const { booking, unitType, dateType, timeZone } = props;

  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { start, end, displayStart, displayEnd } = booking.attributes;
  const localStartDate = displayStart || start;
  const localEndDateRaw = displayEnd || end;

  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isUnit = unitType === LINE_ITEM_UNITS;
  const endDay =
    isUnit || isNightly ? localEndDateRaw : moment(localEndDateRaw).subtract(1, 'days');

  return (
    <>
      <div className={css.lineItem}>
        <BookingPeriod
          startDate={localStartDate}
          endDate={endDay}
          dateType={dateType}
          timeZone={timeZone}
        />
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};
LineItemBookingPeriod.defaultProps = { dateType: null };

LineItemBookingPeriod.propTypes = {
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,
};

export default LineItemBookingPeriod;
