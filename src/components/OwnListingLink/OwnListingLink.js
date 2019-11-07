import React from 'react';
import { NamedLink } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { getListingType, createSlug } from '../../util/urlHelpers';

import css from './OwnListingLink.css';

const OwnListingLink = props => {
  const { className, listing } = props;
  if (!listing) {
    return (
      <NamedLink className={className ? className : css.yourListingsLink} name="NewListingPage">
        <span className={css.menuItemBorder} />
        <FormattedMessage id="OwnListingLink.addYourListingLink" />
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
      <FormattedMessage id="OwnListingLink.editYourListingLink" />
    </NamedLink>
  );
};

export default OwnListingLink;
