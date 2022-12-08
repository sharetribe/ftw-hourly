import React from 'react';
import { Avatar, UserDisplayName } from '../';
import { formatDate } from '../../util/dates';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import getUuid from 'uuid-by-string';
import {
  getUserTxRole,
  TRANSITION_CONFIRM_PAYMENT,
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  txRoleIsProvider,
} from '../../util/transaction';

import css from './InboxItem.module.css';

const resolveTransitionMessage = (transition, otherUsersName) => {
  const currentTransition = transition.transition;
  const displayName = otherUsersName;

  switch (currentTransition) {
    case TRANSITION_CONFIRM_PAYMENT:
      return (
        <FormattedMessage
          id="NotificationInboxItemContent.notificationConfirmPayment"
          values={{ displayName }}
        />
      );
    case TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY:
      return (
        <FormattedMessage
          id="NotificationInboxItemContent.notificationRequestPayment"
          values={{ displayName }}
        />
      );

    default:
      log.error(new Error('Unknown transaction transition type'), 'unknown-transition-type', {
        transitionType: currentTransition,
      });
      return '';
  }
};

const NotificationInboxItemContent = props => {
  const { notification, currentUser, intl } = props;

  const ownRole = getUserTxRole(currentUser.id, notification.transaction);

  const customer = notification && notification.transaction.customer;
  const provider = notification && notification.transaction.provider;

  const otherUsersName = txRoleIsProvider(ownRole) ? (
    <UserDisplayName user={customer} intl={intl} />
  ) : (
    <UserDisplayName user={provider} intl={intl} />
  );

  const previewText = resolveTransitionMessage(notification, otherUsersName);

  const notificationViewed =
    currentUser &&
    currentUser.attributes.profile.metadata &&
    currentUser.attributes.profile.metadata.viewedNotifications &&
    currentUser.attributes.profile.metadata.viewedNotifications.includes(
      getUuid(notification.createdAt.toUTCString())
    );

  const rowNotificationDot = !notificationViewed ? <div className={css.notificationDot} /> : null;

  return (
    <div className={css.mainContent}>
      {previewText}
      {rowNotificationDot && <div className={css.rowNotificationDot}>{rowNotificationDot}</div>}
    </div>
  );
};

export default NotificationInboxItemContent;
