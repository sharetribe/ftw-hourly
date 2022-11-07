import React from 'react';
import queryString from 'query-string';
import { intlShape } from '../../util/reactIntl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import { EditListingFeaturesForm, EditListingAdditionalDetailsForm } from '../../forms';
import { ListingLink } from '..';

import css from './EditListingAdditionalDetailsPanel.module.css';

export const CARE_TYPE = 'care-type';
export const EXPERIENCE_LEVEL = 'experience-level';
export const ADDITIONAL_DETAILS = 'additional-details';

const CARE_TYPE_FEATURES_NAME = 'careTypes';
const EXPERIENCE_LEVEL_FEATURES_NAME = 'experienceLevel';

const EditListingAdditionalDetailsPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    isNewListingFlow,
    disabled,
    ready,
    onSubmit,
    onChange,
    panelUpdated,
    updateInProgress,
    errors,
    intl,
    onChangeQueryParam,
  } = props;

  const parsed = queryString.parse(location.search);
  const form = parsed.form;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingAdditionalDetailsPanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingAdditionalDetailsPanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingAdditionalDetailsPanel.createListingTitle" />
  );

  const careTypes = publicData && publicData.careTypes;
  const initialValues = { careTypes };

  const careTypesFeaturesLabel = intl.formatMessage({
    id: 'EditListingAdditionalDetailsPanel.careTypesFormLabel',
  });

  const experienceLevelFeaturesLabel = intl.formatMessage({
    id: 'EditListingAdditionalDetailsPanel.experienceLevelFormLabel',
  });

  const formProps = {
    className: css.form,
    onChange,
    disabled,
    initialValues,
    ready,
    updated: panelUpdated,
    updateInProgress,
    fetchErrors: errors,
    intl,
  };

  switch (form) {
    case CARE_TYPE: {
      const submitButtonTranslationKey = 'EditListingAdditionalDetailsPanel.careTypesNextButton';
      const mess = intl.formatMessage({ id: submitButtonTranslationKey });
      return (
        <div className={classes}>
          <h1 className={css.title}>{panelTitle}</h1>
          <EditListingFeaturesForm
            {...formProps}
            saveActionMsg={mess}
            onSubmit={values => {
              const { careTypes = [] } = values;

              const updatedValues = {
                publicData: { careTypes },
              };
              onSubmit(updatedValues);
            }}
            name={CARE_TYPE_FEATURES_NAME}
            label={careTypesFeaturesLabel}
            required={true}
          />
        </div>
      );
    }
    case EXPERIENCE_LEVEL: {
      const submitButtonTranslationKey =
        'EditListingAdditionalDetailsPanel.experienceLevelNextButton';
      const mess = intl.formatMessage({ id: submitButtonTranslationKey });
      return (
        <div className={classes}>
          <h1 className={css.title}>{panelTitle}</h1>
          <EditListingFeaturesForm
            {...formProps}
            saveActionMsg={mess}
            onSubmit={values => {
              const { experienceLevel } = values;

              const updatedValues = {
                publicData: { experienceLevel },
              };
              onSubmit(updatedValues);
            }}
            name={EXPERIENCE_LEVEL_FEATURES_NAME}
            label={experienceLevelFeaturesLabel}
            singleSelect={true}
            required={true}
          />
        </div>
      );
    }
    case ADDITIONAL_DETAILS: {
      const submitButtonTranslationKey =
        'EditListingAdditionalDetailsPanel.additionalDetailsNextButton';
      const mess = intl.formatMessage({ id: submitButtonTranslationKey });
      return (
        <div className={classes}>
          <h1 className={css.title}>{panelTitle}</h1>
          <EditListingAdditionalDetailsForm
            {...formProps}
            saveActionMsg={mess}
            required={true}
            onSubmit={values => {
              const {
                experienceWith,
                certificationsAndTraining,
                additionalInfo,
                covidVaccination,
                languagesSpoken,
              } = values;

              const updatedValues = {
                publicData: {
                  experienceWith,
                  certificationsAndTraining,
                  additionalInfo,
                  covidVaccination,
                  languagesSpoken,
                },
              };

              onSubmit(updatedValues);
            }}
          />
        </div>
      );
    }
    default:
      return null;
  }
};

EditListingAdditionalDetailsPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string, shape } = PropTypes;

EditListingAdditionalDetailsPanel.propTypes = {
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

export default EditListingAdditionalDetailsPanel;
