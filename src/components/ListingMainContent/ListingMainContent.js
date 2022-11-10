import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import { convertFilterKeyToLabel } from '../../util/data';
import { ButtonTabNavHorizontal } from '../TabNavHorizontal/TabNavHorizontal';

import { types } from 'sharetribe-flex-sdk';
const { Money } = types;
import { formatMoneyInteger } from '../../util/currency';
import { richText } from '../../util/richText';

import css from './ListingMainContent.module.css';

const priceData = (minPrice, maxPrice, intl) => {
  const minPriceMoney = new Money(minPrice, 'USD');
  const maxPriceMoney = new Money(maxPrice, 'USD');

  if (minPriceMoney && maxPriceMoney) {
    const formattedMinPrice = formatMoneyInteger(intl, minPriceMoney);
    const formattedMaxPrice = formatMoneyInteger(intl, maxPriceMoney);

    return {
      formattedMinPrice,
      formattedMaxPrice,
      priceTitle: formattedMinPrice + ' - ' + formattedMaxPrice,
    };
  } else if (maxPriceMoney && minPriceMoney) {
    return {
      formattedMinPrice: intl.formatMessage(
        { id: 'CaregiverListingCard.unsupportedPrice' },
        { currency: minPriceMoney.currency }
      ),
      formattedMaxPrice: intl.formatMessage(
        { id: 'CaregiverListingCard.unsupportedPrice' },
        { currency: maxPriceMoney.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'CaregiverListingCard.unsupportedPriceTitle' },
        { currency: maxPriceMoney.currency }
      ),
    };
  }
  return {};
};

const tabLabel = (intl, tab) => {
  let key = null;
  if (tab === 'availability') {
    key = 'AVAILABILITY';
  } else if (tab === 'bio') {
    key = 'BIO';
  } else if (tab === 'services') {
    key = 'SERVICES';
  } else if (tab === 'qualifications') {
    key = 'QUALIFICATIONS';
  } else if (tab === 'safety') {
    key = 'SAFETY';
  } else if (tab === 'recommendations') {
    key = 'RECOMMENDATIONS';
  }

  return intl.formatMessage({ id: key });
};

const experienceLevelConverter = new Map([
  ['novice', '1-2 years'],
  ['competent', '3-4 years'],
  ['proficient', '5-9 years'],
  ['expert', '10+ years'],
  ['beginner', '0 years'],
]);

const convertExperienceToLabel = key => {
  return experienceLevelConverter.get(key);
};

const selectTab = e => {};

const MIN_LENGTH_FOR_LONG_WORDS = 16;
const tabs = [
  {
    text: 'availability',
    selected: false,
    onClick: selectTab,
  },
  {
    text: 'bio',
    selected: false,
    onClick: selectTab,
  },
  {
    text: 'services',
    selected: false,
    onClick: selectTab,
  },
  {
    text: 'qualifications',
    selected: false,
    onClick: selectTab,
  },
  {
    text: 'safety',
    selected: false,
    onClick: selectTab,
  },
  {
    text: 'recommendations',
    selected: false,
    onClick: selectTab,
  },
];

const ListingMainContent = props => {
  const { rootClassName, className, currentListing, intl } = props;

  const classes = classNames(rootClassName || css.root, className);

  const {
    location = '',
    minPrice,
    maxPrice,
    experienceLevel,
    covidVaccination,
    experienceWith,
    certificationsAndTraining,
    languagesSpoken,
    additionalInfo,
  } = currentListing?.attributes.publicData;
  const { formattedMinPrice } = priceData(minPrice, maxPrice, intl);

  const convertedExperienceLevel = convertExperienceToLabel(experienceLevel);

  const infoArray = [];

  const details = {
    experienceWith,
    covidVaccination,
    certificationsAndTraining,
    languagesSpoken,
    additionalInfo,
  };

  for (const property in details) {
    if (details[property] instanceof Array) {
      details[property].forEach(detail => {
        infoArray.push(detail);
      });
    } else {
      infoArray.push(details[property]);
    }
  }

  const convertedInfo = convertFilterKeyToLabel(infoArray, currentListing?.attributes.publicData);

  return (
    <div className={classes}>
      <div className={css.topSection}>
        <div className={css.primaryInfoContainer}>
          <div>
            <div className={css.primaryInfo}>
              <span className={css.bold}>Pay rate: </span>
              <span className={css.marketH2}>
                &nbsp;
                {formattedMinPrice}-{maxPrice / 100}
              </span>
              <span className={css.perUnit}>
                &nbsp;
                <FormattedMessage id={'CaregiverListingCard.perUnit'} />
              </span>
            </div>
            <div className={css.primaryInfo}>
              <span className={css.bold}>Experience: </span>
              <span className={css.marketH2}>&nbsp;{convertedExperienceLevel}</span>
            </div>
            <div className={css.primaryInfo}>
              <div className={css.marketH2}>
                {richText(location, {
                  longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                  longWordClass: css.longWord,
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={css.attributesContainer}>
          <div className={css.attributesGrid}>
            {convertedInfo.slice(0, 6).map(info => (
              <div className={css.gridItem}>- {info}</div>
            ))}
          </div>
        </div>
      </div>
      <div className={css.tabsContainer}>
        <ButtonTabNavHorizontal tabs={tabs} rootClassName={css.nav} tabRootClassName={css.tab} />
      </div>
    </div>
  );
};

export default ListingMainContent;
