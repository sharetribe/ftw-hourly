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

import css from './LandscapingBookingPage.module.css';
// import image from './path/to/image.png';

const LandscapingBookingPage = () => {
  return (
    <StaticPage
      className={css.root}
      title="Book a Landscaping Hero"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'LandscapingBookingPage',
        description: 'Page to book landscaping services',
        name: 'Landscaping booking page',
      }}
    >
      <h1>Book a Landscaping Hero</h1>
      {/* <img src={image} alt="My first ice cream." /> */}
    </StaticPage>
  );
};

export default LandscapingBookingPage;
