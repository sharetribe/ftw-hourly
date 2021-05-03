import React, { useEffect, useMemo, useState } from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '..';
import { getCurrentUser } from '../../util/api';
import _ from 'lodash';
// import { EditListingDescriptionForm } from '../../forms';
import config from '../../config';

import css from './EditListingZoomPanel.module.css';

const EditListingZoomPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;
  const [currentUser, setCurrentUser] = useState(null);
  const isConnectedZoom = useMemo(() => {
    if (_.get(currentUser, "attributes.profile.privateData['isConnectZoom']")) {
      return true;
    }
    return false;
  }, [currentUser]);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingZoomPanel.title"
      values={{
        listingTitle: (
          <ListingLink listing={listing}>
            <FormattedMessage id="EditListingZoomPanel.listingTitle" />
          </ListingLink>
        ),
      }}
    />
  ) : (
    <FormattedMessage id="EditListingZoomPanel.createListingTitle" />
  );

  const certificateOptions = findOptionsForSelectFilter('certificate', config.custom.filters);

  useEffect(() => {
    getCurrentUser().then(res => {
      setCurrentUser(res);
    });
  }, []);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>

      {!isConnectedZoom && (
        <a href="https://zoom.us/oauth/authorize?client_id=PgPAkYGTuq6tICJDMy4Bw&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fzoom">
          Connect Zoom
        </a>
      )}
      {isConnectedZoom && <div> Thank you!. you have already connected zoom</div>}
      {/* <EditListingDescriptionForm
        className={css.form}
        initialValues={{ title, description, certificate: publicData.certificate }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, certificate } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { certificate },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        certificateOptions={certificateOptions}
      /> */}
    </div>
  );
};

EditListingZoomPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingZoomPanel.propTypes = {
  className: string,
  rootClassName: string,

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
};

export default EditListingZoomPanel;
