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
                    'Health',
                    heImage,
                    '?pub_consultation=health'
                )}
                {categoryLink(
                    'Legal',
                    leImage,
                    '?pub_consultation=legal'
                )}
                {categoryLink(
                    'Technology',
                    itImage,
                    '?pub_consultation=technology'
                )}
                {categoryLink(
                    'Sports & Fitness',
                    spImage,
                    '?pub_consultation=sport'
                )}
            </div>
            <div className={css.categories}>
                {categoryLink(
                    'Finance',
                    acImage,
                    '?pub_consultation=finance'
                )}
                {categoryLink(
                    'Fashion & Beauty',
                    faImage,
                    '?pub_consultation=fashion'
                )}
                {categoryLink(
                    'Education',
                    edImage,
                    '?pub_consultation=education'
                )}
                {categoryLink(
                    'Home & Housekeeping',
                    hoImage,
                    '?pub_consultation=home'
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