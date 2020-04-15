import React from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LogoImage from './saunatime-logo.png';
import css from './Logo.css';

const Logo = props => {
  const { className, format, ...rest } = props;
  const mobileClasses = classNames(css.logoMobile, className);

  return (
    <img className={className} src={LogoImage} alt={config.siteTitle} {...rest} />
  );
};

const { oneOf, string } = PropTypes;

Logo.defaultProps = {
  className: null,
  format: 'desktop',
};

Logo.propTypes = {
  className: string,
  format: oneOf(['desktop', 'mobile']),
};

export default Logo;
