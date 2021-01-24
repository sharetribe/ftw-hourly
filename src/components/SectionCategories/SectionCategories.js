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
                    '?keywords=Health%20Practitioners&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'Legal Experts',
                    leImage,
                    '?keywords=Legal%20Experts&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'IT & Technology Gurus',
                    itImage,
                    '?keywords=IT%20&%20Technology%20Gurus&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'Sports & Fitness Instructors',
                    spImage,
                    '?keywords=Sports%20&%20Fitness%20Instructors&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
            </div>
            <div className={css.categories}>
                {categoryLink(
                    'Accountants & Financial Advisors',
                    acImage,
                    '?keywords=Accountants%20&%20Financial%20Advisors&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'Fashionistas & Beauticians',
                    faImage,
                    '?keywords=Fashionistas%20&%20Beauticians&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'Educators & Teachers',
                    edImage,
                    '?keywords=Educators%20&%20Teachers&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
                )}
                {categoryLink(
                    'Home Improvement & Housekeeping',
                    hoImage,
                    '?keywords=Home%20Improvement%20&%20Housekeeping&address=United%20States%20of%20America&bounds=71.540724%2C-66.885444%2C18.765563%2C-179.9'
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