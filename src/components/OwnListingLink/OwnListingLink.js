import React from 'react';
import { bool, object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { propTypes, LISTING_STATE_DRAFT } from '../../util/types';
import { getListingType, createSlug } from '../../util/urlHelpers';
import { NamedLink } from '../../components';

import css from './OwnListingLink.module.css';

const OwnListingLink = props => {
  const { className, listing, listingFetched, children } = props;

  if (!listingFetched) {
    return null;
  }

  if (!listing) {
    return (
      <NamedLink className={className ? className : css.defaultLinkStyle} name="NewListingPage">
        {children ? children : <FormattedMessage id="OwnListingLink.addYourListingLink" />}
      </NamedLink>
    );
  }

  const currentListing = ensureOwnListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', state } = currentListing.attributes;
  const slug = createSlug(title);
  const isDraft = state === LISTING_STATE_DRAFT;

  return (
    <NamedLink
      className={className ? className : css.yourListingsLink}
      name="EditListingPage"
      params={{
        id,
        slug,
        type: getListingType(isDraft),
        tab: 'photos',
      }}
    >
      <span className={css.menuItemBorder} />
      {children ? children : <FormattedMessage id="OwnListingLink.editYourListingLink" />}
    </NamedLink>
  );
};

OwnListingLink.defaultProps = {
  className: null,
  listing: null,
  listingFetched: false,
  children: null,
};

OwnListingLink.propTypes = {
  className: string,
  listing: propTypes.ownListing,
  listingFetched: bool,
  children: object,
};

export default OwnListingLink;
