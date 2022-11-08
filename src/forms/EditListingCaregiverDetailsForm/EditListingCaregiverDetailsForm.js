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

import css from './EditListingCaregiverDetailsForm.module.css';

const CAREGIVER_DETAILS_MAX_LENGTH = 700;

const EditListingCaregiverDetailsFormComponent = props => (
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
        fetchErrors,
      } = formRenderProps;

      // Caregiver Details
      const caregiverDetailsMessage = intl.formatMessage({
        id: 'EditListingCaregiverDetailsForm.caregiverDetailsLabel',
      });
      const caregiverDetailsPlaceholderMessage = intl.formatMessage({
        id: 'EditListingCaregiverDetailsForm.caregiverDetailsPlaceholder',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingCaregiverDetailsForm.maxLengthMessage' },
        {
          maxLength: CAREGIVER_DETAILS_MAX_LENGTH,
        }
      );
      const maxLength700Message = maxLength(maxLengthMessage, CAREGIVER_DETAILS_MAX_LENGTH);

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCaregiverDetailsForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCaregiverDetailsForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitInProgress = updateInProgress;
      const submitReady = (updated && pristine) || ready;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <label htmlFor="idealCaregiverDetails">{caregiverDetailsMessage}</label>
          <FieldTextInput
            id="idealCaregiverDetails"
            name="idealCaregiverDetails"
            className={css.textarea}
            type="textarea"
            placeholder={caregiverDetailsPlaceholderMessage}
            maxLength={CAREGIVER_DETAILS_MAX_LENGTH}
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

EditListingCaregiverDetailsFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingCaregiverDetailsFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingCaregiverDetailsFormComponent);
