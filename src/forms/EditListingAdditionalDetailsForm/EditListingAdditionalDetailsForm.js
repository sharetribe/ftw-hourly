import React, { useState, useEffect } from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { minLength, maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput } from '../../components';
import CustomCertificateSelectFieldMaybe from './CustomCertificateSelectFieldMaybe';

import css from './EditListingAdditionalDetailsForm.module.css';

const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 700;

const EditListingAdditionalDetailsFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        certificateOptions,
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

      const titleMessage = intl.formatMessage({ id: 'EditListingAdditionalDetailsForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.titleRequired',
      });
      const maxLengthTitleMessage = intl.formatMessage(
        { id: 'EditListingAdditionalDetailsForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );
      const maxLength60Message = maxLength(maxLengthTitleMessage, TITLE_MAX_LENGTH);

      const descriptionMessage = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.description',
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.descriptionPlaceholder',
      });
      const descriptionRequiredMessage = intl.formatMessage({
        id: 'EditListingAdditionalDetailsForm.descriptionRequired',
      });
      const lengthDescriptionMessage = intl.formatMessage(
        { id: 'EditListingAdditionalDetailsForm.descriptionLength' },
        {
          maxLength: DESCRIPTION_MAX_LENGTH,
          minLength: DESCRIPTION_MIN_LENGTH,
        }
      );
      const maxLength700Message = maxLength(lengthDescriptionMessage, DESCRIPTION_MAX_LENGTH);
      const minLength100Message = minLength(lengthDescriptionMessage, DESCRIPTION_MIN_LENGTH);

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
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            maxLength={DESCRIPTION_MAX_LENGTH}
            validate={composeValidators(
              required(descriptionRequiredMessage),
              maxLength700Message,
              minLength100Message
            )}
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
};

export default compose(injectIntl)(EditListingAdditionalDetailsFormComponent);
