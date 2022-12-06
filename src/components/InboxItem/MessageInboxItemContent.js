import React from 'react';
import { Avatar, UserDisplayName } from '../';
import { formatDate } from '../../util/dates';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';

import css from './InboxItem.module.css';

const formatDateLastTransitioned = (intl, date) => {
  return {
    short: intl.formatDate(date, {
      month: 'short',
      day: 'numeric',
    }),
    long: `${intl.formatDate(date)} ${intl.formatTime(date)}`,
  };
};

const MessageInboxItemContent = props => {
  const { tx, currentUser, txMessages, intl } = props;

  const { customer, provider } = tx;
  const ensuredCurrentUser = ensureCurrentUser(currentUser);

  const otherUser = ensuredCurrentUser === provider.id.uuid ? customer : provider;
  const otherUserDisplayName = <UserDisplayName user={otherUser} intl={intl} />;
  const isOtherUserBanned = otherUser.attributes.banned;

  //   const isSaleNotification = txIsRequested(tx);
  const lastTransitionedAt = formatDateLastTransitioned(intl, tx.attributes.lastTransitionedAt);

  const previewMessage = (txMessages && txMessages.length > 0 && txMessages[0]) || null;
  const hasPreviewMessage =
    previewMessage && previewMessage.attributes && previewMessage.attributes.content;
  const previewMessageFormatted = hasPreviewMessage
    ? cutTextToPreview(previewMessage.attributes.content, 40)
    : '';
  const lastMessageTime = (hasPreviewMessage && previewMessage.attributes.createdAt) || new Date();
  const todayString = intl.formatMessage({ id: 'InboxPage.today' });
  const lastMessageTimeFormatted = formatDate(intl, todayString, lastMessageTime);

  const viewedMessages = currentUser.attributes.profile.metadata.viewedMessages;
  const txViewedMessages =
    viewedMessages && viewedMessages.find(item => item && item.txId === tx.id.uuid);

  const rowNotificationDot =
    (txViewedMessages && txViewedMessages.messageIds.length) !==
    (txMessages && txMessages.length) ? (
      <div className={css.notificationDot} />
    ) : null;

  return (
    <div className={css.mainContent}>
      <div className={css.itemAvatar}>
        {/* Should make this just require list */}
        <Avatar user={otherUser} rootClassName={css.avatarRoot} />
      </div>

      <div className={css.itemText}>
        <div className={css.itemInfo}>
          <div className={css.itemUsername}>{otherUserDisplayName}</div>
          <div className={css.itemState}>
            {rowNotificationDot && (
              <div className={css.rowNotificationDot}>{rowNotificationDot}</div>
            )}
            <div className={css.lastTransitionedAt} title={lastTransitionedAt.long}>
              {lastMessageTimeFormatted}
            </div>
          </div>
        </div>
        <div className={css.previewMessage}>{previewMessageFormatted}</div>
      </div>
    </div>
  );
};

export default MessageInboxItemContent;
