import React, { Component } from 'react';
import moment from 'moment';
import { object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './BookingCleaningForm.module.css';

class BookingCleaningForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numBedrooms: '',
      numBathrooms: '',
      date: moment(new Date())
        .add(1, 'd')
        .format('YYYY-MM-DD'),
      time: '08:00',
      postcode: '',
      email: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({
      numBedrooms: 1,
      numBathrooms: 1,
      date: moment(new Date())
        .add(1, 'd')
        .format('YYYY-MM-DD'),
      time: '08:00',
      postcode: '00-682',
      email: 'aleksandrakbailey@gmail.com',
    });
  }

  render() {
    const { rootClassName, className, services } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        <h1>
          <FormattedMessage id="BookingCleaningForm.title" />{' '}
        </h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="number"
            min="0"
            max="20"
            name="numBedrooms"
            placeholder="Number of bedrooms"
            value={this.state.numBedrooms}
            onChange={this.handleChange}
          />
          <input
            type="number"
            min="0"
            max="20"
            name="numBathrooms"
            placeholder="Number of bathrooms"
            value={this.state.numBathrooms}
            onChange={this.handleChange}
          />
          <input
            type="search"
            name="postcode"
            placeholder="Postcode"
            value={this.state.postcode}
            onChange={this.handleChange}
          />
          <input
            type="date"
            min={moment(new Date()).format('YYYY-MM-DD')}
            max={moment(new Date())
              .add(90, 'd')
              .format('YYYY-MM-DD')}
            name="date"
            value={this.state.date}
            onChange={this.handleChange}
          />
          <input
            type="time"
            min="07:00"
            max="20:00"
            name="time"
            value={this.state.time}
            onChange={this.handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <button>Submit!</button>
        </form>
      </div>
    );
  }
}

BookingCleaningForm.defaultProps = {
  rootClassName: null,
  className: null,
};

BookingCleaningForm.propTypes = {
  rootClassName: string,
  className: string,
};

export default BookingCleaningForm;
