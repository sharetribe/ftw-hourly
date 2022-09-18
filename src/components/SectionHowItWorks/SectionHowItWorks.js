import React from 'react';
import { bool, string, integer, object } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPersonRays } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { OwnListingLink } from '../../components';
import StepHowItWorks from './StepHowItWorks';

import css from './SectionHowItWorks.module.css';

const SectionHowItWorks = props => {
  const {
    rootClassName,
    className,
    currentUserListing,
    currentUserListingFetched,
    numSteps,
    imgIcons,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
        <br />
        <FormattedMessage id="SectionHowItWorks.titleLineTwo" />
      </div>

      <div className={css.steps}>
        {Array.from({ length: numSteps }, (_, i) => i + 1).map(function(elem) {
          return (
            <StepHowItWorks
              key={elem}
              stepTitle={`SectionHowItWorks.part${elem}Title`}
              stepText={`SectionHowItWorks.part${elem}Text`}
              stepImg={imgIcons[elem]}
            />
          );
        })}
      </div>
      <div className={css.createListingLink}>
        <OwnListingLink listing={currentUserListing} listingFetched={currentUserListingFetched}>
          <FormattedMessage id="SectionHowItWorks.createListingLink" />
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
  numSteps: 3,
  imgIcons: {
    1: <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-4x" />,
    2: <FontAwesomeIcon icon={faCalendar} className="fa-4x" />,
    3: <FontAwesomeIcon icon={faPersonRays} className="fa-4x" />,
  },
};

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  // numSteps: integer,
  imgIcons: object,
};

export default SectionHowItWorks;
