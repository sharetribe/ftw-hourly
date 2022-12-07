import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import queryString from 'query-string';

import css from './InboxSideLists.module.css';

const getCurrentNotification = (notifications, queryParams) => {
  const notificationString = queryString.parse(queryParams).id;

  const currentNotification = notifications.find(
    notification => notification.createdAt.toTimeString() === notificationString
  );

  return currentNotification;
};

const NotificationsInboxSideList = props => {
  const {
    notifications,
    fetchCurrentUserNotificationsInProgress,
    fetchCurrentUserNotificationsError,
    intl,
    params,
    currentUser,
    history,
  } = props;

  const currentNotification = notifications
    ? getCurrentNotification(notifications, history.location.search)
    : null;

  const noNotificationResults =
    notifications && notifications.length === 0 && !fetchCurrentUserNotificationsInProgress ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  return (
    <ul className={css.itemList}>
      {!fetchCurrentUserNotificationsInProgress ? (
        notifications.length > 0 ? (
          notifications.map(notification => {
            return (
              <InboxItem
                key={notification.createdAt.toTimeString()}
                notification={notification}
                intl={intl}
                params={params}
                currentUser={currentUser}
                selected={
                  currentNotification &&
                  notification.createdAt.toTimeString() ==
                    currentNotification.createdAt.toTimeString()
                }
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
