import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import queryString from 'query-string';
import getUuid from 'uuid-by-string';

import css from './InboxSideLists.module.css';

// const getCurrentNotification = (notifications, queryParams) => {
//   const notificationString = queryString.parse(queryParams).id;

//   const currentNotification = notifications.find(
//     notification => getUuid(notification.createdAt.toUTCString()) === notificationString
//   );

//   return currentNotification;
// };

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

  const currentNotificationUuid = queryString.parse(history.location.search).id;

  const noNotificationResults =
    notifications && notifications.length === 0 && !fetchCurrentUserNotificationsInProgress ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  return (
    <ul className={css.itemList}>
      {!fetchCurrentUserNotificationsInProgress ? (
        notifications && notifications.length > 0 ? (
          notifications.map(notification => {
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
