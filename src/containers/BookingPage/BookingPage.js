import React, { Component } from 'react';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  Page,
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
import LandscapingBookingPage from '../../containers/BookingPage/LandscapingBookingPage';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { bookingSearchListings } from './BookingPage.duck';

import css from './BookingPage.module.css';
// import image from './path/to/image.png';

export class BookingPageComponent extends Component {
  render() {
    const { params } = this.props;
    if (params.service == 'cleaning') {
      var bookFormPage = <CleaningBookingPage bookingSearchListings={bookingSearchListings} />;
    } else if (params.service == 'landscaping') {
      var bookFormPage = <LandscapingBookingPage />;
    } else if (params.service == 'plumbing') {
      // let bookFormPage = <PlumbingBookingPage />
    }
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
            {bookFormPage}
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

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    bookingSearchInProgress,
    bookingSearchListingsError,
    bookingSearchParams,
  } = state.BookingPage;
  const pageListings = getListingsById(state, currentPageResultIds);

  return {
    listings: pageListings,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    bookingSearchInProgress,
    bookingSearchListingsError,
    bookingSearchParams,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onBookingSearchListings: searchParams => dispatch(bookingSearchListings(searchParams)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const BookingPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(BookingPageComponent);

export default BookingPage;
