import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import queryString from 'query-string';
import getUuid from 'uuid-by-string';
import { filterNotificationsByUserType, getNotifications } from '../../util/transaction';
import { CAREGIVER } from '../../util/constants';

import css from './InboxSideLists.module.css';
import { useEffect } from 'react';

//filter notifications by time created
const sortNotificationsByTime = notifications => {
  return notifications.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

const NotificationsInboxSideList = props => {
  const {
    fetchTransactionsInProgress,
    fetchTransactionsError,
    transactions,
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

  const notifications = getNotifications(transactions, currentUser);

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

  useEffect(() => {
    if (
      currentUser &&
      !viewedNotifications.includes(currentNotificationUuid) &&
      currentNotificationUuid !== '' &&
      !updateViewedNotificationsInProgress
    ) {
      handleUpdateViewedNotifications(currentNotificationUuid);
    }
  }, [currentNotificationUuid]);

  const noNotificationResults =
    notifications && notifications.length === 0 && !fetchTransactionsInProgress ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  const sortedNotifications = sortNotificationsByTime(notifications);

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
