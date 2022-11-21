import React from 'react';
import { useMemo } from 'react';
import { AvatarLarge, NamedLink } from '../';
import { createSlug, stringify } from '../../util/urlHelpers';
import { userDisplayNameAsString } from '../../util/data';

import css from './UserMessagePreview.module.css';

const createListingLink = (listing, otherUser, searchParams = {}, className = '') => {
  const listingId = listing.id && listing.id.uuid;
  const label = listing.attributes.title;
  const listingDeleted = listing.attributes.deleted;

  if (!listingDeleted) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={css.avatarLink} name="ListingPage" params={params} to={to}>
        <AvatarLarge user={otherUser} disableProfileLink className={css.avatar} />
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionPanel.deletedListingOrderTitle" />;
  }
};

const UserMessagePreview = props => {
  const { otherUser, otherUserListing, currentTransaction } = props;

  const listingLink = otherUserListing ? createListingLink(otherUserListing, otherUser) : null;

  const userDisplayNameString = userDisplayNameAsString(otherUser, '');

  return (
    <div className={css.root}>
      <div className={css.avatarContainer}>
        {otherUserListing ? listingLink : <AvatarLarge user={otherUser} className={css.avatar} />}
      </div>
      <div className={css.usernameContainer}>{userDisplayNameString}</div>
    </div>
  );
};

export default UserMessagePreview;
