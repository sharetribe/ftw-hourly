import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import { BookingPanel } from '../';

import css from './ListingAvailabilityPanel.module.css';
import { BookingTimeForm } from '../../forms';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const createTimesArray = availabilityPlan => {
  let result = new Array(7).fill('NA');

  const entries = availabilityPlan.entries;

  let i = 0;
  let j = 0;

  DAYS_OF_WEEK.forEach(day => {
    if (day.toLowerCase().includes(entries[i] && entries[i].dayOfWeek)) {
      result[i] = entries[i].startTime + ' - ' + entries[i].endTime;
      i++;
    }
    j++;
  });

  return result;
};

const ListingAvailabilityPanel = props => {
  const {
    rootClassName,
    className,
    availabilityPlan,
    currentListing,
    isOwnListing,
    unitType,
    handleBookingSubmit,
    currentAuthor,
    onManageDisableScrolling,
    monthlyTimeSlots,
    onFetchTimeSlots,
    onFetchTransactionLineItems,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
  } = props;

  const classes = classNames(rootClassName || css.root, className);

  const formattedTimes = availabilityPlan && createTimesArray(availabilityPlan);

  const authorDisplayName = currentAuthor?.attributes.profile.displayName;

  return (
    <div className={classes}>
      <div className={css.recurringContainer}>
        <h1 className={css.sectionTitle}>Recurring Availability</h1>
        <div className={css.recurringTable}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Fragment>
              <div className={css.day}>{day}</div>
              <div className={css.times}>{formattedTimes[index]}</div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className={css.bookingPanelContainer}>
        <h1 className={css.sectionTitle}>Book Now</h1>
        <BookingPanel
          className={css.bookingPanel}
          listing={currentListing}
          isOwnListing={isOwnListing}
          unitType={unitType}
          onSubmit={handleBookingSubmit}
          title={authorDisplayName}
          authorDisplayName={authorDisplayName}
          onManageDisableScrolling={onManageDisableScrolling}
          monthlyTimeSlots={monthlyTimeSlots}
          onFetchTimeSlots={onFetchTimeSlots}
          onFetchTransactionLineItems={onFetchTransactionLineItems}
          lineItems={lineItems}
          fetchLineItemsInProgress={fetchLineItemsInProgress}
          fetchLineItemsError={fetchLineItemsError}
        />
      </div>
    </div>
  );
};

export default ListingAvailabilityPanel;
