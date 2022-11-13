import React, { useState } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, useField } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney, convertMoneyToNumber } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput, FieldRangeSlider } from '../../components';
import css from './EditListingPricingForm.module.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{
      setValue: ([field, value], state, { changeValue }) => {
        document.getElementById(field).value = value;
        changeValue(state, field, () => value);
      },
    }}
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
        form: {
          mutators: { setValue },
        },
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
      const minimumPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minimumPrice),
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

      // const [handles, setHandles] = useState([15, 25]);
      // const [maxPrice, setMaxPrice] = useState(25);
      // const [minPrice, setMinPrice] = useState(15);

      // const handleCurrencyFieldChange = value => {
      //   if ([value[0], value[1]] != handles) {
      //     setHandles([value[0], value[1]]);
      //     setMinPrice(value[0].toString());
      //     setMaxPrice(value[1].toString());
      //     setValue('minPrice', new Money(value[0], 'USD'));
      //     setValue('maxPrice', new Money(value[1], 'USD'));
      //   }
      // };

      // const [priceError, setPriceError] = useState(false);

      // const onSubmit = e => {
      //   e.preventDefault();

      //   if (
      //     Number(e.target[0].value.replace('$', '')) > Number(e.target[1].value.replace('$', ''))
      //   ) {
      //     setPriceError(true);
      //     return;
      //   }

      //   handleSubmit(e);
      // };

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
          {/* {priceError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.oppositePricingError" />
            </p>
          ) : null} */}
          {/* <div className={css.currencyFieldContainer}>
            <FieldCurrencyInput
              id="minPrice"
              name="minPrice"
              className={css.priceInput}
              label={minimumPricePerUnitMessage}
              placeholder={minimumPricePlaceholderMessage}
              currencyConfig={config.currencyConfig}
              validate={!submitInProgress && minimumPriceValidators}
              parentValue={minPrice}
            />
            <FieldCurrencyInput
              id="maxPrice"
              name="maxPrice"
              className={css.priceInput}
              label={maximumPricePerUnitMessage}
              placeholder={maximumPricePlaceholderMessage}
              currencyConfig={config.currencyConfig}
              validate={!submitInProgress && maxPriceRequired}
              parentValue={maxPrice}
            />
          </div> */}
          <FieldRangeSlider
            id="rates"
            name="rates"
            className={css.priceRange}
            min={10}
            max={50}
            step={1}
            handles={[15, 25]}
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
