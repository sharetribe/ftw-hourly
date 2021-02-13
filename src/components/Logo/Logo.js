import React from 'react';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';

import config from '../../config';
import DesktopLogoImage from './savante.png';
import MobileLogoImage from './savante.png';
import css from './Logo.module.css';

const Logo = props => {
  const { className, format, ...rest } = props;
  const isMobile = format !== 'desktop';
  // const isDesktop = format !== 'mobile';
  const classes = classNames(className, { [css.logoMobile]: isMobile });
  // const classes = classNames(className, { [css.logoDesktop]: isDesktop });
  const logoImage = isMobile ? MobileLogoImage : DesktopLogoImage;
  return (
    <img
      className={classes}
      src={logoImage}
      alt={config.siteTitle}
      {...rest}
    />
  );
};

Logo.defaultProps = {
  className: null,
  format: 'desktop',
};

Logo.propTypes = {
  className: string,
  format: oneOf(['desktop', 'mobile']),
};

export default Logo;