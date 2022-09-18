import React from 'react';
import { object, string } from 'prop-types';
import classNames from 'classnames';

import css from './ServicesDropdown.module.css';

const ServicesDropdown = props => {
  const { rootClassName, className, services } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <label for="service-select">Select a Service Type:</label>
      <select name="services" id="service-select">
        {console.log(services)}
        {Object.keys(services).map(function(key) {
          return <option value={key}>{services[key]}</option>;
        })}
      </select>
    </div>
  );
};

ServicesDropdown.defaultProps = {
  rootClassName: null,
  className: null,
  services: {
    cleaning: 'Cleaning',
    landscaping: 'Landscaping',
    plumbing: 'Plumbing',
  },
};

ServicesDropdown.propTypes = {
  rootClassName: string,
  className: string,
  services: object,
};

export default ServicesDropdown;
