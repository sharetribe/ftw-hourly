import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { array, bool, func, node, object, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import { convertFilterKeyToLabel } from '../../util/data';
import { ButtonTabNavHorizontal } from '../TabNavHorizontal/TabNavHorizontal';
import {
  ListingAvailabilityPanel,
  ListingBioPanel,
  ListingServicesPanel,
  ListingRecommendationsPanel,
} from '..';

import { types } from 'sharetribe-flex-sdk';
const { Money } = types;
import { formatMoneyInteger } from '../../util/currency';
import { richText } from '../../util/richText';

import css from './CaregiverListingMainContent.module.css';

const AVAILABILITY = 'AVAILABILITY';
const BIO = 'BIO';
const SERVICES = 'SERVICES';
const QUALIFICATIONS = 'QUALIFICATIONS';
const SAFETY = 'SAFETY';
const RECOMMENDATIONS = 'RECOMMENDATIONS';

const priceData = (rates, intl) => {
  const minPriceMoney = new Money(rates[0], 'USD');
  const maxPriceMoney = new Money(rates[1], 'USD');

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

const MIN_LENGTH_FOR_LONG_WORDS = 16;

const CaregiverListingMainContent = props => {
  const {
    rootClassName,
    className,
    currentListing,
    intl,
    onSelectTab,
    selectedTab,
    isOwnListing,
    unitType,
    handleBookingSubmit,
    currentAuthor,
    onManageDisableScrolling,
    monthlyTimeSlots,
    onFetchTimeSlots,
    onFetchTransactionLineItems,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    reviews,
  } = props;

  const tabs = [
    {
      text: AVAILABILITY,
      selected: selectedTab === AVAILABILITY,
      onClick: onSelectTab,
    },
    {
      text: BIO,
      selected: selectedTab === BIO,
      onClick: onSelectTab,
    },
    {
      text: SERVICES,
      selected: selectedTab === SERVICES,
      onClick: onSelectTab,
    },
    {
      text: QUALIFICATIONS,
      selected: selectedTab === QUALIFICATIONS,
      onClick: onSelectTab,
    },
    {
      text: SAFETY,
      selected: selectedTab === SAFETY,
      onClick: onSelectTab,
    },
    {
      text: RECOMMENDATIONS,
      selected: selectedTab === RECOMMENDATIONS,
      onClick: onSelectTab,
    },
  ];

  const classes = classNames(rootClassName || css.root, className);

  const {
    location = '',
    rates,
    experienceLevel,
    covidVaccination,
    experienceWith,
    certificationsAndTraining,
    languagesSpoken,
    additionalInfo,
  } = currentListing?.attributes.publicData;
  const { formattedMinPrice } = priceData(rates, intl);

  const convertedExperienceLevel = convertExperienceToLabel(experienceLevel);

  const infoArray = [];

  let tabContentPanel = null;

  switch (selectedTab) {
    case AVAILABILITY:
      const availabilityPlan = currentListing?.attributes.publicData.availabilityPlan;
      tabContentPanel = (
        <ListingAvailabilityPanel
          availabilityPlan={availabilityPlan}
          currentListing={currentListing}
          isOwnListing={isOwnListing}
          unitType={unitType}
          handleBookingSubmit={handleBookingSubmit}
          currentAuthor={currentAuthor}
          onManageDisableScrolling={onManageDisableScrolling}
          monthlyTimeSlots={monthlyTimeSlots}
          onFetchTimeSlots={onFetchTimeSlots}
          onFetchTransactionLineItems={onFetchTransactionLineItems}
          lineItems={lineItems}
          fetchLineItemsInProgress={fetchLineItemsInProgress}
          fetchLineItemsError={fetchLineItemsError}
        />
      );
      break;
    case BIO:
      tabContentPanel = <ListingBioPanel currentListing={currentListing} />;
      break;
    case SERVICES:
      tabContentPanel = <ListingServicesPanel currentListing={currentListing} />;
      break;
    case RECOMMENDATIONS:
      tabContentPanel = (
        <ListingRecommendationsPanel currentListing={currentListing} reviews={reviews} />
      );
      break;
    default:
      tabContentPanel = null;
      break;
  }

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
                {formattedMinPrice}-{rates[1] / 100}
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
              <div key={info} className={css.gridItem}>
                - {info}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={css.tabsContainer}>
        <ButtonTabNavHorizontal
          tabs={tabs}
          rootClassName={css.nav}
          tabRootClassName={css.tabRoot}
          tabContentClass={css.tabContent}
          tabClassName={css.tab}
        />
      </div>
      {tabContentPanel}
    </div>
  );
};

export default CaregiverListingMainContent;
