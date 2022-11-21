import React, { useEffect, useMemo } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { propTypes } from '../../util/types';
import { ensureCurrentUser, cutTextToPreview } from '../../util/data';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { changeModalValue } from '../TopbarContainer/TopbarContainer.duck';
import { fetchMoreMessages, sendMessage, clearMessages } from './InboxPage.duck';
import { PAYMENT_DETAILS } from '../../components/ModalMissingInformation/ModalMissingInformation';
import {
  NotificationBadge,
  Page,
  PaginationLinks,
  LinkTabNavHorizontal,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  IconSpinner,
  MessagePanel,
  InboxItem,
} from '../../components';
import { TopbarContainer, NotFoundPage } from '..';
import config from '../../config';

import { getCurrentTransaction } from './InboxPage.helpers';
import css from './InboxPage.module.css';

export const InboxPageComponent = props => {
  const {
    unitType,
    currentUser,
    currentUserListing,
    fetchInProgress,
    fetchOrdersOrSalesError,
    intl,
    pagination,
    params,
    providerNotificationCount,
    scrollingDisabled,
    transactions,
    onChangeMissingInfoModal,
    history,
    fetchMessagesInProgress,
    totalMessagePages,
    messages,
    oldestMessagePageFetched,
    initialMessageFailedToTransaction,
    fetchMessagesError,
    sendMessageInProgress,
    sendMessageError,
    onShowMoreMessages,
    transactionRole,
    onClearMessages,
    onSendMessage,
  } = props;
  const { tab } = params;
  const ensuredCurrentUser = ensureCurrentUser(currentUser);

  const currentTxId = queryString.parse(history.location.search).id;

  // Memoize transactionsIds so that inboxItems dont rerender on every select
  let transactionIds = '';
  transactions.forEach(transaction => {
    transactionIds = transactionIds.concat(transaction.id.uuid);
  });
  const currentTransactions = useMemo(() => {
    return transactions;
  }, [transactionIds]);

  // Show payment details modal if user doesn't have them
  useEffect(() => {
    onChangeMissingInfoModal(PAYMENT_DETAILS);
  }, []);

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
  }, [currentTxId, currentTransactions, history]);

  const validTab = tab === 'messages' || tab === 'notifications';
  if (!validTab) {
    return <NotFoundPage />;
  }

  const isMessages = tab === 'messages';

  const messagesTitle = intl.formatMessage({ id: 'InboxPage.messagesTitle' });
  const notificationsTitle = intl.formatMessage({ id: 'InboxPage.notificationsTitle' });
  const title = isMessages ? messagesTitle : notificationsTitle;

  const error = fetchOrdersOrSalesError ? (
    <p className={css.error}>
      <FormattedMessage id="InboxPage.fetchFailed" />
    </p>
  ) : null;

  // Need to make this dynamic when notifications are added
  const noResults = isMessages ? (
    !fetchInProgress && currentTransactions.length === 0 && !fetchOrdersOrSalesError ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id="InboxPage.noMessagesFound" />
      </li>
    ) : null
  ) : (
    <li key="noResults" className={css.noResults}>
      <FormattedMessage id="InboxPage.noNotificationsFound" />
    </li>
  );

  const hasTransactions =
    (currentUser.id &&
      currentTransactions &&
      currentTransactions.length > 0 &&
      currentTransactions[0].customer.id.uuid === currentUser.id.uuid) ||
    (currentUser.id &&
      currentTransactions &&
      currentTransactions.length > 0 &&
      currentTransactions[0].provider.id.uuid === currentUser.id.uuid);
  const pagingLinks =
    hasTransactions && pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="InboxPage"
        pagePathParams={params}
        pagination={pagination}
      />
    ) : null;

  const providerNotificationBadge =
    providerNotificationCount > 0 ? <NotificationBadge count={providerNotificationCount} /> : null;

  const tabs = [
    {
      text: (
        <span>
          <FormattedMessage id="InboxPage.messagesTabTitle" />
        </span>
      ),
      selected: isMessages,
      linkProps: {
        name: 'InboxPage',
        params: {
          tab: 'messages',
          // Need to find permanent solution
          search: '?id=',
        },
      },
    },
    {
      text: (
        <span>
          <FormattedMessage id="InboxPage.notificationsTabTitle" />
          {providerNotificationBadge}
        </span>
      ),
      selected: !isMessages,
      linkProps: {
        name: 'InboxPage',
        params: {
          tab: 'notifications',
          // Need to find permanent solution
          search: '?id=',
        },
      },
    },
  ];
  const nav = (
    <LinkTabNavHorizontal rootClassName={css.tabs} tabRootClassName={css.tab} tabs={tabs} />
  );

  const currentTransaction = getCurrentTransaction(currentTransactions, history.location.search);
  const initialMessageFailed = !!(
    initialMessageFailedToTransaction &&
    currentTransaction.id &&
    initialMessageFailedToTransaction.uuid === currentTransaction.id.uuid
  );

  const currentMessages = messages.get(currentTxId) || [];

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation className={css.sideNavigation}>
        <LayoutWrapperTopbar>
          <TopbarContainer
            className={css.topbar}
            mobileRootClassName={css.mobileTopbar}
            desktopClassName={css.desktopTopbar}
            currentPage="InboxPage"
          />
        </LayoutWrapperTopbar>
        <LayoutWrapperSideNav className={css.navigation}>
          <h1 className={css.title}>
            <FormattedMessage id="InboxPage.title" />
          </h1>
          {currentUserListing ? nav : <div className={css.navPlaceholder} />}
          {error}
          <ul className={css.itemList}>
            {isMessages ? (
              !fetchInProgress || currentTransactions.length > 0 ? (
                currentTransactions.map(tx => {
                  const txMessages = messages.get(tx.id.uuid);
                  const previewMessageLong =
                    (txMessages && txMessages.length > 0 && txMessages[0].attributes.content) || '';
                  const previewMessage = cutTextToPreview(previewMessageLong, 40);
                  return (
                    <InboxItem
                      key={tx.id.uuid}
                      unitType={unitType}
                      tx={tx}
                      intl={intl}
                      params={params}
                      currentUser={currentUser}
                      selected={currentTxId === tx.id.uuid}
                      previewMessage={previewMessage}
                    />
                  );
                })
              ) : (
                <li className={css.listItemsLoading}>
                  <IconSpinner />
                </li>
              )
            ) : null}
            {noResults}
          </ul>
          {pagingLinks}
        </LayoutWrapperSideNav>
        <LayoutWrapperMain className={css.wrapper}>
          {currentTxId && (
            <MessagePanel
              transaction={currentTransaction}
              currentUser={currentUser}
              fetchMessagesError={fetchMessagesError}
              fetchMessagesInProgress={fetchMessagesInProgress}
              initialMessageFailed={initialMessageFailed}
              messages={currentMessages}
              oldestMessagePageFetched={oldestMessagePageFetched}
              onShowMoreMessages={onShowMoreMessages}
              totalMessagePages={totalMessagePages}
              sendMessageInProgress={sendMessageInProgress}
              sendMessageError={sendMessageError}
              transactionRole={transactionRole}
              onSendMessage={onSendMessage}
            />
          )}
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

InboxPageComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  currentUserListing: null,
  currentUserHasOrders: null,
  fetchOrdersOrSalesError: null,
  pagination: null,
  providerNotificationCount: 0,
  sendVerificationEmailError: null,
};

InboxPageComponent.propTypes = {
  params: shape({
    tab: string.isRequired,
    id: string,
  }).isRequired,
  unitType: propTypes.bookingUnitType,
  currentUser: propTypes.currentUser,
  currentUserListing: propTypes.ownListing,
  fetchInProgress: bool.isRequired,
  fetchOrdersOrSalesError: propTypes.error,
  pagination: propTypes.pagination,
  providerNotificationCount: number,
  scrollingDisabled: bool.isRequired,
  transactions: arrayOf(propTypes.transaction).isRequired,

  /* from withRouter */
  history: shape({
    push: func.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    fetchMessagesInProgress,
    totalMessagePages,
    messages,
    oldestMessagePageFetched,
    initialMessageFailedToTransaction,
    fetchMessagesError,
    sendMessageInProgress,
    sendMessageError,
    transactionRefs,
  } = state.InboxPage;
  const {
    currentUser,
    currentUserListing,
    currentUserNotificationCount: providerNotificationCount,
  } = state.user;
  return {
    currentUser,
    currentUserListing,
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    providerNotificationCount,
    scrollingDisabled: isScrollingDisabled(state),
    transactions: getMarketplaceEntities(state, transactionRefs),
    fetchMessagesInProgress,
    totalMessagePages,
    messages,
    oldestMessagePageFetched,
    initialMessageFailedToTransaction,
    fetchMessagesError,
    sendMessageInProgress,
    sendMessageError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChangeMissingInfoModal: value => dispatch(changeModalValue(value)),
  onShowMoreMessages: txId => dispatch(fetchMoreMessages(txId)),
  onSendMessage: (txId, message) => dispatch(sendMessage(txId, message)),
  onClearMessages: () => dispatch(clearMessages()),
});

const InboxPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(InboxPageComponent);

export default InboxPage;
