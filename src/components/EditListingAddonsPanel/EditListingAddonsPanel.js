import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import css from './EditListingAddonsPanel.css';
import { AddonFormComponent } from '../../forms/AddonForm/AddonForm';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { FormattedMessage } from '../../util/reactIntl';
import { ListingLink } from '../index';
import {Money} from "sharetribe-flex-sdk/src/types";
import config from "../../config";
const EditListingAddonsPanel = props => {
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
    errors,
  } = props;
  const currentListing = ensureOwnListing(listing);
  const { publicData } = currentListing.attributes;
  const {addons } = currentListing.attributes.publicData;
  const { price } = currentListing.attributes;
  const classes = classNames(rootClassName || css.root, className);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingAddonsPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingAddonsPanel.createListingTitle" />
  );
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <AddonFormComponent
        className={css.form}
        initialValues={{addons}}
        publicData={publicData}
        onSubmit={values => {
          console.warn('values', values)
          const { addons} = values;
          let formattedAddons = [];
          addons.forEach(addon => {
            formattedAddons.push({ addOnTitle: addon.addOnTitle, addOnPrice: addon.addOnPrice.amount})
          });
          const updateValues = {
            // we will use only Add-Ons so need to set 0 Price instead of using Price section
            // on Listing create/edit page
            price: new Money(0, config.currency),
            publicData: {
              addons: formattedAddons,
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
      />
    </div>
  );
};
const { func, object, string, bool } = PropTypes;
EditListingAddonsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};
EditListingAddonsPanel.propTypes = {
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
export default EditListingAddonsPanel;
