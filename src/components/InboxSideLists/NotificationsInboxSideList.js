import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import queryString from 'query-string';
import getUuid from 'uuid-by-string';
import { NOTIFICATION_TRANSITIONS, getUserTxRole } from '../../util/transaction';

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
    fetchTransactionsInProgress,
    fetchTransactionsError,
    currentTransactions,
    intl,
    params,
    currentUser,
    history,
    currentTransaction,
  } = props;

  let notifications = [];
  currentTransactions.forEach(transaction => {
    transaction.attributes.transitions.forEach(transition => {
      transition.transaction = transaction;
      const ownRole = getUserTxRole(currentUser.id, transaction);
      if (NOTIFICATION_TRANSITIONS.includes(transition.transition) && ownRole === 'provider') {
        notifications.push(transition);
      }
    });
  });

  const currentNotificationUuid = queryString.parse(history.location.search).id;

  const noNotificationResults =
    notifications && notifications.length === 0 && !fetchTransactionsInProgress ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  return (
    <ul className={css.itemList}>
      {!fetchTransactionsInProgress ? (
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
