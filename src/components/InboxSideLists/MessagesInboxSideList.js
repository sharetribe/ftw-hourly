import React, { useEffect } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import { getCurrentTransaction } from '../../containers/InboxPage/InboxPage.helpers';
import queryString from 'query-string';

import css from './InboxSideLists.module.css';

const MessagesInboxSideList = props => {
  const {
    fetchTransactionsInProgress,
    fetchTransactionsError,
    currentTransactions,
    currentTransaction,
    messages,
    currentTxId,
    intl,
    params,
    ensuredCurrentUser,
    history,
    onSetCurrentTransaction,
    onFetchOtherUserListing,
    onUpdateViewedMessages,
    updateViewedMessagesInProgress,
    currentMessages,
  } = props;

  useEffect(() => {
    if (currentTxId === '' || !currentTxId) {
      history.replace({
        pathname: history.location.pathname,
        search: 'id='.concat(
          (currentTransactions &&
            currentTransactions.length > 0 &&
            currentTransactions[0].id.uuid) ||
            ''
        ),
      });
    }

    if (currentTransaction) {
      onSetCurrentTransaction(currentTransaction);
      const { customer, provider } = currentTransaction;
      const otherUser =
        ensuredCurrentUser && ensuredCurrentUser.id.uuid === customer && customer.id.uuid
          ? customer
          : provider;

      if (!!otherUser) {
        onFetchOtherUserListing(otherUser.id.uuid);
      }
    }
  }, [currentTxId, currentTransactions, history]);

  const handleUpdateViewedMessages = txMessages => {
    let viewedMessages = ensuredCurrentUser.attributes.profile.metadata.viewedMessages;
    const txMessageIds = txMessages.map(item => item.id.uuid);

    if (!viewedMessages) {
      viewedMessages = [{ txId: currentTxId, messageIds: txMessageIds }];
    } else if (viewedMessages.find(item => item && item.txId === currentTxId)) {
      viewedMessages.forEach((item, i) => {
        if (item.txId === currentTxId)
          viewedMessages[i] = { txId: currentTxId, messageIds: txMessageIds };
      });
    } else {
      viewedMessages.push({ txId: currentTxId, messageIds: txMessageIds });
    }

    const currentUserId = ensuredCurrentUser && ensuredCurrentUser.id && ensuredCurrentUser.id.uuid;

    onUpdateViewedMessages(currentUserId, viewedMessages);
  };

  const viewedMessages =
    (ensuredCurrentUser.attributes.profile.metadata &&
      ensuredCurrentUser.attributes.profile.metadata.viewedMessages) ||
    [];
  const currentViewedMessages = viewedMessages.find(item => item && item.txId === currentTxId);

  if (
    currentTransaction &&
    currentMessages.length >= 1 &&
    currentMessages.length !=
      (currentViewedMessages &&
        currentViewedMessages.messageIds &&
        currentViewedMessages.messageIds.length) &&
    !updateViewedMessagesInProgress
  ) {
    handleUpdateViewedMessages(currentMessages);
  }

  const noMessageResults =
    (!fetchTransactionsInProgress &&
      currentTransactions.length === 0 &&
      !fetchTransactionsError && (
        <li key="noResults" className={css.noResults}>
          <FormattedMessage id="InboxPage.noMessagesFound" />
        </li>
      )) ||
    null;

  return (
    <ul className={css.itemList}>
      {!!currentTransactions || !fetchTransactionsInProgress ? (
        currentTransactions.length > 0 ? (
          currentTransactions.map(tx => {
            const txMessages = messages.get(tx.id.uuid);
            return (
              <InboxItem
                key={tx.id.uuid}
                tx={tx}
                intl={intl}
                params={params}
                currentUser={ensuredCurrentUser}
                selected={currentTxId === tx.id.uuid}
                txMessages={txMessages}
              />
            );
          })
        ) : (
          noMessageResults
        )
      ) : (
        <li className={css.listItemsLoading}>
          <IconSpinner />
        </li>
      )}
    </ul>
  );
};

export default MessagesInboxSideList;
