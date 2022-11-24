import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import { storableError } from '../../util/errors';
import { parse } from '../../util/urlHelpers';
import { TRANSITIONS } from '../../util/transaction';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { denormalisedResponseEntities } from '../../util/data';
import { types as sdkTypes } from '../../util/sdkLoader';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

const MESSAGES_PAGE_SIZE = 10;
const { UUID } = sdkTypes;

const sortedTransactions = txs =>
  reverse(
    sortBy(txs, tx => {
      return tx.attributes ? tx.attributes.lastTransitionedAt : null;
    })
  );

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/InboxPage/SET_INITIAL_VALUES';

export const FETCH_ORDERS_OR_SALES_REQUEST = 'app/InboxPage/FETCH_ORDERS_OR_SALES_REQUEST';
export const FETCH_ORDERS_OR_SALES_SUCCESS = 'app/InboxPage/FETCH_ORDERS_OR_SALES_SUCCESS';
export const FETCH_ORDERS_OR_SALES_ERROR = 'app/InboxPage/FETCH_ORDERS_OR_SALES_ERROR';

export const FETCH_MESSAGES_REQUEST = 'app/InboxPage/FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'app/InboxPage/FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_ERROR = 'app/InboxPage/FETCH_MESSAGES_ERROR';

export const FETCH_LAST_MESSAGES_REQUEST = 'app/InboxPage/FETCH_LAST_MESSAGES_REQUEST';
export const FETCH_LAST_MESSAGES_SUCCESS = 'app/InboxPage/FETCH_LAST_MESSAGES_SUCCESS';
export const FETCH_LAST_MESSAGES_ERROR = 'app/InboxPage/FETCH_LAST_MESSAGES_ERROR';

export const SEND_MESSAGE_REQUEST = 'app/InboxPage/SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'app/InboxPage/SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_ERROR = 'app/InboxPage/SEND_MESSAGE_ERROR';

export const FETCH_OTHER_USER_LISTING_REQUEST = 'app/InboxPage/FETCH_OTHER_USER_LISTING_REQUEST';
export const FETCH_OTHER_USER_LISTING_SUCCESS = 'app/InboxPage/FETCH_OTHER_USER_LISTING_SUCCESS';
export const FETCH_OTHER_USER_LISTING_ERROR = 'app/InboxPage/FETCH_OTHER_USER_LISTING_ERROR';

export const CLEAR_MESSAGES_SUCCESS = 'app/InboxPage/CLEAR_MESSAGES_SUCCESS';

// ================ Reducer ================ //

const entityRefs = entities =>
  entities.map(entity => ({
    id: entity.id,
    type: entity.type,
  }));

const initialState = {
  fetchInProgress: false,
  fetchOrdersOrSalesError: null,
  pagination: null,
  transactionRefs: [],
  fetchMessagesInProgress: false,
  fetchMessagesError: null,
  totalMessages: new Map(),
  totalMessagePages: new Map(),
  oldestMessagePageFetched: new Map(),
  messages: new Map(),
  initialMessageFailedToTransaction: null,
  sendMessageInProgress: false,
  sendMessageError: null,
  otherUserListing: null,
  fetchOtherUserListingInProgress: false,
  fetchOtherUserListingError: false,
};

const mergeEntityArrays = (a, b) => {
  return a.filter(aEntity => !b.find(bEntity => aEntity.id.uuid === bEntity.id.uuid)).concat(b);
};

export default function checkoutPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_ORDERS_OR_SALES_REQUEST:
      return { ...state, fetchInProgress: true, fetchOrdersOrSalesError: null };
    case FETCH_ORDERS_OR_SALES_SUCCESS: {
      const transactions = sortedTransactions(payload.data.data);
      return {
        ...state,
        fetchInProgress: false,
        transactionRefs: entityRefs(transactions),
        pagination: payload.data.meta,
      };
    }
    case FETCH_ORDERS_OR_SALES_ERROR:
      console.error(payload); // eslint-disable-line
      return { ...state, fetchInProgress: false, fetchOrdersOrSalesError: payload };

    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };
    case FETCH_MESSAGES_REQUEST:
      return { ...state, fetchMessagesInProgress: true, fetchMessagesError: null };
    case FETCH_MESSAGES_SUCCESS: {
      const oldestMessagePageFetched =
        state.oldestMessagePageFetched.get(payload.txId) > payload.page
          ? state.oldestMessagePageFetched.get(payload.txId)
          : payload.page;
      const oldestMessagePageFetchedMap = state.oldestMessagePageFetched;
      oldestMessagePageFetchedMap.set(payload.txId, oldestMessagePageFetched);

      const oldMessages = state.messages;
      const currentTransactionMessages = oldMessages.get(payload.txId) || [];
      oldMessages.set(
        payload.txId,
        mergeEntityArrays(currentTransactionMessages, payload.messages)
      );

      const oldTotalPagesMap = state.totalMessagePages;
      oldTotalPagesMap.set(payload.txId, payload.totalPages);

      const oldTotalMessagesMap = state.totalMessages;
      oldTotalMessagesMap.set(payload.txId, payload.totalItems);

      return {
        ...state,
        fetchMessagesInProgress: false,
        messages: oldMessages,
        totalMessages: oldTotalMessagesMap,
        totalMessagePages: oldTotalPagesMap,
        oldestMessagePageFetchedMap,
      };
    }
    case FETCH_MESSAGES_ERROR:
      return { ...state, fetchMessagesInProgress: false, fetchMessagesError: payload };
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        sendMessageInProgress: true,
        sendMessageError: null,
        initialMessageFailedToTransaction: null,
      };
    case SEND_MESSAGE_SUCCESS:
      return { ...state, sendMessageInProgress: false };
    case SEND_MESSAGE_ERROR:
      return { ...state, sendMessageInProgress: false, sendMessageError: payload };
    case CLEAR_MESSAGES_SUCCESS:
      return { ...state, messages: [] };
    case FETCH_OTHER_USER_LISTING_REQUEST:
      return { ...state, fetchOtherUserListingInProgress: true, fetchOtherUserListingError: false };
    case FETCH_OTHER_USER_LISTING_SUCCESS:
      return {
        ...state,
        otherUserListing: payload,
        fetchOtherUserListingInProgress: false,
      };
    case FETCH_OTHER_USER_LISTING_ERROR:
      return {
        ...state,
        fetchOtherUserListingProgress: false,
        fetchOtherUserListingError: payload,
      };
    default:
      return state;
  }
}

// ================ Action creators ================ //

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

const fetchOrdersOrSalesRequest = () => ({ type: FETCH_ORDERS_OR_SALES_REQUEST });
const fetchOrdersOrSalesSuccess = response => ({
  type: FETCH_ORDERS_OR_SALES_SUCCESS,
  payload: response,
});
const fetchOrdersOrSalesError = e => ({
  type: FETCH_ORDERS_OR_SALES_ERROR,
  error: true,
  payload: e,
});
const fetchMessagesRequest = () => ({ type: FETCH_MESSAGES_REQUEST });
const fetchMessagesSuccess = (txId, messages, pagination) => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: { txId, messages, ...pagination },
});
const fetchMessagesError = e => ({ type: FETCH_MESSAGES_ERROR, error: true, payload: e });

const sendMessageRequest = () => ({ type: SEND_MESSAGE_REQUEST });
const sendMessageSuccess = () => ({ type: SEND_MESSAGE_SUCCESS });
const sendMessageError = e => ({ type: SEND_MESSAGE_ERROR, error: true, payload: e });

const clearMessagesSuccess = () => ({ type: CLEAR_MESSAGES_SUCCESS });

const fetchOtherUserListingRequest = () => ({ type: FETCH_OTHER_USER_LISTING_REQUEST });
const fetchOtherUserListingSuccess = response => ({
  type: FETCH_OTHER_USER_LISTING_SUCCESS,
  payload: response[0],
});
const fetchOtherUserListingError = e => ({
  type: FETCH_OTHER_USER_LISTING_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

const INBOX_PAGE_SIZE = 10;

const fetchMessages = (txId, page) => (dispatch, getState, sdk) => {
  const paging = { page, per_page: MESSAGES_PAGE_SIZE };
  dispatch(fetchMessagesRequest());
  return txId.uuid !== ''
    ? sdk.messages
        .query({
          transaction_id: txId,
          include: ['sender', 'sender.profileImage'],
          ...IMAGE_VARIANTS,
          ...paging,
        })
        .then(response => {
          const messages = denormalisedResponseEntities(response);
          const { totalItems, totalPages, page: fetchedPage } = response.data.meta;
          const pagination = { totalItems, totalPages, page: fetchedPage };
          const totalMessages = getState().InboxPage.totalMessages.get(txId.uuid);

          // Original fetchMessages call succeeded
          dispatch(fetchMessagesSuccess(txId.uuid, messages, pagination));

          // Check if totalItems has changed between fetched pagination pages
          // if totalItems has changed, fetch first page again to include new incoming messages.
          // TODO if there're more than 100 incoming messages,
          // this should loop through most recent pages instead of fetching just the first one.
          if (totalItems > totalMessages && page > 1) {
            dispatch(fetchMessages(txId, 1))
              .then(() => {
                // Original fetch was enough as a response for user action,
                // this just includes new incoming messages
              })
              .catch(() => {
                // Background update, no need to to do anything atm.
              });
          }
        })
        .catch(e => {
          dispatch(fetchMessagesError(storableError(e)));
          throw e;
        })
    : null;
};

export const fetchMoreMessages = txId => (dispatch, getState, sdk) => {
  const state = getState();
  const { oldestMessagePageFetched, totalMessagePages } = state.InboxPage;
  const hasMoreOldMessages =
    totalMessagePages.get(txId.uuid) > oldestMessagePageFetched.get(txId.uuid);

  // In case there're no more old pages left we default to fetching the current cursor position
  const nextPage = hasMoreOldMessages
    ? oldestMessagePageFetched.get(txId.uuid) + 1
    : oldestMessagePageFetched.get(txId.uuid);

  return dispatch(fetchMessages(txId, nextPage));
};

export const sendMessage = (txId, message) => (dispatch, getState, sdk) => {
  dispatch(sendMessageRequest());

  return sdk.messages
    .send({ transactionId: txId, content: message })
    .then(response => {
      const messageId = response.data.data.id;

      // We fetch the first page again to add sent message to the page data
      // and update possible incoming messages too.
      // TODO if there're more than 100 incoming messages,
      // this should loop through most recent pages instead of fetching just the first one.
      return dispatch(fetchMessages(txId, 1))
        .then(() => {
          dispatch(sendMessageSuccess());
          return messageId;
        })
        .catch(() => dispatch(sendMessageSuccess()));
    })
    .catch(e => {
      dispatch(sendMessageError(storableError(e)));
      // Rethrow so the page can track whether the sending failed, and
      // keep the message in the form for a retry.
      throw e;
    });
};

export const clearMessages = () => (dispatch, getState, sdk) => {
  dispatch(clearMessagesSuccess());
};

export const fetchOtherUserListing = userId => (dispatch, getState, sdk) => {
  dispatch(fetchOtherUserListingRequest());

  return sdk.listings
    .query({ authorId: userId })
    .then(response => {
      dispatch(fetchOtherUserListingSuccess(response.data.data));
    })
    .catch(e => {
      dispatch(fetchOtherUserListingError(e));
      throw e;
    });
};

const IMAGE_VARIANTS = {
  'fields.image': [
    // Profile images
    'variants.square-small',
    'variants.square-small2x',

    // Listing images:
    'variants.landscape-crop',
    'variants.landscape-crop2x',
  ],
};

const isNonEmpty = value => {
  return typeof value === 'object' || Array.isArray(value) ? !isEmpty(value) : !!value;
};

export const loadData = (params, search) => (dispatch, getState, sdk) => {
  const txId = new UUID(queryString.parse(search).id);
  const state = getState().InboxPage;
  let txRef = null;
  txRef = state.transactionRefs.find(ref => ref.id === txId);

  const initialValues = txRef ? {} : pickBy(state, isNonEmpty);
  dispatch(setInitialValues(initialValues));

  dispatch(fetchOrdersOrSalesRequest());

  const { page = 1 } = parse(search);

  const apiQueryParams = {
    lastTransitions: TRANSITIONS,
    include: ['provider', 'provider.profileImage', 'customer', 'customer.profileImage', 'listing'],
    'fields.transaction': [
      'lastTransition',
      'lastTransitionedAt',
      'transitions',
      'payinTotal',
      'payoutTotal',
    ],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': ['variants.square-small', 'variants.square-small2x'],
    page,
    per_page: INBOX_PAGE_SIZE,
  };

  return sdk.transactions
    .query(apiQueryParams)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(fetchOrdersOrSalesSuccess(response));
      return response;
    })
    .then(response => {
      response.data.data.forEach(transaction => {
        dispatch(fetchMessages(transaction.id, 1));
      });
    })
    .catch(e => {
      console.log(e);
      dispatch(fetchOrdersOrSalesError(storableError(e)));
      throw e;
    });
};
