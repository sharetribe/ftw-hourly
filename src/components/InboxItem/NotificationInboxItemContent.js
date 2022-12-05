import React from 'react';
import { Avatar, UserDisplayName } from '../';
import { formatDate } from '../../util/dates';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';

import css from './InboxItem.module.css';

const NotificationInboxItemContent = props => {
  const { tx, currentUser, previewMessage, intl } = props;
  return null;
};

export default NotificationInboxItemContent;
