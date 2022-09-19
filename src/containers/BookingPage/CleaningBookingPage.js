import React from 'react';
import { BookingCleaningForm } from '../../forms';
import { FormattedMessage } from '../../util/reactIntl';

import StaticPage from '../../containers/StaticPage/StaticPage';

import css from './CleaningBookingPage.module.css';

const CleaningBookingPage = () => {
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
      <BookingCleaningForm />
      <h2>
        <FormattedMessage id="CleaningBookingPage.title" />
      </h2>
      <h3>
        <FormattedMessage id="CleaningBookingPage.subTitle" />
      </h3>
    </StaticPage>
  );
};

export default CleaningBookingPage;
