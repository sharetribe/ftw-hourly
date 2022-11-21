import React from 'react';
import { useMemo } from 'react';
import { Avatar, NamedLink } from '../';
import { createSlug, stringify } from '../../util/urlHelpers';

import css from './UserMessagePreview.module.css';

const createListingLink = (listing, otherUser, searchParams = {}, className = '') => {
  const listingId = listing.id && listing.id.uuid;
  const label = listing.attributes.title;
  const listingDeleted = listing.attributes.deleted;

  if (!listingDeleted) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={className} name="ListingPage" params={params} to={to}>
        <Avatar user={otherUser} disableProfileLink />
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionPanel.deletedListingOrderTitle" />;
  }
};

const UserMessagePreview = props => {
  const { otherUser, otherUserListing, currentTransaction } = props;

  const listingLink = otherUserListing ? createListingLink(otherUserListing, otherUser) : null;

  return <div>{otherUserListing ? listingLink : <Avatar user={otherUser} />}</div>;
};

export default UserMessagePreview;
