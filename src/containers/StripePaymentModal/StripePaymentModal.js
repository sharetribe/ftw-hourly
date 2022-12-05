import React, { useState, useEffect } from 'react';
import { bool, func, object, oneOfType, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from '../../util/reactIntl';
import { storeData, storedData } from './StripePaymentModalSessionHelpers';
import { withRouter } from 'react-router-dom';
import { Modal, UserListingPreview, IconConfirm, Button } from '../../components';
import classNames from 'classnames';
import { userDisplayNameAsString } from '../../util/data';
import {
  createPaymentIntent,
  sendMessage,
  confirmPayment,
  setInitialValues,
  initialState,
  hasStripeAccount,
  stripeCustomer,
  saveDefaultPayment,
  fetchDefaultPayment,
} from './StripePaymentModal.duck';
import { manageDisableScrolling } from '../../ducks/UI.duck';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm, PaymentDetailsForm } from '../../forms';
import { loadStripe } from '@stripe/stripe-js';
import { propTypes } from '../../util/types';

import css from './StripePaymentModal.module.css';
import { Fragment } from 'react';
import { fontFamily } from '@mui/system';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const STORAGE_KEY = 'StripePaymentModal';

const StripePaymentModalComponent = props => {
  const {
    onCreatePaymentIntent,
    intl,
    onManageDisableScrolling,
    isOpen,
    onConfirmPayment,
    onSetInitialState,
    onClose,
    listing,
    transaction,
    provider,
    confirmPaymentInProgress,
    confirmPaymentError,
    confirmPaymentSuccess,
    createPaymentIntentInProgress,
    createPaymentIntentError,
    paymentIntent,
    currentUser,
    hasStripeAccountInProgress,
    hasStripeAccountError,
    hasStripeAccount,
    hasStripeAccountFetched,
    fetchHasStripeAccount,
    fetchStripeCustomer,
    fetchDefaultPaymentInProgress,
    fetchDefaultPaymentError,
    defaultPayment,
    onFetchDefaultPayment,
    defaultPaymentFetched,
  } = props;

  const [clientSecret, setClientSecret] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [rootClass, setRootClass] = useState(classNames(css.root, css.single));
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const loadInitialData = () => {
    const hasDataInProps = provider && listing && transaction;
    if (hasDataInProps) {
      // Store data only if data is passed through props and user has navigated through a link.
      storeData(provider, listing, transaction, STORAGE_KEY);
    }

    const modalData = hasDataInProps ? { provider, listing, transaction } : storedData(STORAGE_KEY);

    fetchStripeCustomer();
    fetchHasStripeAccount(modalData.provider.id);

    return modalData;
  };

  useEffect(() => {
    const modalData = loadInitialData();
    setModalData(modalData);
  }, []);

  useEffect(() => {
    if (paymentIntent) {
      setClientSecret(paymentIntent.client_secret);
      setRootClass(classNames(css.root, css.double));
      setTimeout(() => {
        setShowPaymentForm(true);
      }, '1500');
    }

    if (confirmPaymentSuccess) {
      setRootClass(classNames(css.root, css.confirmation));
    }
  }, [paymentIntent, confirmPaymentSuccess]);

  const onHandleReviewPayment = values => {
    const { amount } = values;

    if (currentUser.stripeCustomer) {
      const { stripeCustomerId } = currentUser.stripeCustomer.attributes;
      onCreatePaymentIntent(amount.amount, modalData.provider.id, stripeCustomerId);
    } else {
      onCreatePaymentIntent(amount.amount, modalData.provider.id);
    }
  };

  const onHandlePaymentSubmit = (stripe, elements, saveCardAsDefault, useDefaultCard) => {
    const defaultPaymentId = defaultPayment && defaultPayment.id;
    onConfirmPayment(
      stripe,
      elements,
      saveCardAsDefault,
      defaultPaymentId,
      paymentIntent.id,
      useDefaultCard
    );
  };

  const onHandleClose = () => {
    onClose();
    onSetInitialState();
  };

  const onHandleEditPaymentDetails = () => {
    setClientSecret(null);
    setRootClass(classNames(css.root, css.single));
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#568a6e',
      fontFamily: '"poppins", Helvetica, Arial, sans-serif',
      borderRadius: '2px',
    },
    rules: {
      '.Input': {
        display: 'block',
        width: '100%',
        margin: '0',
        paddingLeft: '0',
        paddingBlock: isMobile ? '5px' : '4px',
        height: '24px',
        boxShadow: 'none',

        /* Borders */
        border: 'none',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#4a4a4a',
        borderRadius: 0,
        transition: 'border-bottom-color ease-in 0.2s',
        fontFamily: '"poppins", Helvetica, Arial, sans-serif',
        fontSize: '16px',
        lineHeight: isMobile ? '24px' : '32px;',
        letterSpacing: '-0.1px',
        fontWeight: '500',
      },
      '.Input:hover, .Input:focus': {
        boxShadow: 'none',
        borderColor: '#568a6e',
      },
      '.Input::placeholder': {
        color: '#b2b2b2',
        fontWeight: '500',
        fontFamily: '"poppins", Helvetica, Arial, sans-serif',
      },
      '.Input--invalid': {
        boxShadow: 'none',
        borderBottomColor: '#ff0000',
        color: '#ff0000',
      },
      '.Error': {
        color: '#ff0000',
        fontFamily: '"poppins", Helvetica, Arial, sans-serif',
      },
      '.Label': {
        fontFamily: '"poppins", Helvetica, Arial, sans-serif',
        display: 'block',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: isMobile ? '18px' : '16px',
        letterSpacing: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: isMobile ? '0px' : '6px',
        color: '#4a4a4a',
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };
  const closeButtonMessage = intl.formatMessage({ id: 'StripePaymentModal.closeButtonMessage' });
  const paymentConfirmedMessage = intl.formatMessage({
    id: 'StripePaymentModal.paymentConfirmedMessage',
  });
  const providerName = modalData && userDisplayNameAsString(modalData.provider);
  const notifyProviderMessage = intl.formatMessage({
    id: 'StripePaymentModal.notifyProviderMessage',
  });

  return (
    <Fragment>
      {(hasStripeAccountFetched || confirmPaymentSuccess) && (
        <Modal
          id="stripePaymentModal"
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          isOpen={isOpen}
          onClose={onHandleClose}
          usePortal
          closeButtonMessage={closeButtonMessage}
        >
          {(hasStripeAccount || confirmPaymentSuccess) && (
            <div className={rootClass}>
              {!confirmPaymentSuccess && (
                <div className={css.leftColumnContainer}>
                  {modalData && (
                    <UserListingPreview
                      otherUser={modalData.provider}
                      otherUserListing={modalData.listing}
                      intl={intl}
                      rootClassName={css.userPreviewRoot}
                      className={css.usernameContainer}
                    />
                  )}
                  <PaymentDetailsForm
                    onSubmit={onHandleReviewPayment}
                    createPaymentIntentInProgress={createPaymentIntentInProgress}
                    createPaymentIntentError={createPaymentIntentError}
                    clientSecret={clientSecret}
                    onEditPaymentDetails={onHandleEditPaymentDetails}
                  />
                </div>
              )}
              {clientSecret && !confirmPaymentSuccess && (
                <div className={css.paymentElements}>
                  {showPaymentForm && (
                    <Elements options={options} stripe={stripePromise}>
                      <PaymentForm
                        paymentIntent={paymentIntent}
                        onPaymentSubmit={onHandlePaymentSubmit}
                        intl={intl}
                        confirmPaymentInProgress={confirmPaymentInProgress}
                        confirmPaymentError={confirmPaymentError}
                        confirmPaymentSuccess={confirmPaymentSuccess}
                        currentUser={currentUser}
                        onManageDisableScrolling={onManageDisableScrolling}
                        fetchDefaultPaymentInProgress={fetchDefaultPaymentInProgress}
                        fetchDefaultPaymentError={fetchDefaultPaymentError}
                        defaultPayment={defaultPayment}
                        onFetchDefaultPayment={onFetchDefaultPayment}
                        defaultPaymentFetched={defaultPaymentFetched}
                      />
                    </Elements>
                  )}
                </div>
              )}
              {confirmPaymentSuccess && (
                <div className={css.confirmationContainer}>
                  <IconConfirm />
                  <div className={css.confirmationText}>{paymentConfirmedMessage}</div>
                </div>
              )}
            </div>
          )}
          {!hasStripeAccount && hasStripeAccountFetched && !confirmPaymentSuccess && (
            <div className={rootClass}>
              <UserListingPreview
                otherUser={modalData && modalData.provider}
                otherUserListing={modalData && modalData.listing}
                intl={intl}
                rootClassName={css.userPreviewRoot}
                className={css.usernameContainer}
              />
              <p className={css.noPayoutMessage}>
                <FormattedMessage
                  id="StripePaymentModal.providerMissingStripeAccountText"
                  values={{ providerName }}
                />
              </p>
              <div className={css.notifyButtonWrapper}>
                <Button
                // type="submit"
                // inProgress={submitInProgress}
                // disabled={submitDisabled}
                // ready={submitReady}
                >
                  {notifyProviderMessage}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Fragment>
  );
};

StripePaymentModalComponent.defaultProps = {
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

StripePaymentModalComponent.propTypes = {
  scrollingDisabled: bool,
  listing: propTypes.listing,
  transaction: propTypes.transaction,
  provider: propTypes.user,
  confirmPaymentInProgress: bool,
  confirmPaymentError: oneOfType([propTypes.error, object]),
  confirmPaymentSuccess: bool,
  stripeCustomerFetched: bool,
  createPaymentIntentInProgress: bool,
  createPaymentIntentError: oneOfType([propTypes.error, object]),
  paymentIntent: object,
  hasStripeAccountInProgress: bool,
  hasStripeAccountError: propTypes.error,
  hasStripeAccount: bool,
  hasStripeAccountFetched: bool,
  fetchDefaultPaymentInProgress: bool,
  fetchDefaultPaymentError: propTypes.error,
  defaultPayment: object,
  defaultPaymentFetched: bool,
  currentUser: propTypes.currentUser,
  params: shape({
    id: string,
    slug: string,
  }),

  onSendMessage: func,
  onCreatePaymentIntent: func,
  onConfirmPayment: func,
  onSetInitialState: func,

  // from connect
  dispatch: func,

  // from injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,

  // eslint-disable-next-line react/no-unused-prop-types
  onManageDisableScrolling: func.isRequired,
};

const mapStateToProps = state => {
  const {
    listing,
    transaction,
    currentProvider,
    confirmPaymentInProgress,
    confirmPaymentError,
    confirmPaymentSuccess,
    stripeCustomerFetched,
    createPaymentIntentInProgress,
    createPaymentIntentError,
    paymentIntent,
    hasStripeAccountInProgress,
    hasStripeAccountError,
    hasStripeAccount,
    hasStripeAccountFetched,
    fetchDefaultPaymentInProgress,
    fetchDefaultPaymentError,
    defaultPayment,
    defaultPaymentFetched,
  } = state.StripePaymentModal;
  const { currentUser } = state.user;

  return {
    listing,
    transaction,
    currentProvider,
    confirmPaymentInProgress,
    confirmPaymentError,
    confirmPaymentSuccess,
    stripeCustomerFetched,
    createPaymentIntentInProgress,
    createPaymentIntentError,
    paymentIntent,
    currentUser,
    hasStripeAccountInProgress,
    hasStripeAccountError,
    hasStripeAccount,
    hasStripeAccountFetched,
    fetchDefaultPaymentInProgress,
    fetchDefaultPaymentError,
    defaultPayment,
    defaultPaymentFetched,
  };
};

const mapDispatchToProps = dispatch => ({
  onSendMessage: params => dispatch(sendMessage(params)),
  onCreatePaymentIntent: (amount, stripeAccountId, stripeCustomerId) =>
    dispatch(createPaymentIntent(amount, stripeAccountId, stripeCustomerId)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onConfirmPayment: (
    stripe,
    elements,
    saveCardAsDefault,
    hasDefaultCard,
    paymentIntentId,
    useDefaultCard
  ) =>
    dispatch(
      confirmPayment(
        stripe,
        elements,
        saveCardAsDefault,
        hasDefaultCard,
        paymentIntentId,
        useDefaultCard
      )
    ),
  onSetInitialState: () => dispatch(setInitialValues(initialState)),
  fetchHasStripeAccount: userId => dispatch(hasStripeAccount(userId)),
  fetchStripeCustomer: () => dispatch(stripeCustomer()),
  // onSaveDefaultPayment: (currentUser, elements, stripe) =>
  //   dispatch(saveDefaultPayment(currentUser, elements, stripe)),
  onFetchDefaultPayment: stripeCustomerId => dispatch(fetchDefaultPayment(stripeCustomerId)),
});

const StripePaymentModal = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(StripePaymentModalComponent);

export default StripePaymentModal;
