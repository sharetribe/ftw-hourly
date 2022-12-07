import React from 'react';
import { NamedLink, Avatar, UserDisplayName } from '../';
import { propTypes } from '../../util/types';
import { oneOf } from 'prop-types';
import { intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import MessageInboxItemContent from './MessageInboxItemContent';
import NotificationInboxItemContent from './NotificationInboxItemContent';
import getUuid from 'uuid-by-string';

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

const InboxItem = props => {
  const { tx, intl, params, currentUser, selected, txMessages, notification } = props;

  const currentTab = params.tab;

  const classes = classNames(css.item, selected && css.selected);

  const searchParam =
    currentTab === 'messages'
      ? tx.id.uuid.toString()
      : getUuid(notification.createdAt.toUTCString());

  return (
    <NamedLink
      className={classes}
      name="InboxPage"
      params={{ tab: currentTab, search: '?id=' + searchParam }}
    >
      {currentTab === 'messages' ? (
        <MessageInboxItemContent
          tx={tx}
          currentUser={currentUser}
          intl={intl}
          txMessages={txMessages}
        />
      ) : (
        <NotificationInboxItemContent
          notification={notification}
          currentUser={currentUser}
          intl={intl}
        />
      )}
    </NamedLink>
  );
};

InboxItem.propTypes = {
  tx: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default InboxItem;
