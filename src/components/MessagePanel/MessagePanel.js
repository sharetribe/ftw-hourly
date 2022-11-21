import React, { useMemo } from 'react';
import FeedSection from '../TransactionPanel/FeedSection';
import { SendMessageForm } from '../../forms';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { isMobileSafari } from '../../util/userAgent';
import {
  ensureListing,
  ensureTransaction,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { UserMessagePreview } from '../';

import css from './MessagePanel.module.css';
const MessagePanelComponent = props => {
  const {
    intl,
    transaction,
    currentUser,
    fetchMessagesError,
    fetchMessagesInProgress,
    initialMessageFailed,
    messages,
    oldestMessagePageFetched,
    onShowMoreMessages,
    totalMessagePages,
    sendMessageInProgress,
    sendMessageError,
    onSendMessage,
    otherUserListing,
  } = props;

  //   const [isMobSaf, setIsMobSaf] = useState(false);

  //Still need to implement this
  //   useEffect(() => {
  //     setIsMobSaf(isMobileSafari());
  //   }, []);

  const currentTransaction = ensureTransaction(transaction);

  const oldestMessagePageFetchedValue = oldestMessagePageFetched.get(
    currentTransaction.id && currentTransaction.id.uuid
  );
  const totalMessagePagesValue = totalMessagePages.get(
    currentTransaction.id && currentTransaction.id.uuid
  );

  // May be better to use id as comparator here
  const currentUserDisplayNameString = userDisplayNameAsString(currentUser, '');
  const { customer, provider, listing } = currentTransaction;
  const providerDisplayNameString = userDisplayNameAsString(provider, '');
  //May need to check for edge case in which both display names empty
  const otherUser =
    currentUserDisplayNameString === providerDisplayNameString
      ? customer && customer
      : provider && provider;
  const otherUserDisplayNameString = userDisplayNameAsString(otherUser, '');

  const currentListing = ensureListing(currentTransaction.listing);
  const currentProvider = ensureUser(currentTransaction.provider);
  const currentCustomer = ensureUser(currentTransaction.customer);
  // const isCustomer = transactionRole === CUSTOMER;
  // const isProvider = transactionRole === PROVIDER;

  const listingLoaded = !!currentListing.id;
  const listingDeleted = listingLoaded && currentListing.attributes.deleted;
  const iscustomerLoaded = !!currentCustomer.id;
  const isCustomerBanned = iscustomerLoaded && currentCustomer.attributes.banned;
  const isCustomerDeleted = iscustomerLoaded && currentCustomer.attributes.deleted;
  const isProviderLoaded = !!currentProvider.id;
  const isProviderBanned = isProviderLoaded && currentProvider.attributes.banned;
  const isProviderDeleted = isProviderLoaded && currentProvider.attributes.deleted;

  const showSendMessageForm =
    !isCustomerBanned && !isCustomerDeleted && !isProviderBanned && !isProviderDeleted;

  const formId = 'MessagePanel.SendMessageFormId';
  const sendMessagePlaceholder = intl.formatMessage(
    { id: 'MessagePanel.sendMessagePlaceholder' },
    { name: otherUserDisplayNameString }
  );
  const sendingMessageNotAllowed = intl.formatMessage({
    id: 'MessagePanel.sendingMessageNotAllowed',
  });

  //   const onSendMessageFormFocus = () => {
  //     this.setState({ sendMessageFormFocused: true });
  //     if (this.isMobSaf) {
  //       // Scroll to bottom
  //       window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
  //     }
  //   }

  const onMessageSubmit = (values, form) => {
    const message = values.message ? values.message.trim() : null;

    if (!message) {
      return;
    }
    onSendMessage(currentTransaction.id, message)
      .then(messageId => {
        form.reset();
      })
      .catch(e => {
        // Ignore, Redux handles the error
      });
  };

  return (
    <div className={css.root}>
      <UserMessagePreview
        otherUser={otherUser}
        otherUserListing={otherUserListing}
        currentTransaction={currentTransaction}
      />
      <FeedSection
        rootClassName={css.feedContainer}
        currentTransaction={currentTransaction}
        currentUser={currentUser}
        fetchMessagesError={fetchMessagesError}
        fetchMessagesInProgress={fetchMessagesInProgress}
        initialMessageFailed={initialMessageFailed}
        messages={messages}
        oldestMessagePageFetched={oldestMessagePageFetchedValue}
        // May need to create actual function here later
        onOpenReviewModal={() => console.log('Review Modal opened')}
        onShowMoreMessages={() => onShowMoreMessages(currentTransaction.id)}
        totalMessagePages={totalMessagePagesValue}
      />
      {showSendMessageForm ? (
        <SendMessageForm
          formId={formId}
          rootClassName={css.sendMessageForm}
          messagePlaceholder={sendMessagePlaceholder}
          inProgress={sendMessageInProgress}
          sendMessageError={sendMessageError}
          // Is this dead code or are functions needed?
          onFocus={() => console.log('send message form focused')}
          onBlur={() => console.log('send message form blurred')}
          onSubmit={onMessageSubmit}
        />
      ) : (
        <div className={css.sendingMessageNotAllowed}>{sendingMessageNotAllowed}</div>
      )}
    </div>
  );
};

const MessagePanel = injectIntl(MessagePanelComponent);

export default MessagePanel;
