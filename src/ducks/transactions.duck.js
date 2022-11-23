import pick from 'lodash/pick';
import { storableError } from '../util/errors';
import * as log from '../util/log';
import { types as sdkTypes } from '../util/sdkLoader';
const { UUID } = sdkTypes;

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/transactions/SET_INITIAL_VALUES';

export const FETCH_CURRENT_USER_TRANSACTIONS_REQUEST =
  'app/transactions/FETCH_CURRENT_USER_TRANSACTIONS_REQUEST';
export const FETCH_CURRENT_USER_TRANSACTIONS_SUCCESS =
  'app/transactions/FETCH_CURRENT_USER_TRANSACTIONS_SUCCESS';
export const FETCH_CURRENT_USER_TRANSACTIONS_ERROR =
  'app/transactions/FETCH_CURRENT_USER_TRANSACTIONS_ERROR';

export const FETCH_TRANSACTION_REQUEST = 'app/transactions/FETCH_TRANSACTION_REQUEST';
export const FETCH_TRANSACTION_SUCCESS = 'app/transactions/FETCH_TRANSACTION_SUCCESS';
export const FETCH_TRANSACTION_ERROR = 'app/transactions/FETCH_TRANSACTION_ERROR';

export const SET_CURRENT_TRANSACTION = 'app/transactions/SET_CURRENT_TRANSACTION';

// ================ Reducer ================ //

const initialState = {
  fetchCurrentUserTransactionsInProgress: false,
  fetchCurrentUserTransactionsError: false,
  currentUserTransactions: [],
  fetchTransactionInProgress: false,
  fetchTransactionError: false,
  currentTransaction: null,
};

export default function payoutMethodsPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };
    case FETCH_CURRENT_USER_TRANSACTIONS_REQUEST:
      return { ...state, fetchCurrentUserTransactionsInProgress: true };
    case FETCH_CURRENT_USER_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        fetchCurrentUserTransactionInProgress: false,
        currentUserTransactions: payload,
      };
    case FETCH_CURRENT_USER_TRANSACTIONS_ERROR:
      console.error(payload);
      return {
        ...state,
        fetchCurrentUserTransactionsError: payload,
        fetchCurrentUserTransactionsInProgress: false,
      };
    case FETCH_TRANSACTION_REQUEST:
      return { ...state, fetchTransactionInProgress: true };
    case FETCH_TRANSACTION_SUCCESS:
      return {
        ...state,
        fetchTransactionInProgress: false,
        currentTransaction: payload,
      };
    case FETCH_TRANSACTION_ERROR:
      console.error(payload);
      return {
        ...state,
        fetchTransactionError: payload,
        fetchTransactionInProgress: false,
      };
    case SET_CURRENT_TRANSACTION:
      return {
        ...state,
        currentTransaction: payload,
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

export const fetchCurrentUserTransactionsRequest = () => ({
  type: FETCH_CURRENT_USER_TRANSACTIONS_REQUEST,
});

export const fetchCurrentUserTransactionsSuccess = transactions => ({
  type: FETCH_CURRENT_USER_TRANSACTIONS_SUCCESS,
  payload: transactions,
});

export const fetchCurrentUserTransactionsError = e => ({
  type: FETCH_CURRENT_USER_TRANSACTIONS_ERROR,
  payload: e,
  error: true,
});

export const fetchTransactionRequest = () => ({
  type: FETCH_TRANSACTION_REQUEST,
});

export const fetchTransactionSuccess = transaction => ({
  type: FETCH_TRANSACTION_SUCCESS,
  payload: transaction,
});

export const fetchTransactionError = e => ({
  type: FETCH_TRANSACTION_ERROR,
  payload: e,
  error: true,
});

export const setCurrentTransaction = transaction => ({
  type: SET_CURRENT_TRANSACTION,
  payload: transaction,
});

// ================ Thunks ================ //

export const fetchCurrentUserTransactions = () => (dispatch, getState, sdk) => {
  dispatch(fetchCurrentUserTransactionsRequest());
  return sdk.transactions
    .query({
      lastTransitions: [
        'transition/enquire',
        'transition/request-payment',
        'transition/request-payment-after-enquiry',
        'transition/accept',
      ],
    })
    .then(response => {
      const transactions = response.data.data;
      dispatch(fetchCurrentUserTransactionsSuccess(transactions));
      return transactions;
    })
    .catch(e => {
      log.error(storableError(e), 'fetch-current-user-transactions-failed');
      dispatch(fetchCurrentUserTransactionsError(storableError(e)));
    });
};

export const fetchTransaction = txId => (dispatch, getState, sdk) => {
  dispatch(fetchTransactionRequest());
  return sdk.transactions
    .show({
      id: new UUID(txId),
    })
    .then(response => {
      const transaction = response.data.data;
      dispatch(fetchTransactionSuccess(transaction));
      return transaction;
    })
    .catch(e => {
      log.error(storableError(e), 'fetch-transaction-failed');
      dispatch(fetchTransactionError(storableError(e)));
    });
};
