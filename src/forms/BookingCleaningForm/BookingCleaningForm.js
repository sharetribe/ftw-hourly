import React, { Component } from 'react';
import moment from 'moment';
import { object, string } from 'prop-types';
import { formatStartTimestampForSearch } from '../../util/dates';
import { FormattedMessage } from '../../util/reactIntl';
import { PrimaryButton } from '../../components';
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
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }
  // handleClick(evt) {
  //   console.log('Inside click');
  //   evt.preventDefault();
  //   this.props
  //     .onBookingSearchListings({
  //       // perPage: 100,
  //       startTime: formatStartTimestampForSearch(this.state.date, this.state.time),
  //       minDuration: 60,
  //     })
  //     .then(data => console.log(data));
  // }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    // Update the state with the info from the initial form
    this.props.enterInitialInfo(this.state);
    // Search listings
    this.props
      .onBookingSearchListings({
        // perPage: 100,
        startTime: formatStartTimestampForSearch(this.state.date, this.state.time),
        minDuration: 60,
      })
      .then(data => console.log(data));
    // Reset the state
    this.setState({
      numBedrooms: '',
      numBathrooms: '',
      date: moment(new Date())
        .add(1, 'd')
        .format('YYYY-MM-DD'),
      time: '08:00',
      postcode: '',
      email: '',
    });
  }

  render() {
    console.log(new Date(this.state.date).toISOString());
    const { rootClassName, className, services } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    // const submitButtonClasses = classNames(submitButtonWrapperClassName || css.submitButtonWrapper);
    const submitButtonClasses = classNames(css.submitButtonWrapper);

    return (
      <div className={classes}>
        <h1>
          <FormattedMessage id="BookingCleaningForm.title" />
        </h1>
        {/* <button onClick={this.handleClick}>Click</button> */}
        <form onSubmit={this.handleSubmit} className={css.BookingCleaningFormChild}>
          <div className={css.BookingCleaningFormRow}>
            <div className={css.BookingCleaningFormMultiBlock}>
              <input
                type="number"
                min="0"
                max="20"
                name="numBedrooms"
                placeholder="# Bedrooms"
                value={this.state.numBedrooms}
                onChange={this.handleChange}
              />
              <input
                type="number"
                min="0"
                max="20"
                name="numBathrooms"
                placeholder="# Bathrooms"
                value={this.state.numBathrooms}
                onChange={this.handleChange}
              />
            </div>
            <div className={css.BookingCleaningFormSingleBlock}>
              <input
                type="search"
                name="postcode"
                placeholder="Postcode"
                value={this.state.postcode}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className={css.BookingCleaningFormRow}>
            <div className={css.BookingCleaningFormMultiBlock}>
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
            </div>
            <div className={css.BookingCleaningFormSingleBlock}>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <p className={css.smallPrint}>
            <FormattedMessage id="BookingCleaningForm.youWontBeChargedInfo" />
          </p>
          <div className={submitButtonClasses}>
            <PrimaryButton type="submit">
              <FormattedMessage id="BookingCleaningForm.submit" />
            </PrimaryButton>
          </div>
        </form>
      </div>
    );
  }
}

BookingCleaningForm.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
};

BookingCleaningForm.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,
};

export default BookingCleaningForm;
