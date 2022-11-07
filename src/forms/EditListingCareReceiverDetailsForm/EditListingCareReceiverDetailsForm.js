import React, { useState, useEffect } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { requiredFieldArrayCheckbox, requiredFieldArrayRadio } from '../../util/validators';
import config from '../../config';
import {
  Form,
  Button,
  FieldCheckboxGroup,
  FieldRadioButtonGroup,
  FieldTextInput,
} from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';

import css from './EditListingCareReceiverDetailsForm.module.css';

const EditListingCareReceiverDetailsFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
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
        updateInProgress,
        filterConfig,
        fetchErrors,
      } = formRenderProps;

      // Employer Relationship
      const employerRelationshipName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.employerRelationshipName',
      });
      const employerRelationshipOptions = [
        'My parent',
        'My spouse',
        'My grandparent',
        'My friend/extended relative',
        'Myself',
      ];
      const employerRelationshipLabel = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.employerRelationshipLabel',
      });

      // Certifications and Training
      const certificationsName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.certificationsName',
      });
      const certificationsOptions = findOptionsForSelectFilter(certificationsName, filterConfig);
      const certificationsLabel = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.certificationsLabel',
      });

      // Additional Information
      const additionalInfoName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.additionalInfoName',
      });
      const additionalInfoOptions = findOptionsForSelectFilter(additionalInfoName, filterConfig);
      const additionalInfoLabel = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.additionalInfoLabel',
      });

      // Covid Vaccination
      const covidVaccinationName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.covidVaccinationName',
      });
      const covidVaccinationOptions = findOptionsForSelectFilter(
        covidVaccinationName,
        filterConfig
      );
      const covidVaccinationLabel = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.covidVaccinationLabel',
      });
      const errorVaccineNotSelected = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.covidVaccinationNotSelected',
      });

      // Languages Spoken
      const languagesSpokenRadioName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.languagesSpokenRadioName',
      });
      const languagesSpokenRadioOptions = findOptionsForSelectFilter(
        languagesSpokenRadioName,
        filterConfig
      );
      const languagesSpokenRadioLabel = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.languagesSpokenRadioLabel',
      });
      const errorLanguagesNotSelected = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.languagesSpokenNotSelected',
      });
      const languagesSpokenTextName = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.languagesSpokenRadioName',
      });
      const languagesSpokenTextPlaceholder = intl.formatMessage({
        id: 'EditListingCareReceiverDetailsForm.languagesSpokenTextPlaceholder',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareReceiverDetailsForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareReceiverDetailsForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareReceiverDetailsForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitInProgress = updateInProgress;
      const submitReady = (updated && pristine) || ready;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <FieldCheckboxGroup
            className={css.features}
            id={employerRelationshipName}
            name={employerRelationshipName}
            options={employerRelationshipOptions}
            label={employerRelationshipLabel}
          />
          <FieldCheckboxGroup
            className={css.features}
            id={certificationsName}
            name={certificationsName}
            options={certificationsOptions}
            label={certificationsLabel}
          />
          <FieldCheckboxGroup
            className={css.features}
            id={additionalInfoName}
            name={additionalInfoName}
            options={additionalInfoOptions}
            label={additionalInfoLabel}
          />
          <FieldRadioButtonGroup
            className={css.features}
            id={covidVaccinationName}
            name={covidVaccinationName}
            options={covidVaccinationOptions}
            label={covidVaccinationLabel}
            required={true}
            validate={requiredFieldArrayRadio(errorVaccineNotSelected)}
          />

          <div>
            <FieldCheckboxGroup
              className={css.features && css.languagesRadio}
              id={languagesSpokenRadioName}
              name={languagesSpokenRadioName}
              options={languagesSpokenRadioOptions}
              label={languagesSpokenRadioLabel}
              required={true}
              validate={requiredFieldArrayCheckbox(errorLanguagesNotSelected)}
            />
            {/* {May need to add custom onChange to this to integrate with languagesSpoken} */}
            <FieldTextInput
              id={languagesSpokenTextName}
              name={languagesSpokenTextName}
              className={css.additionalLanguages}
              type="text"
              placeholder={languagesSpokenTextPlaceholder}
            />
          </div>

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

EditListingCareReceiverDetailsFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingCareReceiverDetailsFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  certificateOptions: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  filterConfig: propTypes.filterConfig,
};

export default compose(injectIntl)(EditListingCareReceiverDetailsFormComponent);
