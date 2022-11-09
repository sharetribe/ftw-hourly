import React, { Component } from 'react';
import { array, string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoneyInteger } from '../../util/currency';
import { ensureListing } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage, Avatar, Button } from '..';
import { types } from 'sharetribe-flex-sdk';
const { Money, User } = types;
import { findOptionsForSelectFilter } from '../../util/search';

import css from './CaregiverListingCard.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

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

// const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const CaregiverListingCardComponent = props => {
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    filtersConfig,
    setActiveListing,
    currentUser,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { firstName, lastName } = currentUser?.attributes.profile;
  const title = firstName + ' ' + lastName;
  const { publicData, description } = currentListing.attributes;
  const { minPrice, maxPrice, location, careTypes: providedServices } = publicData;
  const slug = createSlug(title);

  const { formattedMinPrice, formattedMaxPrice, priceTitle } = priceData(minPrice, maxPrice, intl);

  const servicesMap = new Map();
  findOptionsForSelectFilter('careTypes', filtersConfig).forEach(option =>
    servicesMap.set(option.key, option.label)
  );

  const avatarUser = { profileImage: listing.images[0] };
  const avatarComponent = (
    <Avatar
      className={css.avatar}
      renderSizes="(max-width: 767px) 96px, 240px"
      user={avatarUser}
      disableProfileLink
    />
  );

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <div className={css.user}>
        {avatarComponent}
        <div className={css.price}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedMinPrice}-{maxPrice / 100}
            <span className={css.perUnit}>
              &nbsp;
              <FormattedMessage id={'CaregiverListingCard.perUnit'} />
            </span>
          </div>
        </div>
      </div>
      <div className={css.info}>
        <div className={css.mainInfo}>
          <div className={css.topInfo}>
            <div className={css.title}>
              {richText(title, {
                longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                longWordClass: css.longWord,
              })}
            </div>
            <div className={css.location}>
              {richText(location, {
                longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                longWordClass: css.longWord,
              })}
            </div>
          </div>
          <Button className={css.messageButton} onClick={onContactUser}>
            Message
          </Button>
        </div>

        <div className={css.providedServices}>
          <span className={css.serviceBold}>Provides services for: </span>
          {providedServices.map(service => servicesMap.get(service)).join(', ')}
        </div>
        <div className={css.description}>{description}</div>
      </div>
    </NamedLink>
  );
};

CaregiverListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  filtersConfig: config.custom.filters,
  setActiveListing: () => null,
};

CaregiverListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  filtersConfig: array,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(CaregiverListingCardComponent);
