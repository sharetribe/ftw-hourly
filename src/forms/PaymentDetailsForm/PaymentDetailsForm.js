import React, { useState } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldCurrencyInput, SimpleAccordion } from '../../components';
import config from '../../config';
import { formatMoney } from '../../util/currency';
import { composeValidators, required, moneySubUnitAmountAtLeast } from '../../util/validators';
import { types as sdkTypes } from '../../util/sdkLoader';

const { Money } = sdkTypes;

import css from './PaymentDetailsForm.module.css';

const MINIMUM_AMOUNT = 1000;
const STRIPE_INVALID_REQUEST_ERROR = 'StripeInvalidRequestError';
const STRIPE_CARD_ERROR = 'StripeCardError';

const convertDollarToMoneyInteger = dollarAmount => {
  const amountNoDollar = dollarAmount.replace('$', '');

  return amountNoDollar * 100;
};

const PaymentDetailsFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        createPaymentIntentInProgress,
        createPaymentIntentSuccess,
        createPaymentIntentError,
        paymentIntent,
        values,
      } = formRenderProps;

      const amountLabel = intl.formatMessage({ id: 'PaymentDetailsForm.amountLabel' });
      const amountPlaceholderMessage = intl.formatMessage({
        id: 'PaymentDetailsForm.amountPlaceholder',
      });
      const amountRequiredMessage = intl.formatMessage({
        id: 'PaymentDetailsForm.amountRequired',
      });
      const amountRequiredValidator = required(amountRequiredMessage);
      const amountTooLowMessage = intl.formatMessage(
        {
          id: 'PaymentDetailsForm.amountTooLow',
        },
        {
          minimumAmount: formatMoney(intl, new Money(MINIMUM_AMOUNT, 'USD')),
        }
      );
      const amountTooLowValidator = moneySubUnitAmountAtLeast(amountTooLowMessage, MINIMUM_AMOUNT);

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = createPaymentIntentInProgress;
      const submitDisabled = invalid || disabled || submitInProgress || paymentIntent;

      const totalAmountNumber = values.amount && values.amount.amount + values.amount.amount * 0.06;
      const totalAmountMoney = totalAmountNumber
        ? new Money(totalAmountNumber, 'USD')
        : new Money(0, 'USD');
      const totalAmount = formatMoney(intl, totalAmountMoney);

      const transactionFeeNumber = values.amount && values.amount.amount * 0.06;
      const transactionFeeMoney = transactionFeeNumber
        ? new Money(transactionFeeNumber, 'USD')
        : new Money(0, 'USD');
      const transactionFee = formatMoney(intl, transactionFeeMoney);

      const [accordionLabel, setAccordionLabel] = useState('Show Payment Details');

      const onHandleExpandPaymentDetails = isExpanded => {
        if (isExpanded) {
          setAccordionLabel('Hide Payment Details');
        } else {
          setAccordionLabel('Show Payment Details');
        }
      };

      let createPaymentIntentErrorMessage = null;
      let listingNotFoundErrorMessage = null;

      // if (listingNotFound) {
      //   listingNotFoundErrorMessage = (
      //     <p className={css.notFoundError}>
      //       <FormattedMessage id="CheckoutPage.listingNotFoundError" />
      //     </p>
      //   );
      // }

      if (createPaymentIntentError) {
        // NOTE: Error messages from Stripes are not part of translations.
        // By default they are in English.
        let errorId = null;
        switch (createPaymentIntentError.type) {
          case STRIPE_CARD_ERROR:
            errorId = 'PaymentDetailsForm.stripeCardErrorMessage';
            break;
          case STRIPE_INVALID_REQUEST_ERROR:
            errorId = 'PaymentDetailsForm.stripeInvalidRequestErrorMessage';
            break;
          default:
            errorId = 'PaymentDetailsForm.stripeOtherErrorMessage';
            break;
        }

        const stripeErrorMessage = createPaymentIntentError.message;
        createPaymentIntentErrorMessage = (
          <p className={css.orderError}>
            <FormattedMessage id={errorId} values={{ stripeErrorMessage }} />
          </p>
        );
      }
      // } else if (initiateOrderError) {
      //   // Generic initiate order error
      //   initiateOrderErrorMessage = (
      //     <p className={css.orderError}>
      //       <FormattedMessage id="CheckoutPage.initiateOrderError" values={{ listingLink }} />
      //     </p>
      //   );
      // }

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <div className={css.amountContainer}>
            <label className={css.amountLabel}>Pay amount</label>
            <FieldCurrencyInput
              id="amount"
              name="amount"
              rootClassName={css.currencyRoot}
              placeholder={amountPlaceholderMessage}
              validate={composeValidators(amountRequiredValidator, amountTooLowValidator)}
              currencyConfig={config.currencyConfig}
              inputClassName={css.currencyInput}
              disabled={!!paymentIntent}
            />
          </div>
          <div className={css.amountDisplayContainer}>
            <div className={css.amountDisplay}>Total:</div>
            <div className={css.amountDisplay}>{totalAmount}</div>
          </div>
          <SimpleAccordion label={accordionLabel} onExpand={onHandleExpandPaymentDetails}>
            <div className={css.amountDisplayContainer}>
              <div className={css.amountDisplay}>Transaction Fee:</div>
              <div className={css.amountDisplay}>{transactionFee}</div>
            </div>
          </SimpleAccordion>
          {createPaymentIntentErrorMessage}
          <Button
            rootClassName={css.submitButtonRoot}
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg || 'Review'}
          </Button>
        </Form>
      );
    }}
  />
);

PaymentDetailsFormComponent.defaultProps = { className: null, fetchErrors: null };

PaymentDetailsFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  //   saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(PaymentDetailsFormComponent);
