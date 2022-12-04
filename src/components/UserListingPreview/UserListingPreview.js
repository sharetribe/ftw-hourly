import React from 'react';
import { AvatarLarge, NamedLink, UserDisplayName } from '../';
import { createSlug, stringify } from '../../util/urlHelpers';
import classNames from 'classnames';

import css from './UserListingPreview.module.css';

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

const UserListingPreview = props => {
  const { otherUser, otherUserListing, intl, rootClassName, className } = props;

  const listingLink = otherUserListing ? createListingLink(otherUserListing, otherUser) : null;

  const userDisplayName = <UserDisplayName user={otherUser} intl={intl} />;

  const rootClass = classNames(rootClassName || css.root);
  const usernameClass = classNames(className || css.usernameContainer);

  return (
    <div className={rootClass}>
      <div className={css.avatarContainer}>
        {otherUserListing ? listingLink : <AvatarLarge user={otherUser} className={css.avatar} />}
      </div>
      <div className={usernameClass}>{userDisplayName}</div>
    </div>
  );
};

export default UserListingPreview;
