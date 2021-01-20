import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionCategories.module.css';

import acImage from './images/accountant.png';
import edImage from './images/edu.png';
import faImage from './images/fashion.png';
import heImage from './images/health.png';
import hoImage from './images/home.png';
import itImage from './images/it.png';
import leImage from './images/legal.png';
import spImage from './images/sport.png';

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
                    id="SectionCategories.listingsInCategory"
                    values={{ category: nameText }}
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
            <div className={css.categories}>
                {categoryLink(
                    'Health Practitioners',
                    heImage,
                    '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556'
                )}
                {categoryLink(
                    'Legal Experts',
                    leImage,
                    '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901'
                )}
                {categoryLink(
                    'IT & Technology Gurus',
                    itImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
                {categoryLink(
                    'Sports & Fitness Instructors',
                    spImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
            </div>
            <div className={css.categories}>
                {categoryLink(
                    'Accountants & Financial Advisors',
                    acImage,
                    '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556'
                )}
                {categoryLink(
                    'Fashionistas & Beauticians',
                    faImage,
                    '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901'
                )}
                {categoryLink(
                    'Educators & Teachers',
                    edImage,
                    '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
                )}
                {categoryLink(
                    'Home Improvement & Housekeeping',
                    hoImage,
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