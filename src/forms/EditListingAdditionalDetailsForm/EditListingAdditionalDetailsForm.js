import React, { useState, useEffect } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { minLength, maxLength, required, composeValidators } from '../../util/validators';
import config from '../../config';
import { Form, Button, FieldCheckboxGroup } from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';

import css from './EditListingAdditionalDetailsForm.module.css';

const EditListingAdditionalDetailsFormComponent = props => (
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

      // Experience With
      const experienceWithName = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.experienceWithName',
      });
      const experienceWithOptions = findOptionsForSelectFilter(experienceWithName, filterConfig);
      const experienceWithLabel = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.experienceWithLabel',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAdditionalDetailsForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAdditionalDetailsForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAdditionalDetailsForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const [submitReady, setSubmitReady] = useState(false);
      const [submitted, setSubmitted] = useState(false);

      useEffect(() => {
        setSubmitReady((updated || ready) && submitted);
      }, [pristine, ready, updated, submitted]);

      const onSubmit = values => {
        setSubmitted(true);
        handleSubmit(values);
      };

      return (
        <Form className={classes} onSubmit={onSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <FieldCheckboxGroup
            className={css.features}
            id={experienceWithName}
            name={experienceWithName}
            options={experienceWithOptions}
            label={experienceWithLabel}
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

EditListingAdditionalDetailsFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingAdditionalDetailsFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingAdditionalDetailsFormComponent);
