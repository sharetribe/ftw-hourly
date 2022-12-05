import pick from 'lodash/pick';
import {
  stripeCreatePaymentIntent,
  fetchHasStripeAccount,
  stripePaymentMethods,
  stripeDetachPaymentMethod,
  stripeUpdatePaymentIntent,
} from '../../util/api';
import { storableError } from '../../util/errors';
import * as log from '../../util/log';
import { fetchCurrentUser } from '../../ducks/user.duck';
// import { stripe } from '~/src/ducks';

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/StripePaymentModal/SET_INITIAL_VALUES';

export const CONFIRM_PAYMENT_REQUEST = 'app/StripePaymentModal/CONFIRM_PAYMENT_REQUEST';
export const CONFIRM_PAYMENT_SUCCESS = 'app/StripePaymentModal/CONFIRM_PAYMENT_SUCCESS';
export const CONFIRM_PAYMENT_ERROR = 'app/StripePaymentModal/CONFIRM_PAYMENT_ERROR';

export const STRIPE_CUSTOMER_REQUEST = 'app/StripePaymentModal/STRIPE_CUSTOMER_REQUEST';
export const STRIPE_CUSTOMER_SUCCESS = 'app/StripePaymentModal/STRIPE_CUSTOMER_SUCCESS';
export const STRIPE_CUSTOMER_ERROR = 'app/StripePaymentModal/STRIPE_CUSTOMER_ERROR';

export const CREATE_PAYMENT_INTENT_REQUEST = 'app/StripePaymentModal/CREATE_PAYMENT_INTENT_REQUEST';
export const CREATE_PAYMENT_INTENT_SUCCESS = 'app/StripePaymentModal/CREATE_PAYMENT_INTENT_SUCCESS';
export const CREATE_PAYMENT_INTENT_ERROR = 'app/StripePaymentModal/CREATE_PAYMENT_INTENT_ERROR';

export const HAS_STRIPE_ACCOUNT_REQUEST = 'app/StripePaymentModal/HAS_STRIPE_ACCOUNT_REQUEST';
export const HAS_STRIPE_ACCOUNT_SUCCESS = 'app/StripePaymentModal/HAS_STRIPE_ACCOUNT_SUCCESS';
export const HAS_STRIPE_ACCOUNT_ERROR = 'app/StripePaymentModal/HAS_STRIPE_ACCOUNT_ERROR';

export const FETCH_SAVED_PAYMENT_METHODS_REQUEST =
  'app/StripePaymentModal/FETCH_SAVED_PAYMENT_METHODS_REQUEST';
export const FETCH_SAVED_PAYMENT_METHODS_SUCCESS =
  'app/StripePaymentModal/FETCH_SAVED_PAYMENT_METHODS_SUCCESS';
export const FETCH_SAVED_PAYMENT_METHODS_ERROR =
  'app/StripePaymentModal/FETCH_SAVED_PAYMENT_METHODS_ERROR';

export const SAVE_DEFAULT_PAYMENT_REQUEST = 'app/StripePaymentModal/SAVE_DEFAULT_PAYMENT_REQUEST';
export const SAVE_DEFAULT_PAYMENT_SUCCESS = 'app/StripePaymentModal/SAVE_DEFAULT_PAYMENT_SUCCESS';
export const SAVE_DEFAULT_PAYMENT_ERROR = 'app/StripePaymentModal/SAVE_DEFAULT_PAYMENT_ERROR';

export const FETCH_DEFAULT_PAYMENT_REQUEST = 'app/StripePaymentModal/FETCH_DEFAULT_PAYMENT_REQUEST';
export const FETCH_DEFAULT_PAYMENT_SUCCESS = 'app/StripePaymentModal/FETCH_DEFAULT_PAYMENT_SUCCESS';
export const FETCH_DEFAULT_PAYMENT_ERROR = 'app/StripePaymentModal/FETCH_DEFAULT_PAYMENT_ERROR';

// ================ Reducer ================ //

export const initialState = {
  listing: null,
  transaction: null,
  provider: null,
  confirmPaymentInProgress: false,
  confirmPaymentError: null,
  confirmPaymentSuccess: false,
  stripeCustomerFetched: false,
  createPaymentIntentInProgress: false,
  createPaymentIntentError: null,
  paymentIntent: null,
  hasStripeAccountInProgress: false,
  hasStripeAccountError: null,
  hasStripeAccount: false,
  hasStripeAccountFetched: false,
  fetchDefaultPaymentInProgress: false,
  fetchDefaultPaymentError: null,
  defaultPayment: null,
  defaultPaymentFetched: false,
};

export default function StripePaymentModalReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };

    case CONFIRM_PAYMENT_REQUEST:
      return { ...state, confirmPaymentInProgress: true, confirmPaymentError: null };
    case CONFIRM_PAYMENT_SUCCESS:
      return { state, confirmPaymentInProgress: false, confirmPaymentSuccess: true };
    case CONFIRM_PAYMENT_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, confirmPaymentInProgress: false, confirmPaymentError: payload };

    case STRIPE_CUSTOMER_REQUEST:
      return { ...state, stripeCustomerFetched: false };
    case STRIPE_CUSTOMER_SUCCESS:
      return { ...state, stripeCustomerFetched: true };
    case STRIPE_CUSTOMER_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, stripeCustomerFetchError: payload };

    case CREATE_PAYMENT_INTENT_REQUEST:
      return { ...state, createPaymentIntentInProgress: true, createPaymentIntentError: null };
    case CREATE_PAYMENT_INTENT_SUCCESS:
      return { ...state, createPaymentIntentInProgress: false, paymentIntent: payload };
    case CREATE_PAYMENT_INTENT_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, createPaymentIntentInProgress: false, createPaymentIntentError: payload };

    case HAS_STRIPE_ACCOUNT_REQUEST:
      return { ...state, hasStripeAccountInProgress: true };
    case HAS_STRIPE_ACCOUNT_SUCCESS:
      return {
        ...state,
        hasStripeAccountInProgress: false,
        hasStripeAccountFetched: true,
        hasStripeAccount: payload,
      };
    case HAS_STRIPE_ACCOUNT_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, hasStripeAccountInProgress: false, hasStripeAccountError: payload };

    case SAVE_DEFAULT_PAYMENT_REQUEST:
      return { ...state, saveDefaultPaymentInProgress: true, saveDefaultPaymentError: null };
    case SAVE_DEFAULT_PAYMENT_SUCCESS:
      return {
        ...state,
        saveDefaultPaymentInProgress: false,
        saveDefaultPaymentSuccess: true,
      };
    case SAVE_DEFAULT_PAYMENT_ERROR:
      return { ...state, saveDefaultPaymentInProgress: false, saveDefaultPaymentError: payload };

    case FETCH_DEFAULT_PAYMENT_REQUEST:
      return { ...state, fetchDefaultPaymentInProgress: true, fetchDefaultPaymentError: null };
    case FETCH_DEFAULT_PAYMENT_SUCCESS:
      return {
        ...state,
        fetchDefaultPaymentInProgress: false,
        defaultPayment: payload,
        defaultPaymentFetched: true,
      };
    case FETCH_DEFAULT_PAYMENT_ERROR:
      return {
        ...state,
        fetchDefaultPaymentInProgress: false,
        fetchDefaultPaymentError: payload,
        defaultPaymentFetched: true,
      };

    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

const confirmPaymentRequest = () => ({ type: CONFIRM_PAYMENT_REQUEST });
const confirmPaymentSuccess = () => ({
  type: CONFIRM_PAYMENT_SUCCESS,
});
const confirmPaymentError = e => ({
  type: CONFIRM_PAYMENT_ERROR,
  error: true,
  payload: e,
});

export const stripeCustomerRequest = () => ({ type: STRIPE_CUSTOMER_REQUEST });
export const stripeCustomerSuccess = () => ({ type: STRIPE_CUSTOMER_SUCCESS });
export const stripeCustomerError = e => ({
  type: STRIPE_CUSTOMER_ERROR,
  error: true,
  payload: e,
});

export const createPaymentIntentRequest = () => ({ type: CREATE_PAYMENT_INTENT_REQUEST });
export const createPaymentIntentSuccess = paymentIntent => ({
  type: CREATE_PAYMENT_INTENT_SUCCESS,
  payload: paymentIntent,
});
export const createPaymentIntentError = e => ({
  type: CREATE_PAYMENT_INTENT_ERROR,
  error: true,
  payload: e,
});

export const hasStripeAccountRequest = () => ({ type: HAS_STRIPE_ACCOUNT_REQUEST });
export const hasStripeAccountSuccess = hasStripeAccount => ({
  type: HAS_STRIPE_ACCOUNT_SUCCESS,
  payload: hasStripeAccount,
});
export const hasStripeAccountError = e => ({
  type: HAS_STRIPE_ACCOUNT_ERROR,
  error: true,
  payload: e,
});

export const saveDefaultPaymentRequest = () => ({ type: SAVE_DEFAULT_PAYMENT_REQUEST });
export const saveDefaultPaymentSuccess = () => ({
  type: SAVE_DEFAULT_PAYMENT_SUCCESS,
});
export const saveDefaultPaymentError = e => ({
  type: SAVE_DEFAULT_PAYMENT_ERROR,
  error: true,
  payload: e,
});

export const fetchDefaultPaymentRequest = () => ({ type: FETCH_DEFAULT_PAYMENT_REQUEST });
export const fetchDefaultPaymentSuccess = defaultPayment => ({
  type: FETCH_DEFAULT_PAYMENT_SUCCESS,
  payload: defaultPayment,
});
export const fetchDefaultPaymentError = e => ({
  type: FETCH_DEFAULT_PAYMENT_ERROR,
  error: true,
  payload: e,
});

export const sendMessage = params => (dispatch, getState, sdk) => {
  const message = params.message;
  const orderId = params.id;

  if (message) {
    return sdk.messages
      .send({ transactionId: orderId, content: message })
      .then(() => {
        return { orderId, messageSuccess: true };
      })
      .catch(e => {
        log.error(e, 'initial-message-send-failed', { txId: orderId });
        return { orderId, messageSuccess: false };
      });
  } else {
    return Promise.resolve({ orderId, messageSuccess: true });
  }
};

// StripeCustomer is a relantionship to currentUser
// We need to fetch currentUser with correct params to include relationship
export const stripeCustomer = () => (dispatch, getState, sdk) => {
  dispatch(stripeCustomerRequest());

  return dispatch(fetchCurrentUser({ include: ['stripeCustomer.defaultPaymentMethod'] }))
    .then(response => {
      dispatch(stripeCustomerSuccess());
    })
    .catch(e => {
      dispatch(stripeCustomerError(storableError(e)));
    });
};

export const createPaymentIntent = (amount, userId, stripeCustomerId, savePayment) => (
  dispatch,
  getState,
  sdk
) => {
  dispatch(createPaymentIntentRequest());

  const handleSuccess = response => {
    dispatch(createPaymentIntentSuccess(response));
    return response;
  };

  const handleError = e => {
    dispatch(createPaymentIntentError(e));
    log.error(e, 'create-payment-intent-Failed', {});
    throw e;
  };

  return stripeCreatePaymentIntent({ amount, userId, stripeCustomerId, savePayment })
    .then(res => handleSuccess(res))
    .catch(e => handleError(e));
};

export const confirmPayment = (
  stripe,
  elements,
  saveCardAsDefault,
  defaultCardId,
  paymentIntentId,
  useDefaultCard
) => (dispatch, getState, sdk) => {
  dispatch(confirmPaymentRequest());

  const handleSuccess = response => {
    dispatch(confirmPaymentSuccess(response));
    return response;
  };

  const handleError = e => {
    dispatch(confirmPaymentError(e));
    log.error(e, 'Confirm-Payment-Failed', {});
    throw e;
  };

  const confirmParams = {
    elements,
    confirmParams: {
      // Make sure to change this to inbox page constant
      return_url: 'http://localhost:3000',
      payment_method_data: {
        billing_details: {
          address: {
            country: 'US',
          },
        },
      },
    },
    redirect: 'if_required',
  };

  // If user is using default payment method for payment
  if (!!useDefaultCard) {
    const clientSecret = elements._commonOptions.clientSecret.clientSecret;

    return stripe
      .confirmCardPayment(clientSecret, {
        payment_method: defaultCardId,
      })
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        handleSuccess(res);
      })
      .catch(handleError);
  } else if (!!saveCardAsDefault) {
    return stripeUpdatePaymentIntent({
      paymentIntentId,
      update: { setup_future_usage: 'off_session' },
    })
      .then(() => {
        return stripe.confirmPayment(confirmParams);
      })
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        if (defaultCardId) {
          // May want to confirm payment after this confirms, otherwise throw error
          stripeDetachPaymentMethod({ defaultCardId });
        }

        handleSuccess(res);
      })
      .catch(handleError);
  } else {
    return stripe
      .confirmPayment(confirmParams)
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        handleSuccess(res);
      })
      .catch(handleError);
  }
};

export const hasStripeAccount = userId => (dispatch, getState, sdk) => {
  dispatch(hasStripeAccountRequest());

  const handleSuccess = response => {
    dispatch(hasStripeAccountSuccess(response.data));
    return response;
  };

  const handleError = e => {
    dispatch(hasStripeAccountError(storableError(e)));
    log.error(e, 'fetch-provider-account-failed', {});
    throw e;
  };

  return fetchHasStripeAccount({ userId })
    .then(handleSuccess)
    .catch(handleError);
};

export const fetchDefaultPayment = stripeCustomerId => (dispatch, getState, sdk) => {
  dispatch(fetchDefaultPaymentRequest());

  const handleSuccess = response => {
    dispatch(fetchDefaultPaymentSuccess(response.data.data[0]));
    return response;
  };

  const handleError = e => {
    dispatch(fetchDefaultPaymentError(storableError(e)));
    log.error(e, 'fetch-default-payment-failed', {});
    throw e;
  };

  return stripePaymentMethods({ stripeCustomerId })
    .then(handleSuccess)
    .catch(handleError);
};
