import React from 'react';
import { Avatar, UserDisplayName } from '../';
import { formatDate } from '../../util/dates';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';
import { FormattedMessage } from '../../util/reactIntl';
import {
  getUserTxRole,
  TRANSITION_CONFIRM_PAYMENT,
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  txRoleIsProvider,
} from '../../util/transaction';

import css from './InboxItem.module.css';

const resolveTransitionMessage = (transition, ownRole, otherUsersName) => {
  const isOwnTransition = transition.by === ownRole;
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
      return isOwnTransition ? (
        <FormattedMessage id="ActivityFeed.ownTransitionRequest" />
      ) : (
        <FormattedMessage id="ActivityFeed.transitionRequest" values={{ displayName }} />
      );

    default:
      log.error(new Error('Unknown transaction transition type'), 'unknown-transition-type', {
        transitionType: currentTransition,
      });
      return '';
  }
};

const NotificationInboxItemContent = props => {
  const { notification, currentUser, intl, selected } = props;

  const ownRole = getUserTxRole(currentUser.id, notification.transaction);

  const customer = notification && notification.transaction.customer;
  const provider = notification && notification.transaction.provider;

  const otherUsersName = txRoleIsProvider(ownRole) ? (
    <UserDisplayName user={customer} intl={intl} />
  ) : (
    <UserDisplayName user={provider} intl={intl} />
  );

  const previewText = resolveTransitionMessage(notification, ownRole, otherUsersName);

  const notificationViewed =
    currentUser &&
    currentUser.attributes.profile.metadata &&
    currentUser.attributes.profile.metadata.viewedNotifications;

  const rowNotificationDot = !notificationViewed ? <div className={css.notificationDot} /> : null;

  // Create loop from one to 100

  return (
    <div className={css.mainContent}>
      {previewText}
      {rowNotificationDot && <div className={css.rowNotificationDot}>{rowNotificationDot}</div>}
    </div>
  );
};

export default NotificationInboxItemContent;
