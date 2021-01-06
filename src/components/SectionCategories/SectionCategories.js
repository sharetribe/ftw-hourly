import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionCategories.module.css';

// import nyImage from './images/ny-yogi.jpg';
// import laImage from './images/la-yogi.jpg';
// import sfImage from './images/sf-yogi.jpg';

class CategoryImage extends Component {
    render() {
        const { alt, ...rest } = this.props;
        return <img alt={alt} {...rest} />;
    }
}
const LazyImage = lazyLoadWithDimensions(CategoryImage);

const categoryLink = (name, image, searchQuery) => {
    const nameText = <span className={css.CategoryName}>{name}</span>;
    return (
        <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.category}>
            <div className={css.imageWrapper}>
                <div className={css.aspectWrapper}>
                    <LazyImage src={image} alt={name} className={css.categoryImage} />
                </div>
            </div>
            <div className={css.linkText}>
                <FormattedMessage
                    id="SectionLocations.listingsInLocation"
                    values={{ location: nameText }}
                />
            </div>
        </NamedLink>
    );
};

const SectionCategories = props => {
    const { rootClassName, className } = props;

    const classes = classNames(rootClassName || css.root, className);

    return (
        <div className={classes}>
            <div className={css.title}>
                <FormattedMessage id="SectionCategories.title" />
            </div>
            <div className={css.category}>
                {categoryLink(
                    'New York',
                    nyImage,
                    '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556'
                )}
                {categoryLink(
                    'Los Angeles',
                    laImage,
                    '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901'
                )}
                {categoryLink(
                    'San Francisco',
                    sfImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
                {categoryLink(
                    'San Francisco',
                    sfImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
            </div>
            <div className={css.category}>
                {categoryLink(
                    'New York',
                    nyImage,
                    '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556'
                )}
                {categoryLink(
                    'Los Angeles',
                    laImage,
                    '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901'
                )}
                {categoryLink(
                    'San Francisco',
                    sfImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
                {categoryLink(
                    'San Francisco',
                    sfImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
            </div>
        </div>
    );
};

SectionCategories.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionCategories.propTypes = {
    rootClassName: string,
    className: string,
};

export default SectionCategories;