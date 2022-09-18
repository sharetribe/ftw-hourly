import React, { Component } from 'react';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
  ExternalLink,
} from '../../components';

import StaticPage from '../../containers/StaticPage/StaticPage';
import CleaningBookingPage from '../../containers/BookingPage/CleaningBookingPage';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import css from './BookingPage.module.css';
// import image from './path/to/image.png';

class BookingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { service: 'Cleaning' };
  }
  render() {
    return (
      <StaticPage
        className={css.root}
        title="Book a Hero"
        schema={{
          '@context': 'http://schema.org',
          '@type': 'BookingPage',
          description: 'Page to book services',
          name: 'Booking page',
        }}
      >
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            {/* {if (this.state.service == 'Cleaning') <CleaningBookingPage />} */}
            <CleaningBookingPage />
            <div>
              <NamedLink name="LandingPage">Go to home page</NamedLink> or
              <ExternalLink href="https://google.com">Go to Google</ExternalLink>
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </StaticPage>
    );
  }
}

export default BookingPage;
