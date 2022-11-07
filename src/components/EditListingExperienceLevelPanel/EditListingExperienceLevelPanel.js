import React from 'react';
import queryString from 'query-string';
import { intlShape } from '../../util/reactIntl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import { EditListingFeaturesForm } from '../../forms';
import { ListingLink } from '..';

import css from './EditListingExperienceLevelPanel.module.css';

const EditListingExperienceLevelPanel = props => {
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
    submitButtonText,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingExperienceLevelPanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingExperienceLevelPanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingExperienceLevelPanel.createListingTitle" />
  );

  const experienceLevel = publicData && publicData.experienceLevel; //;
  const initialValues = { experienceLevel };

  const experienceLevelFeaturesLabel = intl.formatMessage({
    id: 'EditListingExperienceLevelPanel.experienceLevelFormLabel',
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

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingFeaturesForm
        {...formProps}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { experienceLevel } = values;

          const updatedValues = {
            publicData: { experienceLevel },
          };
          onSubmit(updatedValues);
        }}
        name="experienceLevel"
        label={experienceLevelFeaturesLabel}
        singleSelect={true}
        required={true}
      />
    </div>
  );
};

EditListingExperienceLevelPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string, shape } = PropTypes;

EditListingExperienceLevelPanel.propTypes = {
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

export default EditListingExperienceLevelPanel;
