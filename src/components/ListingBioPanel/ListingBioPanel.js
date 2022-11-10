import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';

import css from './ListingBioPanel.module.css';

const ListingBioPanel = props => {
  const { rootClassName, className, currentListing } = props;

  const classes = classNames(rootClassName || css.root, className);

  const bio = currentListing?.attributes.description;

  return (
    <div className={classes}>
      <div className={css.mainContainer}>
        <h1>About</h1>
        <div className={css.bio}>{bio}</div>
      </div>
    </div>
  );
};

export default ListingBioPanel;
