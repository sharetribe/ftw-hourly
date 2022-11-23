import React from 'react';
import { AvatarLarge, NamedLink, Button } from '../';
import { createSlug, stringify } from '../../util/urlHelpers';
import { userDisplayNameAsString } from '../../util/data';
import { useHistory } from 'react-router-dom';
import { EMPLOYER } from '../../util/constants';
import { storeData } from '../../containers/CheckoutPage/CheckoutPageSessionHelpers';

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
  const { currentUser, otherUser, otherUserListing, currentTransaction } = props;

  const history = useHistory();

  const redirectToCheckout = () => {
    const slug = createSlug(currentTransaction.listing.attributes.title);
    const txId = currentTransaction.id && currentTransaction.id.uuid;

    storeData(otherUser, otherUserListing, currentTransaction, 'CheckoutPage');

    history.push({ pathname: `/l/${slug}/${txId}/checkout` });
  };

  const listingLink = otherUserListing ? createListingLink(otherUserListing, otherUser) : null;

  const currentUserType = currentUser && currentUser.attributes.profile.metadata.userType;

  const userDisplayNameString = userDisplayNameAsString(otherUser, '');

  return (
    <div className={css.root}>
      <div className={css.avatarContainer}>
        {otherUserListing ? listingLink : <AvatarLarge user={otherUser} className={css.avatar} />}
      </div>
      <div className={css.usernameContainer}>{userDisplayNameString}</div>
      <div className={css.paymentButtonContainer}>
        {currentUserType === EMPLOYER && (
          <Button rootClassName={css.paymentButtonRoot} onClick={redirectToCheckout}>
            Pay
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserMessagePreview;
