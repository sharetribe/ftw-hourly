import React from 'react';
import queryString from 'query-string';
import { intlShape } from '../../util/reactIntl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import {
  EditListingCareTypeForm,
  EditListingExperienceLevelForm,
  EditListingAdditionalDetailsForm,
} from '../../forms';
import { ListingLink } from '..';

import css from './EditListingExperiencePanel.module.css';

const pathParamsToNextForm = (params, form, experienceForms) => {
  const nextFormIndex = experienceForms.findIndex(s => s === tab) + 1;
  const nextForm =
    nextFormIndex < experienceForms.length
      ? experienceForms[nextFormIndex]
      : experienceForms[experienceForms.length - 1];
  return { ...params, form: nextForm };
};

export const CARE_TYPE = 'care-type';
export const EXPERIENCE_LEVEL = 'experience-level';
export const ADDITIONAL_DETAILS = 'additional-details';

const EditListingExperiencePanel = props => {
  const {
    rootClassName,
    className,
    listing,
    isNewListingFlow,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    intl,
  } = props;

  const parsed = queryString.parse(location.search);
  const form = parsed.form;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingExperiencePanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingExperiencePanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingExperiencePanel.createListingTitle" />
  );

  const formProps = {
    className: css.form,
    onChange,
    disabled,
    ready,
    updated: panelUpdated,
    updateInProgress,
    fetchErrors: errors,
  };

  //TODO: Edit for attributes
  // const yogaStyles = publicData && publicData.yogaStyles;
  // const initialValues = { yogaStyles };

  switch (form) {
    case CARE_TYPE: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewDescription'
        : 'EditListingWizard.saveEditDescription';
      const mess = intl.formatMessage({ id: submitButtonTranslationKey });
      return (
        <div className={classes}>
          <h1 className={css.title}>{panelTitle}</h1>
          <EditListingCareTypeForm
            {...formProps}
            saveActionMsg={mess}
            onSubmit={() => console.log('submit')}
          />
        </div>
      );
    }
    case EXPERIENCE_LEVEL: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewExperience'
        : 'EditListingWizard.saveEditExperience';
      return (
        <EditListingExperienceLevelForm
          {...formProps}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={() => console.log('submit')}
        />
      );
    }
    case ADDITIONAL_DETAILS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPolicies'
        : 'EditListingWizard.saveEditPolicies';
      return (
        <EditListingAdditionalDetailsForm
          {...formProps}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={() => console.log('submit')}
        />
      );
    }
    default:
      return null;
  }

  // return (
  //   <div className={classes}>
  //     <h1 className={css.title}>{panelTitle}</h1>
  //     <EditListingExperienceForm
  //       className={css.form}
  //       name="Experience"
  //       initialValues={initialValues}
  //       //TODO: Change on submit function for attributes
  //       onSubmit={values => {
  //         const { yogaStyles = [] } = values;

  //         const updatedValues = {
  //           publicData: { yogaStyles },
  //         };
  //         onSubmit(updatedValues);
  //       }}
  //       onChange={onChange}
  //       saveActionMsg={submitButtonText}
  //       disabled={disabled}
  //       ready={ready}
  //       updated={panelUpdated}
  //       updateInProgress={updateInProgress}
  //       fetchErrors={errors}
  //     />
  //   </div>
  // );
};

EditListingExperiencePanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingExperiencePanel.propTypes = {
  rootClassName: string,
  className: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
  intl: intlShape.isRequired,
};

export default EditListingExperiencePanel;
