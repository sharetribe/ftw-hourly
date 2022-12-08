import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { IconSpinner, InboxItem } from '../';
import { getCurrentTransaction } from '../../containers/InboxPage/InboxPage.helpers';
import queryString from 'query-string';

import css from './InboxSideLists.module.css';

const MessagesInboxSideList = props => {
  const {
    fetchTransactionsInProgress,
    fetchTransactionsError,
    transactions,
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

  const [replacedEmptyTxId, setReplacedEmptyTxId] = useState(false);

  useEffect(() => {
    if ((currentTxId === '' || !currentTxId) && !replacedEmptyTxId) {
      setReplacedEmptyTxId(true);
      history.replace({
        pathname: history.location.pathname,
        search: 'id='.concat(
          (transactions && transactions.length > 0 && transactions[0].id.uuid) || ''
        ),
      });
    }
  }, [currentTxId, history.location.search]);

  useEffect(() => {
    if (currentTransaction) {
      const { customer, provider } = currentTransaction;
      const otherUser =
        ensuredCurrentUser && ensuredCurrentUser.id.uuid === customer && customer.id.uuid
          ? customer
          : provider;

      if (!!otherUser) {
        onFetchOtherUserListing(otherUser.id.uuid);
      }
    }
  }, [currentTransaction]);

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
    (!fetchTransactionsInProgress && transactions.length === 0 && !fetchTransactionsError && (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noMessagesFound" />
      </li>
    )) ||
    null;

  return (
    <ul className={css.itemList}>
      {!!transactions || !fetchTransactionsInProgress ? (
        transactions.length > 0 ? (
          transactions.map(tx => {
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
