import React, { Component } from 'react';
import moment from 'moment';
const { v4: uuidv4 } = require('uuid');
import { object, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import { PrimaryButton } from '../../components';
import classNames from 'classnames';

import css from './BookingCleaningFormExtended.module.css';

class BookingCleaningFormExtended extends Component {
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
  }
  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  handleSubmit(evt) {
    evt.preventDefault();
    this.props.enterInitialInfo(this.state);
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
    const { rootClassName, className, services, frequencies, additionalServices } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    // const submitButtonClasses = classNames(submitButtonWrapperClassName || css.submitButtonWrapper);
    const submitButtonClasses = classNames(css.submitButtonWrapper);

    return (
      <div className={classes}>
        <form onSubmit={this.handleSubmit} className={css.BookingCleaningFormChild}>
          <section className={css.step}>
            <p className={css.stepTitle}>
              <span className={css.stepTitleNumber}>1</span>
              <FormattedMessage id="BookingCleaningFormExtended.step1" />
            </p>
            <div className={css.BookingCleaningFrequencySection}>
              {frequencies.map(elem => {
                return (
                  <div key={uuidv4()} className={css.BookingCleaningFrequency}>
                    {elem}
                  </div>
                );
              })}
            </div>
          </section>
          <section className={css.step}>
            <p className={css.stepTitle}>
              <span className={css.stepTitleNumber}>2</span>
              <FormattedMessage id="BookingCleaningFormExtended.step2" />
            </p>

            <div className={css.BookingCleaningAddonsSection}>
              {additionalServices.map(elem => {
                return (
                  <div key={uuidv4()}>
                    <div className={css.BookingCleaningAddon}></div>
                    {elem}
                  </div>
                );
              })}
            </div>
          </section>
          <section className={css.step}>
            <p className={css.stepTitle}>
              <span className={css.stepTitleNumber}>3</span>
              <FormattedMessage id="BookingCleaningFormExtended.step3" />
            </p>
          </section>
          <section className={css.step}>
            <p className={css.stepTitle}>
              <span className={css.stepTitleNumber}>4</span>
              <FormattedMessage id="BookingCleaningFormExtended.step4" />
            </p>
          </section>

          <p className={css.smallPrint}>
            <FormattedMessage id="BookingCleaningForm.youWontBeChargedInfo" />
          </p>
          <div className={submitButtonClasses}>
            <PrimaryButton type="submit">
              <FormattedMessage id="BookingCleaningFormExtended.submit" />
            </PrimaryButton>
          </div>
        </form>
      </div>
    );
  }
}

BookingCleaningFormExtended.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  frequencies: ['Weekly', 'Bi-weekly', 'Monthly', 'One-time'],
  additionalServices: ['Fridge', 'Windows', 'Oven', 'Cabinets', 'Laundry'],
};

BookingCleaningFormExtended.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,
};

export default BookingCleaningFormExtended;
