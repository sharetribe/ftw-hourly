import React from 'react';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { injectIntl, FormattedMessage } from '../../util/reactIntl';
import {
  Form,
  Button,
  FieldTextInput,
  FieldCurrencyInput,
  SecondaryButton,
  PrimaryButton, IconAdd,} from '../../components';
import css from './AddonForm.css';
import IconClose from '../../components/IconClose/IconClose';
import config from '../../config';
import * as validators from '../../util/validators';
import { types as sdkTypes } from '../../util/sdkLoader';

const { Money } = sdkTypes;

export const AddonFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{
      ...arrayMutators,
    }}
    render={({
               handleSubmit,
               intl,
               saveActionMsg,
               form: {
                 mutators: { push, pop },
               },
               pristine,
               form,
               submitting,
               values,
             }) => {

      if (values && values.addons) {
        values.addons.forEach(addonValue => {
          if (addonValue && addonValue.addOnPrice && !(addonValue.addOnPrice instanceof Money)) {
            addonValue.addOnPrice = new Money(addonValue.addOnPrice, config.currency);
          }
        });
      }

      const priceRequired = validators.required(
        <FormattedMessage id="EditListingPricingForm.priceRequired" />
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        <FormattedMessage id="EditListingPricingForm.priceTooLow" values={{ minPrice: minPrice }}/>,
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;
      const titleValidator = validators.required(
        <FormattedMessage id="EditListingPricingForm.titleRequired"/>
      );

      return (
        <Form onSubmit={handleSubmit}>
          <div className={css.childGrid}>
            <div className={css.widthAuto}>
              <PrimaryButton className={css.btnPanel}
                             type="button"
                             onClick={() => push('addons', undefined)}
              >
                Add
                <IconAdd rootClassName={css.addIcon} />
              </PrimaryButton>
            </div>
            <div className={css.widthAuto}>
              <SecondaryButton className={css.btnPanel} type="button" onClick={() => pop('addons')}>
                Remove
              </SecondaryButton>
            </div>
          </div>
          <FieldArray name="addons">
            {({ fields }) =>
              fields.map((name, index) => (
                <div key={name} className={css.row}>
                  <div className={css.column}>
                    <FieldTextInput
                      name={`${name}.addOnTitle`}
                      type="text"
                      placeholder="Add-On title"
                      autoFocus
                      validate={titleValidator}
                    />
                  </div>
                  <div className={css.column}>
                    <FieldCurrencyInput
                      id={`${name}-addon-price`}
                      name={`${name}.addOnPrice`}
                      label={''}
                      placeholder="Add-On Price"
                      currencyConfig={config.currencyConfig}
                      validate={priceValidators}
                    />
                  </div>
                  <span onClick={() => fields.remove(index)} style={{ cursor: 'pointer' }}>
                    <IconClose rootClassName={css.closeIcon} />
                  </span>
                </div>
              ))
            }
          </FieldArray>

          <div className={css.childGrid}>
            <div className={css.columnBtn}>
              <Button className={css.submitButton} type="submit" disabled={submitting || pristine}>
                {saveActionMsg}
              </Button>
            </div>
            <div className={css.columnBtn}>
              <Button
                className={css.submitButton}
                type="button"
                onClick={form.reset}
                disabled={submitting || pristine}
              >
                Reset
              </Button>
            </div>
          </div>
        </Form>
      );
    }}
  />
);

export default compose(injectIntl)(AddonFormComponent);
