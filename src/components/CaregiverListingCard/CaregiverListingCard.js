import React, { Fragment } from 'react';
import { array, string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoneyInteger } from '../../util/currency';
import { ensureListing, userDisplayNameAsString, cutTextToPreview } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage, Avatar, Button } from '..';
import { types } from 'sharetribe-flex-sdk';
const { Money, User } = types;
import { findOptionsForSelectFilter } from '../../util/search';

import css from './CaregiverListingCard.module.css';
import { info } from 'autoprefixer';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

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
    onContactUser,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const currentAuthor = currentListing.author;
  const userDisplayName = userDisplayNameAsString(currentAuthor) + '.';
  const { publicData, description } = currentListing.attributes;
  const { rates, location, careTypes: providedServices } = publicData;
  const slug = createSlug(userDisplayName);

  let descriptionCutoff =
    description.length > 300 ? cutTextToPreview(description, 300) : description;

  const { formattedMinPrice, formattedMaxPrice, priceTitle } = priceData(rates, intl);

  const servicesMap = new Map();
  findOptionsForSelectFilter('careTypes', filtersConfig).forEach(option =>
    servicesMap.set(option.key, option.label)
  );

  currentAuthor.profileImage = listing.images[0];
  const avatarComponent = (
    <Avatar
      className={css.avatar}
      renderSizes="(max-width: 767px) 96px, 240px"
      user={currentAuthor}
      disableProfileLink
    />
  );

  return (
    <div className={css.container}>
      <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
        <div className={css.user}>
          {avatarComponent}
          <div className={css.price}>
            <div className={css.priceValue} title={priceTitle}>
              {formattedMinPrice}-{rates[1] / 100}
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
                {richText(userDisplayName, {
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
          </div>

          <div className={css.providedServices}>
            <span className={css.serviceBold}>Provides services for: </span>
            {providedServices
              .slice(0, 4)
              .map(service => servicesMap.get(service))
              .join(', ') + '...'}
          </div>
          <div className={css.description}>{descriptionCutoff}</div>
          <div className={css.descriptionBox}></div>
        </div>
      </NamedLink>
      <Button
        className={css.messageButton}
        onClick={() => onContactUser(currentAuthor, currentListing.id)}
      >
        Message
      </Button>
    </div>
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
