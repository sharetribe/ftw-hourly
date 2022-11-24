import React, { Component, useState, useEffect } from 'react';
import { bool, func, instanceOf, object, oneOfType, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { pathByRouteName, findRouteByRouteName } from '../../util/routes';
import { propTypes, LINE_ITEM_NIGHT, LINE_ITEM_DAY, DATE_TYPE_DATETIME } from '../../util/types';
import {
  ensureListing,
  ensureCurrentUser,
  ensureUser,
  ensureTransaction,
  ensureBooking,
  ensureStripeCustomer,
  ensurePaymentMethodCard,
} from '../../util/data';
import { minutesBetween } from '../../util/dates';
import { createSlug } from '../../util/urlHelpers';
import { formatMoney } from '../../util/currency';
import {
  AvatarMedium,
  BookingBreakdown,
  Logo,
  NamedLink,
  NamedRedirect,
  Page,
  ResponsiveImage,
} from '../../components';
import { StripePaymentForm } from '../../forms';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { confirmCardPayment, retrievePaymentIntent } from '../../ducks/stripe.duck';
import { savePaymentMethod } from '../../ducks/paymentMethods.duck';
import { fetchTransaction } from '../../ducks/transactions.duck';

import {
  initiateOrder,
  setInitialValues,
  speculateTransaction,
  stripeCustomer,
  confirmPayment,
  sendMessage,
  makePaymentIntent,
  fetchStripeAccount,
} from './CheckoutPage.duck';
import { storeData, storedData, clearData } from './CheckoutPageSessionHelpers';
import css from './CheckoutPage.module.css';
import { TouchList } from 'core-js/internals/dom-iterables';

import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '../../forms';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const STORAGE_KEY = 'CheckoutPage';

// Stripe PaymentIntent statuses, where user actions are already completed
// https://stripe.com/docs/payments/payment-intents/status
const STRIPE_PI_USER_ACTIONS_DONE_STATUSES = ['processing', 'requires_capture', 'succeeded'];

// Payment charge options
const ONETIME_PAYMENT = 'ONETIME_PAYMENT';
const PAY_AND_SAVE_FOR_LATER_USE = 'PAY_AND_SAVE_FOR_LATER_USE';
const USE_SAVED_CARD = 'USE_SAVED_CARD';

const CheckoutPageComponent = props => {
  const {
    onMakePaymentIntent,
    fetchStripeCustomer,
    scrollingDisabled,
    onFetchStripeAccount,
    intl,
  } = props;

  const [clientSecret, setClientSecret] = useState('');
  const [pageData, setPageData] = useState(null);

  const loadInitialData = () => {
    // Fetch currentUser with stripeCustomer entity
    // Note: since there's need for data loading in "componentWillMount" function,
    //       this is added here instead of loadData static function.

    const pageData = storedData(STORAGE_KEY);
    // setPageData(pageData);

    // const currentProviderId = pageData.author.id;

    fetchStripeCustomer();
    // onFetchStripeAccount(currentProviderId);

    // Browser's back navigation should not rewrite data in session store.
    // Action is 'POP' on both history.back() and page refresh cases.
    // Action is 'PUSH' when user has directed through a link
    // Action is 'REPLACE' when user has directed through login/signup process
    // const hasNavigatedThroughLink = history.action === 'PUSH' || history.action === 'REPLACE';

    // const hasDataInProps = !!listing && hasNavigatedThroughLink;
    // if (hasDataInProps) {
    //   // Store data only if data is passed through props and user has navigated through a link.
    //   storeData(currentTransaction, STORAGE_KEY);
    // }

    // NOTE: stored data can be empty if user has already successfully completed transaction.

    return pageData;
  };

  useEffect(() => {
    const pageData = loadInitialData();
    setPageData(pageData);

    const currentProviderId = pageData.author.id;
    onMakePaymentIntent(1000, currentProviderId).then(data => {
      setClientSecret(data.clientSecret);
    });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  const title = (pageData && pageData.listing && pageData.listing.title) || '';

  const pageProps = { title, scrollingDisabled };
  const topbar = (
    <div className={css.topbar}>
      <NamedLink className={css.home} name="LandingPage">
        <Logo
          className={css.logoMobile}
          title={intl.formatMessage({ id: 'CheckoutPage.goToLandingPage' })}
          format="mobile"
        />
        <Logo
          className={css.logoDesktop}
          alt={intl.formatMessage({ id: 'CheckoutPage.goToLandingPage' })}
          format="desktop"
        />
      </NamedLink>
    </div>
  );

  return (
    <Page {...pageProps}>
      {topbar}
      <div className={css.elements}>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise} className={css.elements}>
            <PaymentForm className={css.elements} />
          </Elements>
        )}
      </div>
    </Page>
  );
};

CheckoutPageComponent.defaultProps = {
  initiateOrderError: null,
  confirmPaymentError: null,
  listing: null,
  bookingData: {},
  bookingDates: null,
  speculateTransactionError: null,
  speculatedTransaction: null,
  currentTransaction: null,
  currentUser: null,
  paymentIntent: null,
};

CheckoutPageComponent.propTypes = {
  scrollingDisabled: bool,
  listing: propTypes.listing,
  fetchStripeCustomer: func,
  stripeCustomerFetched: bool,
  fetchSpeculatedTransaction: func,
  speculateTransactionInProgress: bool,
  speculateTransactionError: propTypes.error,
  speculatedTransaction: propTypes.transaction,
  currentTransaction: propTypes.transaction,
  currentUser: propTypes.currentUser,
  params: shape({
    id: string,
    slug: string,
  }),
  onConfirmPayment: func,
  onInitiateOrder: func,
  onConfirmCardPayment: func,
  onRetrievePaymentIntent: func,
  onSavePaymentMethod: func,
  onSendMessage: func,
  initiateOrderError: propTypes.error,
  confirmPaymentError: propTypes.error,
  // confirmCardPaymentError comes from Stripe so that's why we can't expect it to be in a specific form
  confirmCardPaymentError: oneOfType([propTypes.error, object]),
  paymentIntent: object,

  // from connect
  dispatch: func,

  // from injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => {
  const {
    listing,
    bookingData,
    bookingDates,
    stripeCustomerFetched,
    speculateTransactionInProgress,
    speculateTransactionError,
    speculatedTransaction,
    initiateOrderError,
    confirmPaymentError,
  } = state.CheckoutPage;
  const { currentUser } = state.user;
  const { confirmCardPaymentError, paymentIntent, retrievePaymentIntentError } = state.stripe;
  const { currentTransaction } = state.transactions;
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    stripeCustomerFetched,
    bookingData,
    bookingDates,
    speculateTransactionInProgress,
    speculateTransactionError,
    speculatedTransaction,
    listing,
    initiateOrderError,
    confirmCardPaymentError,
    confirmPaymentError,
    paymentIntent,
    retrievePaymentIntentError,
    currentTransaction,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  fetchSpeculatedTransaction: (params, transactionId) =>
    dispatch(speculateTransaction(params, transactionId)),
  fetchStripeCustomer: () => dispatch(stripeCustomer()),
  onInitiateOrder: (params, transactionId) => dispatch(initiateOrder(params, transactionId)),
  onRetrievePaymentIntent: params => dispatch(retrievePaymentIntent(params)),
  onConfirmCardPayment: params => dispatch(confirmCardPayment(params)),
  onConfirmPayment: params => dispatch(confirmPayment(params)),
  onSendMessage: params => dispatch(sendMessage(params)),
  onSavePaymentMethod: (stripeCustomer, stripePaymentMethodId) =>
    dispatch(savePaymentMethod(stripeCustomer, stripePaymentMethodId)),
  onFetchTransaction: txId => dispatch(fetchTransaction(txId)),
  onMakePaymentIntent: (amount, StripeAccountId) =>
    dispatch(makePaymentIntent(amount, StripeAccountId)),
  onFetchStripeAccount: userId => dispatch(fetchStripeAccount(userId)),
});

const CheckoutPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(CheckoutPageComponent);

CheckoutPage.setInitialValues = (initialValues, saveToSessionStorage = false) => {
  if (saveToSessionStorage) {
    const { listing } = initialValues;
    storeData(listing, null, STORAGE_KEY);
  }

  return setInitialValues(initialValues);
};

CheckoutPage.displayName = 'CheckoutPage';

export default CheckoutPage;
