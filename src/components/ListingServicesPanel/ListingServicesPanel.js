import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import { BookingPanel } from '../';

import css from './ListingServicesPanel.module.css';
import { BookingTimeForm } from '../../forms';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const createTimesArray = ServicesPlan => {
  let result = new Array(7).fill('NA');

  const entries = ServicesPlan.entries;

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

const ListingServicesPanel = props => {
  const { rootClassName, className, currentListing } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.servicesOfferedContainer}>
        <h1 className={css.sectionTitle}>Services offered</h1>
        <div></div>
      </div>
      <div className={css.helpContainer}>
        <h1 className={css.sectionTitle}>Can help with:</h1>
        <div></div>
      </div>
    </div>
  );
};

export default ListingServicesPanel;
