import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';

import css from './ListingAvailabilityPanel.module.css';

const ListingAvailabilityPanel = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return <div className></div>;
};

export default ListingAvailabilityPanel;
