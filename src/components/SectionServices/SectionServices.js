import React from 'react';
import { string } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import ServiceThumbnail from './ServiceThumbnail';

import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { propTypes } from '../../util/types';

import css from './SectionServices.module.css';

const SectionServices = props => {
  const { rootClassName, className, services } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionServices.title" />
      </div>

      <div className={css.body}>
        {Object.keys(services).map(function(key) {
          return <ServiceThumbnail key={key} serviceTitle={key} serviceImg={services[key]} />;
        })}
      </div>
    </div>
  );
};

SectionServices.defaultProps = {
  rootClassName: null,
  className: null,
  services: {
    cleaning: <FontAwesomeIcon icon={faImage} className="fa-8x" />,
    landscaping: <FontAwesomeIcon icon={faImage} className="fa-8x" />,
    plumbing: <FontAwesomeIcon icon={faImage} className="fa-8x" />,
  },
};

SectionServices.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionServices;
