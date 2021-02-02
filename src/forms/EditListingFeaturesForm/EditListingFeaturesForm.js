import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';
import { propTypes } from '../../util/types';
// import { maxLength, required, composeValidators } from '../../util/validators';
import config from '../../config';
import { Button, FieldCheckboxGroup, FieldSelect, FieldTextInput, Form } from '../../components';

import css from './EditListingFeaturesForm.module.css';

const EditListingFeaturesFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        name,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
        intl,
        invalid,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const nameOfConsultationMessage = intl.formatMessage({ id: 'EditListingFeaturesForm.nameOfConsultationService' });
      const nameOfConsultationPlaceholderMessage = intl.formatMessage({
        id: 'EditListingFeaturesForm.nameOfConsultationServicePlaceholder',
      });
      const nameOfConsultationRequiredMessage = intl.formatMessage({
        id: 'EditListingFeaturesForm.nameOfConsultationServiceRequired',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.showListingFailed" />
        </p>
      ) : null;

      const categoryKey = 'categories';
      const categoryOptions = findOptionsForSelectFilter(categoryKey, filterConfig);

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}

          <FieldSelect
            className={css.features}
            name={categoryKey}
            id={categoryKey}
            label={'Service categories'}
          >
            {categoryOptions.map(o => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </FieldSelect>

          {/* <FieldTextInput
            id="consultationService"
            name="Name of consultation service"
            className={css.consultation}
            type="textarea"
            label={nameOfConsultationMessage}
            placeholder={nameOfConsultationPlaceholderMessage}
            validate={composeValidators(required(nameOfConsultationRequiredMessage))}
          /> */}

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

EditListingFeaturesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingFeaturesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
  name: string.isRequired,
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
  filterConfig: propTypes.filterConfig,
};

const EditListingFeaturesForm = EditListingFeaturesFormComponent;

export default compose(injectIntl)(EditListingFeaturesForm);
