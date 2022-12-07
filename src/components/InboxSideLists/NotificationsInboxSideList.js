import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import queryString from 'query-string';
import getUuid from 'uuid-by-string';
import {
  NOTIFICATION_TRANSITIONS,
  TRANSITION_CONFIRM_PAYMENT,
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  getUserTxRole,
} from '../../util/transaction';
import { CAREGIVER } from '../../util/constants';

import css from './InboxSideLists.module.css';

const sortNotificationsByTime = notifications => {
  return (
    notifications &&
    notifications.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
  );
};

// Function to sort notifications by user type
const filterNotificationsByUserType = (notifications, currentUser) => {
  const userType = currentUser && currentUser.attributes.profile.metadata.userType;

  if (userType === CAREGIVER) {
    return notifications.filter(
      notification => notification.transition === TRANSITION_CONFIRM_PAYMENT
    );
  } else {
    return notifications.filter(
      notification => notification.transition === TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY
    );
  }
};

const NotificationsInboxSideList = props => {
  const {
    fetchTransactionsInProgress,
    fetchTransactionsError,
    currentTransactions,
    intl,
    params,
    currentUser,
    history,
    currentTransaction,
    onUpdateViewedNotifications,
    updateViewedNotificationsSuccess,
    updateViewedNotificationsInProgress,
    updateViewedNotificationsError,
  } = props;

  let notifications = [];
  currentTransactions.forEach(transaction => {
    transaction.attributes.transitions.forEach(transition => {
      transition.transaction = transaction;
      const ownRole = getUserTxRole(currentUser && currentUser.id, transaction);
      if (NOTIFICATION_TRANSITIONS.includes(transition.transition) && ownRole === 'provider') {
        notifications.push(transition);
      }
    });
  });

  const handleUpdateViewedNotifications = notificationId => {
    let viewedNotifications =
      currentUser &&
      currentUser.attributes.profile.metadata &&
      currentUser.attributes.profile.metadata.viewedNotifications;

    if (!viewedNotifications) {
      viewedNotifications = [notificationId];
    } else {
      viewedNotifications.push(notificationId);
    }

    const currentUserId = currentUser && currentUser.id && currentUser.id.uuid;

    onUpdateViewedNotifications(currentUserId, viewedNotifications);
  };

  const viewedNotifications =
    (currentUser &&
      currentUser.attributes.profile.metadata &&
      currentUser.attributes.profile.metadata.viewedNotifications) ||
    [];
  const currentNotificationUuid = queryString.parse(history.location.search).id;

  if (
    currentUser &&
    !viewedNotifications.includes(currentNotificationUuid) &&
    currentNotificationUuid !== '' &&
    !updateViewedNotificationsInProgress
  ) {
    handleUpdateViewedNotifications(currentNotificationUuid);
  }

  const noNotificationResults =
    notifications && notifications.length === 0 && !fetchTransactionsInProgress ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  const filteredNotifications = filterNotificationsByUserType(notifications, currentUser);
  const sortedNotifications = sortNotificationsByTime(filteredNotifications);

  return (
    <ul className={css.itemList}>
      {!fetchTransactionsInProgress || sortedNotifications.length > 0 ? (
        sortedNotifications.length > 0 ? (
          sortedNotifications.map(notification => {
            return (
              <InboxItem
                key={getUuid(notification.createdAt.toUTCString())}
                notification={notification}
                intl={intl}
                params={params}
                currentUser={currentUser}
                selected={getUuid(notification.createdAt.toUTCString()) === currentNotificationUuid}
                currentTab="notifications"
              />
            );
          })
        ) : (
          noNotificationResults
        )
      ) : (
        <li className={css.listItemsLoading}>
          <IconSpinner />
        </li>
      )}
    </ul>
  );

  //   );
};

export default NotificationsInboxSideList;
