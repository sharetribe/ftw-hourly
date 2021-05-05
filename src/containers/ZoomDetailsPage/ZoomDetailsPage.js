import React, { useEffect, useMemo, useState } from 'react';
import { bool, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { fetchCurrentUser, sendVerificationEmail } from '../../ducks/user.duck';
import {
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  Page,
  UserNav,
} from '../../components';
import { TopbarContainer } from '..';
import _ from 'lodash';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { saveContactDetails, saveContactDetailsClear, resetPassword } from './ZoomDetailsPage.duck';
import { getCurrentUserZoomInfo, disconnectCurrentUserZoom } from '../../util/api';
import useForceUpdate from 'use-force-update';
import css from './ZoomDetailsPage.module.css';

export const ContactDetailsPageComponent = props => {
  const {
    currentUser,
    currentUserListing,

    scrollingDisabled,

    intl,
  } = props;
  const [zoomInfo, setZoomInfo] = useState(null);
  const isConnectedZoom = useMemo(() => {
    if (_.get(currentUser, "attributes.profile.privateData['isConnectZoom']")) {
      return true;
    }
    return false;
  }, [currentUser]);

  const disconnect = () => {
    disconnectCurrentUserZoom().then(() => {
      console.log('reload');
      window.location.reload();
    });
  };
  useEffect(() => {
    if (isConnectedZoom && zoomInfo === null) {
      getCurrentUserZoomInfo().then(res => setZoomInfo(res));
    }
  }, [isConnectedZoom, zoomInfo]);
  const title = intl.formatMessage({ id: 'ZoomDetailsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer
            currentPage="ContactDetailsPage"
            desktopClassName={css.desktopTopbar}
            mobileClassName={css.mobileTopbar}
          />
          <UserNav selectedPageName="ContactDetailsPage" listing={currentUserListing} />
        </LayoutWrapperTopbar>
        <LayoutWrapperAccountSettingsSideNav currentTab="ZoomDetailsPage" />
        <LayoutWrapperMain>
          <div className={css.content}>
            <h1 className={css.title}>
              <FormattedMessage id="ZoomDetailsPage.heading" />
            </h1>
            {!isConnectedZoom && (
              <a href="https://zoom.us/oauth/authorize?response_type=code&client_id=LwI0TKTre7NVbkdZJktw&redirect_uri=https://savante.me/zoom">
                Connect Zoom
              </a>
            )}
            {/* {isConnectedZoom && <div> Thank you!. you have already connected zoom</div>} */}
            {zoomInfo && (
              <div>
                <p>
                  <span>Display Name</span>: {zoomInfo['first_name']} {zoomInfo['last_name']}
                </p>
                <p>
                  <span>Email</span>: {zoomInfo['email']}
                </p>
                <p>
                  <span>Timezone</span>: {zoomInfo['timezone']}
                </p>
              </div>
            )}

            {isConnectedZoom && <button onClick={disconnect}>Disconnect</button>}
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

ContactDetailsPageComponent.defaultProps = {
  saveEmailError: null,
  savePhoneNumberError: null,
  currentUser: null,
  sendVerificationEmailError: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

ContactDetailsPageComponent.propTypes = {
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  saveContactDetailsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentUserListing: propTypes.ownListing,
  contactDetailsChanged: bool.isRequired,
  onChange: func.isRequired,
  onSubmitContactDetails: func.isRequired,
  scrollingDisabled: bool.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    currentUser,
    currentUserListing,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  } = state.user;
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    contactDetailsChanged,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ContactDetailsPage;
  return {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    currentUserListing,
    contactDetailsChanged,
    scrollingDisabled: isScrollingDisabled(state),
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(saveContactDetailsClear()),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  onSubmitContactDetails: values => dispatch(saveContactDetails(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const ContactDetailsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ContactDetailsPageComponent);

ContactDetailsPage.loadData = () => {
  // Since verify email happens in separate tab, current user's data might be updated
  return fetchCurrentUser();
};

export default ContactDetailsPage;
