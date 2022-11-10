import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';

import css from './ListingServicesPanel.module.css';

const ListingServicesPanel = props => {
  const { rootClassName, className, currentListing } = props;

  const classes = classNames(rootClassName || css.root, className);

  const servicesOffered = currentListing?.attributes.publicData.careTypes;

  return (
    <div className={classes}>
      <div className={css.servicesOfferedContainer}>
        <h1 className={css.sectionTitle}>Services offered</h1>
        <div className={css.servicesOffered}>
          {servicesOffered?.map(service => (
            <div className={css.service}>- {service}</div>
          ))}
        </div>
      </div>
      <div className={css.helpContainer}>
        <h1 className={css.sectionTitle}>Can help with:</h1>
        <div></div>
      </div>
    </div>
  );
};

export default ListingServicesPanel;
