import React from 'react';
import { bool, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { OwnListingLink } from '../../components';

import css from './SectionHowItWorks.css';

const SectionHowItWorks = props => {
  const {
    rootClassName,
    className,
    currentUserListing,
    currentUserListingFetched,
    translationKey = 'SectionHowItWorks',
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id={`${translationKey}.titleLineOne`} />
        <br />
        <FormattedMessage id={`${translationKey}.titleLineTwo`} />
      </div>

      <div className={css.steps}>
        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id={`${translationKey}.part1Title`} />
          </h2>
          <p>
            <FormattedMessage id={`${translationKey}.part1Text`} />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id={`${translationKey}.part2Title`} />
          </h2>
          <p>
            <FormattedMessage id={`${translationKey}.part2Text`} />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id={`${translationKey}.part3Title`} />
          </h2>
          <p>
            <FormattedMessage id={`${translationKey}.part3Text`} />
          </p>
        </div>
      </div>
      <div className={css.createListingLink}>
        <OwnListingLink listing={currentUserListing} listingFetched={currentUserListingFetched}>
          <FormattedMessage id={`${translationKey}.createListingLink`} />
        </OwnListingLink>
      </div>
    </div>
  );
};

SectionHowItWorks.defaultProps = {
  rootClassName: null,
  className: null,
  currentUserListing: null,
  currentUserListingFetched: false,
};

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
};

export default SectionHowItWorks;
