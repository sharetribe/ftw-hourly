import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';

import css from './ListingAvailabilityPanel.module.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ListingAvailabilityPanel = props => {
  const { rootClassName, className, availabilityPlan } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={classes.recurringContainer}>
        <h1 className={css.sectionTitle}>Recurring Availability</h1>
        <div className={css.recurringTable}>
          {DAYS_OF_WEEK.map(day => (
            <div className={css.day}>{day}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingAvailabilityPanel;
