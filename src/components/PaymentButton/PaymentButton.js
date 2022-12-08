import React from 'react';
import { storeData } from '../../containers/StripePaymentModal/StripePaymentModalSessionHelpers';
import { setInitialValues } from '../../containers/StripePaymentModal/StripePaymentModal.duck';
import { Button } from '../../components';
import { EMPLOYER } from '../../util/constants';
import { TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY } from '../../util/transaction';

import css from './PaymentButton.module.css';

const PaymentButton = props => {
  const {
    currentTransaction,
    onOpenPaymentModal,
    currentUser,
    otherUser,
    otherUserListing,
    onRequestPayment,
    transitionToRequestPaymentInProgress,
    transitionToRequestPaymentError,
    transitionToRequestPaymentSuccess,
  } = props;

  const redirectToCheckout = () => {
    // Set this to store data and set props for payment modal

    const modalInitialValues = {
      listing: otherUserListing,
      transaction: currentTransaction,
      provider: otherUser,
    };

    setInitialValues(modalInitialValues);
    storeData(otherUser, otherUserListing, currentTransaction, 'StripePaymentModal');

    onOpenPaymentModal();
  };

  const requestPayment = () => {
    onRequestPayment(currentTransaction.id);
  };

  const currentUserType =
    currentUser &&
    currentUser.attributes &&
    currentUser.attributes.profile &&
    currentUser.attributes.profile.metadata &&
    currentUser.attributes.profile.metadata.userType;

  return (
    <div className={css.root}>
      {currentUserType === EMPLOYER ? (
        <Button rootClassName={css.buttonRoot} onClick={redirectToCheckout}>
          Pay
        </Button>
      ) : (
        <Button
          rootClassName={css.buttonRoot}
          inProgress={transitionToRequestPaymentInProgress}
          disabled={
            currentTransaction.attributes.lastTransition ===
            TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY
          }
          onClick={requestPayment}
        >
          Request Payment
        </Button>
      )}
    </div>
  );
};

export default PaymentButton;
