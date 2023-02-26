import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Logo.module.css';
import MobileLogoImage from './Local-Caddie-Booking-logo-2023-mobile.png';
import DesktopLogoImage from './Local-Caddie-Booking-logo-2023-desktop.png';

const Logo = props => {
  const { className, format, ...rest } = props;
  const isMobile = format !== 'desktop';
  const classes = classNames(className, { [css.logoMobile]: isMobile });
  const logoImage = isMobile ? MobileLogoImage : DesktopLogoImage;

  return (
    <img
      className={classes}
      src={logoImage}
      alt={"Local Caddie Booking Scotland"}
      {...rest}
    />
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
