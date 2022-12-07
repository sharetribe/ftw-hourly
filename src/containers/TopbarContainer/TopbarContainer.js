import React from 'react';
import { array, bool, func, number, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { propTypes } from '../../util/types';
import { sendVerificationEmail, hasCurrentUserErrors } from '../../ducks/user.duck';
import { logout, authenticationInProgress } from '../../ducks/Auth.duck';
import { manageDisableScrolling } from '../../ducks/UI.duck';
import { changeModalValue } from './TopbarContainer.duck';
import { Topbar } from '../../components';

export const TopbarContainerComponent = props => {
  const {
    authInProgress,
    currentPage,
    currentSearchParams,
    currentUser,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    currentUserHasOrders,
    history,
    isAuthenticated,
    authScopes,
    hasGenericError,
    location,
    notifications,
    onLogout,
    onManageDisableScrolling,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    onResendVerificationEmail,
    modalValue,
    onChangeModalValue,
    ...rest
  } = props;

  return (
    <Topbar
      authInProgress={authInProgress}
      currentPage={currentPage}
      currentSearchParams={currentSearchParams}
      currentUser={currentUser}
      currentUserHasListings={currentUserHasListings}
      currentUserListing={currentUserListing}
      currentUserListingFetched={currentUserListingFetched}
      currentUserHasOrders={currentUserHasOrders}
      history={history}
      isAuthenticated={isAuthenticated}
      authScopes={authScopes}
      location={location}
      notification={notifications}
      onLogout={onLogout}
      onManageDisableScrolling={onManageDisableScrolling}
      onResendVerificationEmail={onResendVerificationEmail}
      sendVerificationEmailInProgress={sendVerificationEmailInProgress}
      sendVerificationEmailError={sendVerificationEmailError}
      showGenericError={hasGenericError}
      modalValue={modalValue}
      onChangeModalValue={onChangeModalValue}
      {...rest}
    />
  );
};

TopbarContainerComponent.defaultProps = {
  currentPage: null,
  currentSearchParams: null,
  currentUser: null,
  currentUserHasOrders: null,
  notificationCount: 0,
  sendVerificationEmailError: null,
  currentUserListing: null,
  authScopes: null,
  modalValue: null,
};

TopbarContainerComponent.propTypes = {
  authInProgress: bool.isRequired,
  currentPage: string,
  currentSearchParams: object,
  currentUser: propTypes.currentUser,
  currentUserHasListings: bool.isRequired,
  currentUserListingFetched: bool.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserHasOrders: bool,
  isAuthenticated: bool.isRequired,
  authScopes: array,
  notificationCount: number,
  onLogout: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,
  onChangeModalValue: func.isRequired,
  hasGenericError: bool.isRequired,
  modalValue: string,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({ state: object }).isRequired,
};

const mapStateToProps = state => {
  // Topbar needs isAuthenticated
  const { isAuthenticated, logoutError, authScopes } = state.Auth;

  const { modalValue } = state.TopbarContainer;

  // Topbar needs user info.
  const {
    currentUser,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    currentUserHasOrders,
    currentUserNotifications: notifications,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  } = state.user;
  const hasGenericError = !!(logoutError || hasCurrentUserErrors(state));
  return {
    authInProgress: authenticationInProgress(state),
    currentUser,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    currentUserHasOrders,
    notifications,
    isAuthenticated,
    authScopes,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    hasGenericError,
    modalValue,
  };
};

const mapDispatchToProps = dispatch => ({
  onLogout: historyPush => dispatch(logout(historyPush)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  onChangeModalValue: value => dispatch(changeModalValue(value)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const TopbarContainer = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TopbarContainerComponent);

export default TopbarContainer;
