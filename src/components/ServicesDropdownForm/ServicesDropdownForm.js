import React, { Component } from 'react';
import { object, string } from 'prop-types';
import classNames from 'classnames';

import css from './ServicesDropdownForm.module.css';

class ServicesDropdownForm extends Component {
  constructor(props) {
    super(props);
    // this.state = { service: 'cleaning' };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(evt) {
    // this.setState({
    //   [evt.target.name]: evt.target.value,
    // });
    this.props.changeService(evt.target.value);
  }
  render() {
    const { rootClassName, className, services } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        <form>
          {' '}
          <label htmlFor="service-select">Select a Service Type:</label>
          <select name="service" id="service-select" onChange={this.handleChange}>
            {console.log(services)}
            {Object.keys(services).map(function(key) {
              return (
                <option key={key} value={key}>
                  {services[key]}
                </option>
              );
            })}
          </select>
        </form>
      </div>
    );
  }
}

ServicesDropdownForm.defaultProps = {
  rootClassName: null,
  className: null,
  services: {
    cleaning: 'Cleaning',
    landscaping: 'Landscaping',
    plumbing: 'Plumbing',
  },
};

ServicesDropdownForm.propTypes = {
  rootClassName: string,
  className: string,
  services: object,
};

export default ServicesDropdownForm;
