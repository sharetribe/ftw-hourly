import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionCategories.css';

import hairImage from './images/hair.jpg';
import beautyImage from './images/beauty.jpg';
import nailsImage from './images/nails.jpg';
import massageImage from './images/massage.jpg';
import barbersImage from './images/barbers.jpg';
import aestheticsImage from './images/aesthetics.jpg';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const locationLink = (name, image, searchQuery) => {
  const nameText = <span className={css.locationName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.location}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.locationImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionCategories.listingsInCategories"
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

      <div className={css.locations}>
        {locationLink(
          'Hair',
          hairImage,
          '?address=London%2C%20Greater%20London%2C%20England%2C%20United%20Kingdom&bounds=51.669993%2C0.152641%2C51.384598%2C-0.35167'
        )}
        {locationLink(
          'Beauty',
          beautyImage,
          '?address=Manchester%2C%20Greater%20Manchester%2C%20England%2C%20United%20Kingdom&bounds=53.586199%2C-2.087698%2C53.348612%2C-2.52355'
        )}
        {locationLink(
          'Nails',
          nailsImage,
          '?address=Leeds%2C%20West%20Yorkshire%2C%20England%2C%20United%20Kingdom&bounds=53.955164%2C-1.161587%2C53.719309%2C-1.800362'
        )}
      </div>
<div className={css.locations}>
        {locationLink(
          'Massage & Spa',
          massageImage,
          '?address=London%2C%20Greater%20London%2C%20England%2C%20United%20Kingdom&bounds=51.669993%2C0.152641%2C51.384598%2C-0.35167'
        )}
        {locationLink(
          'Barbers',
          barbersImage,
          '?address=Manchester%2C%20Greater%20Manchester%2C%20England%2C%20United%20Kingdom&bounds=53.586199%2C-2.087698%2C53.348612%2C-2.52355'
        )}
        {locationLink(
          'Aesthetics',
          aestheticsImage,
          '?address=Leeds%2C%20West%20Yorkshire%2C%20England%2C%20United%20Kingdom&bounds=53.955164%2C-1.161587%2C53.719309%2C-1.800362'
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
