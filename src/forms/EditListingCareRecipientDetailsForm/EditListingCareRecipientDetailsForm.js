import React, { useState, useEffect } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  requiredFieldArrayCheckbox,
  requiredFieldArrayRadio,
  required,
  maxLength,
  minLength,
  composeValidators,
} from '../../util/validators';
import config from '../../config';
import {
  Form,
  Button,
  FieldCheckboxGroup,
  FieldRadioButtonGroup,
  FieldTextInput,
  FieldSelect,
} from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';

import css from './EditListingCareRecipientDetailsForm.module.css';

const RECIPIENT_DETAILS_MIN_LENGTH = 100;
const RECIPIENT_DETAILS_MAX_LENGTH = 700;

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
        formId,
        fetchErrors,
      } = formRenderProps;

      // Recipient Relationship
      const recipientRelationshipName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.recipientRelationshipName',
      });
      const recipientRelationshipOptions = [
        { key: 'parent', label: 'My parent' },
        { key: 'spouse', label: 'My spouse' },
        { key: 'grandparent', label: 'My grandparent' },
        { key: 'friend', label: 'My friend/extended relative' },
        { key: 'myself', label: 'Myself' },
      ];
      const recipientRelationshipLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.recipientRelationshipLabel',
      });
      const recipientRelationshipErrorMessage = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.recipientRelationshipErrorMessage',
      });

      // Gender
      const genderName = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.genderName',
      });
      const genderOptions = [
        { key: 'male', label: 'Male' },
        { key: 'female', label: 'Female' },
      ];
      const genderLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.genderLabel',
      });
      const genderErrorMessage = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.genderErrorMessage',
      });

      // Age
      const ageSelectLabel = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.ageSelectLabel',
      });
      const ageSelectOptions = [
        { value: '30s', label: "30's" },
        { value: '40s', label: "40's" },
        { value: '50s', label: "50's" },
        { value: '60s', label: "60's" },
        { value: '70s', label: "70's" },
        { value: '80s', label: "80's" },
        { value: '90s', label: "90's" },
        { value: '100s', label: "100's" },
      ];

      // Recipient Details
      const recipientDetailsMessage = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.recipientDetailsLabel',
      });
      const recipientDetailsPlaceholderMessage = intl.formatMessage({
        id: 'EditListingCareRecipientDetailsForm.recipientDetailsPlaceholder',
      });
      const lengthRecipientDetailsMessage = intl.formatMessage(
        { id: 'EditListingCareRecipientDetailsForm.recipientDetailsLength' },
        {
          maxLength: RECIPIENT_DETAILS_MAX_LENGTH,
        }
      );
      const maxLength700Message = maxLength(
        lengthRecipientDetailsMessage,
        RECIPIENT_DETAILS_MAX_LENGTH
      );

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
            id={recipientRelationshipName}
            name={recipientRelationshipName}
            options={recipientRelationshipOptions}
            label={recipientRelationshipLabel}
            required={true}
            validate={requiredFieldArrayRadio(recipientRelationshipErrorMessage)}
          />
          <FieldRadioButtonGroup
            className={css.features}
            id={genderName}
            name={genderName}
            options={genderOptions}
            label={genderLabel}
            required={true}
            validate={requiredFieldArrayRadio(genderErrorMessage)}
          />
          <label htmlFor="age">{ageSelectLabel}</label>
          <FieldSelect className={css.select} id={formId ? `${formId}.age` : 'age'} name="age">
            {ageSelectOptions.map(item => {
              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </FieldSelect>
          <label htmlFor="recipientDetails">{recipientDetailsMessage}</label>
          <FieldTextInput
            id="recipientDetails"
            name="recipientDetails"
            className={css.textarea}
            type="textarea"
            placeholder={recipientDetailsPlaceholderMessage}
            maxLength={RECIPIENT_DETAILS_MAX_LENGTH}
            validate={maxLength700Message}
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
