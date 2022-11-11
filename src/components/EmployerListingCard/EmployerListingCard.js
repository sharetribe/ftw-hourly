import React, { Fragment } from 'react';
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

import css from './employerListingCard.module.css';
import { info } from 'autoprefixer';

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
        { id: 'employerListingCard.unsupportedPrice' },
        { currency: minPriceMoney.currency }
      ),
      formattedMaxPrice: intl.formatMessage(
        { id: 'employerListingCard.unsupportedPrice' },
        { currency: maxPriceMoney.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'employerListingCard.unsupportedPriceTitle' },
        { currency: maxPriceMoney.currency }
      ),
    };
  }
  return {};
};

const cutText = (text, length) => {
  var textCutoff = text.substr(0, length);

  while (textCutoff.charAt(textCutoff.length - 1) !== ' ') {
    textCutoff = textCutoff.substr(0, textCutoff.length - 1);
  }

  textCutoff = textCutoff.substr(0, textCutoff.length - 1);

  if (textCutoff.charAt(textCutoff.length - 1).match(/^[.,:!?]/)) {
    textCutoff = textCutoff.substr(0, textCutoff.length - 1);
  }

  return textCutoff + '...';
};

// const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const EmployerListingCardComponent = props => {
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
  const { firstName, lastName } = currentUser?.attributes.profile;
  const title = currentListing.author.attributes.profile.displayName + '.';
  const { publicData, description } = currentListing.attributes;
  const { minPrice, maxPrice, location, careTypes: providedServices } = publicData;
  const slug = createSlug(title);

  let descriptionCutoff = description.length > 300 ? cutText(description, 300) : description;

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
    <div className={css.container}>
      <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
        <div className={css.user}>
          {avatarComponent}
          <div className={css.price}>
            <div className={css.priceValue} title={priceTitle}>
              {formattedMinPrice}-{maxPrice / 100}
              <span className={css.perUnit}>
                &nbsp;
                <FormattedMessage id={'employerListingCard.perUnit'} />
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
      <Button className={css.messageButton} onClick={() => onContactUser(title, currentListing.id)}>
        Message
      </Button>
    </div>
  );
};

EmployerListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  filtersConfig: config.custom.filters,
  setActiveListing: () => null,
};

EmployerListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  filtersConfig: array,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(EmployerListingCardComponent);
