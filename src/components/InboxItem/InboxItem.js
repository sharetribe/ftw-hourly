import React from 'react';
import { NamedLink, Avatar, UserDisplayName } from '../';
import { propTypes } from '../../util/types';
import { oneOf } from 'prop-types';
import { intlShape } from '../../util/reactIntl';
import { txIsRequested } from '../../util/transaction';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import { ensureCurrentUser } from '../../util/data';

import css from './InboxItem.module.css';

const formatDate = (intl, date) => {
  return {
    short: intl.formatDate(date, {
      month: 'short',
      day: 'numeric',
    }),
    long: `${intl.formatDate(date)} ${intl.formatTime(date)}`,
  };
};

// Creates named link for listing that is wrapped around the avatar
const createListingLink = (listing, otherUser, searchParams = {}, className = '') => {
  const listingId = listing.id && listing.id.uuid;
  const label = listing.attributes.title;
  const listingDeleted = listing.attributes.deleted;

  if (!listingDeleted) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={className} name="ListingPage" params={params} to={to}>
        <Avatar user={otherUser} disableProfileLink rootClassName={css.avatarRoot} />
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionPanel.deletedListingOrderTitle" />;
  }
};

const InboxItem = props => {
  const { tx, intl, params, currentUser, selected, previewMessage, lastMessageTime } = props;
  const { customer, provider } = tx;

  const ensuredCurrentUser = ensureCurrentUser(currentUser);

  const otherUser = ensuredCurrentUser === provider.id.uuid ? customer : provider;
  const otherUserDisplayName = <UserDisplayName user={otherUser} intl={intl} />;
  const isOtherUserBanned = otherUser.attributes.banned;

  const isSaleNotification = txIsRequested(tx);
  const rowNotificationDot = isSaleNotification ? <div className={css.notificationDot} /> : null;
  const lastTransitionedAt = formatDate(intl, tx.attributes.lastTransitionedAt);

  const currentTab = params.tab;

  const classes = classNames(css.item, selected && css.selected);

  return (
    <NamedLink
      className={classes}
      name="InboxPage"
      params={{ tab: currentTab, search: '?id=' + tx.id.uuid.toString() }}
    >
      <div className={css.mainContent}>
        <div className={css.itemAvatar}>
          {/* Should make this just require list */}
          <Avatar user={otherUser} rootClassName={css.avatarRoot} />
        </div>

        <div className={css.itemText}>
          <div className={css.itemInfo}>
            <div className={css.itemUsername}>{otherUserDisplayName}</div>
            <div className={css.itemState}>
              <div className={css.lastTransitionedAt} title={lastTransitionedAt.long}>
                {rowNotificationDot && (
                  <div className={css.rowNotificationDot}>{rowNotificationDot}</div>
                )}
                {lastMessageTime}
              </div>
            </div>
          </div>
          <div className={css.previewMessage}>{previewMessage}</div>
        </div>
      </div>
    </NamedLink>
  );
};

InboxItem.propTypes = {
  unitType: propTypes.bookingUnitType.isRequired,
  tx: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default InboxItem;
