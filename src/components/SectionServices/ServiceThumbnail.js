import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './ServiceThumbnail.module.css';

const ServiceThumbnail = props => {
  const { rootClassName, className, serviceTitle, serviceText, serviceImg } = props;

  const classes = classNames(rootClassName || css.root, className);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className={css.serviceThumbnail}>
      <div className={css.icon}> {serviceImg}</div>
      <h2 className={css.serviceTitle}>{capitalizeFirstLetter(serviceTitle)}</h2>
    </div>
  );
};

ServiceThumbnail.defaultProps = {
  rootClassName: null,
  className: null,
  serviceTitle: '',
  serviceText: '',
  serviceImg: '',
};

ServiceThumbnail.propTypes = {
  rootClassName: string,
  className: string,
  serviceTitle: string,
  serviceText: string,
};

export default ServiceThumbnail;
