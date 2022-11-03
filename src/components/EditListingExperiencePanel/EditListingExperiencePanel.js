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

import css from './EditListingExperiencePanel.module.css';

export const CARE_TYPE = 'care-type';
export const EXPERIENCE_LEVEL = 'experience-level';
export const ADDITIONAL_DETAILS = 'additional-details';

const CARE_TYPE_FEATURES_NAME = 'careTypes';
const EXPERIENCE_LEVEL_FEATURES_NAME = 'experienceLevel';

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

  const careTypes = publicData && publicData.careTypes;
  const initialValues = { careTypes };

  const careTypesFeaturesLabel = intl.formatMessage({
    id: 'EditListingExperiencePanel.careTypesFormLabel',
  });
  const experienceLevelFeaturesLabel = intl.formatMessage({
    id: 'EditListingExperiencePanel.experienceLevelFormLabel',
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
  };

  switch (form) {
    case CARE_TYPE: {
      const submitButtonTranslationKey = 'EditListingExperiencePanel.careTypesNextButton';
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

              const nextQuery = { form: 'experience-level' };
              onChangeQueryParam(nextQuery);
            }}
            name={CARE_TYPE_FEATURES_NAME}
            label={careTypesFeaturesLabel}
          />
        </div>
      );
    }
    case EXPERIENCE_LEVEL: {
      const submitButtonTranslationKey = 'EditListingExperiencePanel.experienceLevelNextButton';
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

              const nextQuery = { form: 'additional-details' };
              onChangeQueryParam(nextQuery);
            }}
            name={EXPERIENCE_LEVEL_FEATURES_NAME}
            label={experienceLevelFeaturesLabel}
            singleSelect={true}
          />
        </div>
      );
    }
    case ADDITIONAL_DETAILS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPolicies'
        : 'EditListingWizard.saveEditPolicies';
      return (
        <div className={classes}>
          <h1 className={css.title}>{panelTitle}</h1>
          <EditListingAdditionalDetailsForm
            {...formProps}
            submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
            onSubmit={() => console.log('submit')}
          />
        </div>
      );
    }
    default:
      return null;
  }
};

EditListingExperiencePanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string, shape } = PropTypes;

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
