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

import css from './EditListingCareRecipientDetailsForm.module.css';

const EditListingCareRecipientDetailsFormComponent = props => (
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
        id: 'EditListingCareRecipientDetailsForm.employerRelationshipName',
      });
      const employerRelationshipOptions = [
        { key: 'parent', label: 'My parent' },
        { key: 'spouse', label: 'My spouse' },
        { key: 'grandparent', label: 'My grandparent' },
        { key: 'friend', label: 'My friend/extended relative' },
        { key: 'myself', label: 'Myself' },
      ];
      const employerRelationshipLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.employerRelationshipLabel',
      });
      const employerRelationshipErrorMessage = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.employerRelationshipErrorMessage',
      });

      // Certifications and Training
      const certificationsName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.certificationsName',
      });
      const certificationsOptions = findOptionsForSelectFilter(certificationsName, filterConfig);
      const certificationsLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.certificationsLabel',
      });

      // Additional Information
      const additionalInfoName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.additionalInfoName',
      });
      const additionalInfoOptions = findOptionsForSelectFilter(additionalInfoName, filterConfig);
      const additionalInfoLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.additionalInfoLabel',
      });

      // Covid Vaccination
      const covidVaccinationName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.covidVaccinationName',
      });
      const covidVaccinationOptions = findOptionsForSelectFilter(
        covidVaccinationName,
        filterConfig
      );
      const covidVaccinationLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.covidVaccinationLabel',
      });
      const errorVaccineNotSelected = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.covidVaccinationNotSelected',
      });

      // Languages Spoken
      const languagesSpokenRadioName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.languagesSpokenRadioName',
      });
      const languagesSpokenRadioOptions = findOptionsForSelectFilter(
        languagesSpokenRadioName,
        filterConfig
      );
      const languagesSpokenRadioLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.languagesSpokenRadioLabel',
      });
      const errorLanguagesNotSelected = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.languagesSpokenNotSelected',
      });
      const languagesSpokenTextName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.languagesSpokenRadioName',
      });
      const languagesSpokenTextPlaceholder = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.languagesSpokenTextPlaceholder',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareRecipientDetailsForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareRecipientDetailsForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCareRecipientDetailsForm.showListingFailed" />
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

          <FieldRadioButtonGroup
            className={css.features}
            id={employerRelationshipName}
            name={employerRelationshipName}
            options={employerRelationshipOptions}
            label={employerRelationshipLabel}
            required={true}
            validate={requiredFieldArrayRadio()}
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

EditListingCareRecipientDetailsFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingCareRecipientDetailsFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingCareRecipientDetailsFormComponent);
