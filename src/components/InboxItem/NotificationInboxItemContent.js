import React from 'react';
import { Avatar, UserDisplayName } from '../';
import { formatDate } from '../../util/dates';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';
import { getUserTxRole } from '../../util/transaction';

import css from './InboxItem.module.css';

const NotificationInboxItemContent = props => {
  const { notification, currentUser, intl } = props;

  const ownRole = getUserTxRole(currentUser.id, notification.transaction);

  return <div className={css.mainContent}></div>;
};

export default NotificationInboxItemContent;
