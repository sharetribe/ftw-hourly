import React, { Component } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHouse, faCalendar, faRotate, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faHouse,
  faCalendar,
  faRotate,
  faCircleCheck,
  faRibbon,
  faClipboardCheck,
  faSprayCanSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { BookingCleaningForm, BookingCleaningFormExtended } from '../../forms';
import { FormattedMessage } from '../../util/reactIntl';

import StaticPage from '../../containers/StaticPage/StaticPage';

import css from './CleaningBookingPage.module.css';

class CleaningBookingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialStage: true,
      initialInfo: {
        numBedrooms: '',
        numBathrooms: '',
        date: moment(new Date())
          .add(1, 'd')
          .format('YYYY-MM-DD'),
        time: '08:00',
        postcode: '',
        email: '',
      },
      frequency: 'Bi-weekly',
      additionalServices: {
        fridge: false,
        windows: false,
        oven: false,
        cabinets: false,
        laundry: false,
      },
    };
    this.enterInitialInfo = this.enterInitialInfo.bind(this);
    this.enterFrequencyInfo = this.enterFrequencyInfo.bind(this);
  }
  enterInitialInfo(infoFromStep1) {
    this.setState({ initialInfo: infoFromStep1, initialStage: false });
  }

  enterFrequencyInfo(freq) {
    this.setState({ frequency: freq });
  }
  render() {
    return (
      <StaticPage
        className={css.root}
        title="Book a Cleaning Hero"
        schema={{
          '@context': 'http://schema.org',
          '@type': 'CleaningBookingPage',
          description: 'Page to book cleaning services',
          name: 'Cleaning booking page',
        }}
      >
        {this.state.initialStage ? (
          <div className={css.heroContainer}>
            <div className={css.heroContent}>
              <BookingCleaningForm enterInitialInfo={this.enterInitialInfo} />
            </div>
          </div>
        ) : (
          <div>
            <div className={css.CleaningBookingPageMain}>
              <BookingCleaningFormExtended enterFrequencyInfo={this.enterFrequencyInfo} />
            </div>
            <div className={css.CleaningBookingPageRightPanel}>
              <div className={css.CleaningBookingPageSummary}>
                <h4>Booking Summary</h4>
                <div>
                  <p>
                    <FontAwesomeIcon icon={faHouse} /> Home Cleaning{' '}
                  </p>
                  <p id="cleaningBookingPageSmallDetails">
                    {this.state.initialInfo.numBedrooms || 0} bed,
                    {' ' + this.state.initialInfo.numBathrooms || 0} bath
                  </p>
                </div>
                <div>
                  <FontAwesomeIcon icon={faCalendar} /> {this.state.initialInfo.date},{' '}
                  {this.state.initialInfo.time}
                </div>
                <div>
                  <FontAwesomeIcon icon={faRotate} /> {this.state.frequency}
                </div>
                <div>
                  <FontAwesomeIcon icon={faCircleCheck} /> Cancel Anytime
                </div>
                <div>
                  <p>Per Cleaning</p>
                  <span></span>
                  <p>Hero Service Fee</p>
                  <span></span>
                </div>
                <hr />
                <div>
                  <p>Today's Total</p>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={css.CleaningBookingPageAdditionalInfo}>
                <p>
                  <FontAwesomeIcon icon={faRibbon} /> Quality Guarantee
                </p>
                <p>
                  <FontAwesomeIcon icon={faClipboardCheck} /> Pre-screened Cleaner
                </p>
                <p>
                  <FontAwesomeIcon icon={faSprayCanSparkles} /> Supplies Included
                </p>
              </div>
            </div>
          </div>
        )}

        <h2>
          <FormattedMessage id="CleaningBookingPage.title" />
        </h2>
        <h3>
          <FormattedMessage id="CleaningBookingPage.subTitle" />
        </h3>
      </StaticPage>
    );
  }
}

export default CleaningBookingPage;
