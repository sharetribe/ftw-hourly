import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureListing } from '../../util/data';

import css from './SearchMapFeatureLabel.module.css';

class SearchMapFeatureLabel extends Component {
    shouldComponentUpdate(nextProps) {
        const currentListing = ensureListing(this.props.listing);
        const nextListing = ensureListing(nextProps.listing);
        const isSameListing = currentListing.id.uuid === nextListing.id.uuid;
        const hasSamePrice = currentListing.attributes.publicData.features === nextListing.attributes.publicData.features;
        const hasSameActiveStatus = this.props.isActive === nextProps.isActive;
        const hasSameRefreshToken =
            this.props.mapComponentRefreshToken === nextProps.mapComponentRefreshToken;

        return !(isSameListing && hasSamePrice && hasSameActiveStatus && hasSameRefreshToken);
    }

    render() {
        const { className, rootClassName, listing, publicData, onListingClicked, isActive } = this.props;
        const currentListing = ensureListing(listing);
        const features =
            listing.attributes.publicData &&
                listing.attributes.publicData.features
                ? listing.attributes.publicData.features
                : null;

        const classes = classNames(rootClassName || css.root, className);
        const featureLabelClasses = classNames(css.featureLabel, { [css.featureLabelActive]: isActive });
        const caretClasses = classNames(css.caret, { [css.caretActive]: isActive });

        return (
            <button className={classes} onClick={() => onListingClicked(currentListing)}>
                <div className={css.caretShadow} />
                <div className={featureLabelClasses}>{features}</div>
                <div className={caretClasses} />
            </button>
        );
    }
}

SearchMapFeatureLabel.defaultProps = {
    className: null,
    rootClassName: null,
};

const { func, string } = PropTypes;

SearchMapFeatureLabel.propTypes = {
    className: string,
    rootClassName: string,
    listing: propTypes.listing.isRequired,
    onListingClicked: func.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

export default injectIntl(SearchMapFeatureLabel);
