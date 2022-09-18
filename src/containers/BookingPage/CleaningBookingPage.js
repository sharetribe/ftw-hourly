import React from 'react';
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
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import css from './CleaningBookingPage.module.css';
// import image from './path/to/image.png';

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
      <h1>Book a Cleaning Hero</h1>
      {/* <img src={image} alt="My first ice cream." /> */}
    </StaticPage>
  );
};

export default CleaningBookingPage;
