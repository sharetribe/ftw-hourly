import React, { useState, useEffect, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import SectionReviews from '../../containers/ListingPage/SectionReviews';

import css from './ListingRecommendationsPanel.module.css';

const ListingRecommendationsPanel = props => {
  const { rootClassName, className, currentListing, reviews } = props;

  const classes = classNames(rootClassName || css.root, className);

  const RecommendationsOffered = currentListing?.attributes.publicData.careTypes;

  return (
    <div className={classes}>
      <h1>Reviews</h1>
      <SectionReviews reviews={reviews} />
    </div>
  );
};

export default ListingRecommendationsPanel;
