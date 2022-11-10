import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';

import css from './ListingAvailabilityPanel.module.css';

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
  const { rootClassName, className, availabilityPlan } = props;

  const classes = classNames(rootClassName || css.root, className);

  const formattedTimes = availabilityPlan && createTimesArray(availabilityPlan);

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
    </div>
  );
};

export default ListingAvailabilityPanel;
