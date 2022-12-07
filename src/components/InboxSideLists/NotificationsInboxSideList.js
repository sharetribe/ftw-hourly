import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';

const NotificationsInboxSideList = props => {
  const { currentNotifications, currentNotification } = props;

  const noNotificationResults =
    currentNotifications && currentNotifications.length === 0 ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noNotificationsFound" />
      </li>
    ) : null;

  return <ul className={css.itemList}>{noNotificationResults}</ul>;
  //   const {
  //     fetchTransactionsInProgress,
  //     fetchTransactionsError,
  //     currentTransactions,
  //     messages,
  //     intl,
  //     params,
  //     ensuredCurrentUser,
  //     currentTxId,
  //   } = props;

  //   const noMessageResults =
  //     (!fetchTransactionsInProgress &&
  //       currentTransactions.length === 0 &&
  //       !fetchTransactionsError && (
  //         <li key="noResults" className={css.noResults}>
  //           <FormattedMessage id="InboxPage.noMessagesFound" />
  //         </li>
  //       )) ||
  //     null;

  //   return (
  //     <ul className={css.itemList}>
  //       {!fetchTransactionsInProgress ? (
  //         currentTransactions.length > 0 ? (
  //           currentTransactions.map(tx => {
  //             const txMessages = messages.get(tx.id.uuid);
  //             return (
  //               <InboxItem
  //                 key={tx.id.uuid}
  //                 unitType={unitType}
  //                 tx={tx}
  //                 intl={intl}
  //                 params={params}
  //                 currentUser={ensuredCurrentUser}
  //                 selected={currentTxId === tx.id.uuid}
  //                 txMessages={txMessages}
  //               />
  //             );
  //           })
  //         ) : (
  //           noMessageResults
  //         )
  //       ) : (
  //         <li className={css.listItemsLoading}>
  //           <IconSpinner />
  //         </li>
  //       )}
  //     </ul>
  //   );
};

export default NotificationsInboxSideList;
