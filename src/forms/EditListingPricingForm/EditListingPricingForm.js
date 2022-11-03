import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldRangeSlider } from '../../components';
import css from './EditListingPricingForm.module.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        formId,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const maximumPricePerUnitMessage = intl.formatMessage({
        id: 'EditListingPricingForm.maximumPricePerUnit',
      });
      const minimumPricePerUnitMessage = intl.formatMessage({
        id: 'EditListingPricingForm.minimumPricePerUnit',
      });

      // Minimum price
      const minimumPricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.minimumPriceInputPlaceholder',
      });
      const maxPriceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.maximumPriceRequired',
        })
      );
      const minimumPriceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.minimumPriceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const minimumPriceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(minimumPriceRequired, minPriceRequired)
        : minimumPriceRequired;

      //Maximum Price
      const maximumPricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.maximumPriceInputPlaceholder',
      });

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}
          <div className={css.currencyFieldContainer}>
            <FieldCurrencyInput
              id={formId ? `${formId}.minPrice` : 'minPrice'}
              name="minPrice"
              className={css.priceInput}
              label={minimumPricePerUnitMessage}
              placeholder={minimumPricePlaceholderMessage}
              currencyConfig={config.currencyConfig}
              validate={minimumPriceValidators}
            />
            <FieldCurrencyInput
              id={formId ? `${formId}.maxPrice` : 'maxPrice'}
              name="maxPrice"
              className={css.priceInput}
              label={maximumPricePerUnitMessage}
              placeholder={maximumPricePlaceholderMessage}
              currencyConfig={config.currencyConfig}
              validate={maxPriceRequired}
            />
          </div>
          <FieldRangeSlider
            id="priceRange"
            name="priceRange"
            className={css.priceRange}
            min={10}
            max={50}
            step={1}
            handles={[20, 30]}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = { fetchErrors: null };

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
