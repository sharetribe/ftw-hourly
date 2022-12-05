import React from 'react';
import { NamedLink, Avatar, UserDisplayName } from '../';
import { propTypes } from '../../util/types';
import { oneOf } from 'prop-types';
import { intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import MessageInboxItemContent from './MessageInboxItemContent';
import NotificationInboxItemContent from './NotificationInboxItemContent';

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
  const { tx, intl, params, currentUser, selected, previewMessage } = props;

  const currentTab = params.tab;

  const classes = classNames(css.item, selected && css.selected);

  return (
    <NamedLink
      className={classes}
      name="InboxPage"
      params={{ tab: currentTab, search: '?id=' + tx.id.uuid.toString() }}
    >
      {currentTab === 'messages' ? (
        <MessageInboxItemContent
          tx={tx}
          currentUser={currentUser}
          intl={intl}
          previewMessage={previewMessage}
        />
      ) : (
        <NotificationInboxItemContent />
      )}
    </NamedLink>
  );
};

InboxItem.propTypes = {
  unitType: propTypes.bookingUnitType.isRequired,
  tx: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default InboxItem;
