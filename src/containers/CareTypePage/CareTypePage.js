import React from 'react';
import { bool, func, object, shape, string, oneOf } from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl } from '../../util/reactIntl';
import { connect } from 'react-redux';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  LISTING_PAGE_PARAM_TYPES,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  createSlug,
} from '../../util/urlHelpers';
import { LISTING_STATE_DRAFT, LISTING_STATE_PENDING_APPROVAL, propTypes } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import {
  stripeAccountClearError,
  getStripeConnectAccountLink,
} from '../../ducks/stripeConnectAccount.duck';
import { NamedRedirect, Page, EditListingFeaturesForm } from '../../components';

import {
  requestAddAvailabilityException,
  requestDeleteAvailabilityException,
  requestCreateListingDraft,
  requestPublishListingDraft,
  requestUpdateListing,
  requestImageUpload,
  updateImageOrder,
  removeListingImage,
  clearUpdatedTab,
  savePayoutDetails,
} from '../CreateProfilePage/CreateProfilePage.duck';

import css from './CareTypePage.module.css';

const { UUID } = sdkTypes;

const CAREGIVER = 'caregiver';
const EMPLOYER = 'employer';

// N.B. All the presentational content needs to be extracted to their own components
export const CareTypePageComponent = props => {
  const {
    currentUser,
    currentUserListing,
    currentUserListingFetched,
    createStripeAccountError,
    fetchInProgress,
    fetchStripeAccountError,
    getOwnListing,
    getAccountLinkError,
    getAccountLinkInProgress,
    history,
    intl,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    onCreateListingDraft,
    onPublishListingDraft,
    onUpdateListing,
    onImageUpload,
    onRemoveListingImage,
    onManageDisableScrolling,
    onPayoutDetailsFormSubmit,
    onPayoutDetailsFormChange,
    onGetStripeConnectAccountLink,
    onUpdateImageOrder,
    onChange,
    page,
    params,
    scrollingDisabled,
    allowOnlyOneListing,
    stripeAccountFetched,
    stripeAccount,
    updateStripeAccountError,
    onProfileImageUpload,
    onUpdateProfile,
    image,
    uploadInProgress,
  } = props;

  const { id, type, returnURLType } = params;

  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;

  const listingId = page.submittedListingId || (id ? new UUID(id) : null);
  const listing = getOwnListing(listingId);
  const currentListing = ensureOwnListing(listing);
  const { state: currentListingState } = currentListing.attributes;

  const isPastDraft = currentListingState && currentListingState !== LISTING_STATE_DRAFT;
  const shouldRedirect = isNewListingFlow && listingId && isPastDraft;

  const hasStripeOnboardingDataIfNeeded = returnURLType ? !!(currentUser && currentUser.id) : true;
  const showForm = hasStripeOnboardingDataIfNeeded && (isNewURI || currentListing.id);

  const redirectAfterDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
    const currentPathParams = {
      ...params,
      type: LISTING_PAGE_PARAM_TYPE_DRAFT,
      id: listingId,
    };
    const routes = routeConfiguration();

    // Replace current "new" path to "draft" path.
    // Browser's back button should lead to editing current draft instead of creating a new one.
    const draftURI = createResourceLocatorString('CreateProfilePage', routes, currentPathParams);
    console.log(draftURI);
    history.push(draftURI);
  };

  const handleSubmit = upsertValues => {
    onCreateListingDraft(upsertValues)
      .then(r => {
        // After successful saving of draft data, user should be redirected to Create Profile page
        redirectAfterDraftUpdate(r.data.data.id.uuid, params, history);
      })
      .catch(e => {
        if (passThrownErrors) {
          throw e;
        }
        // No need for extra actions
        // Error is logged in EditListingPage.duck file.
      });
  };

  if (shouldRedirect) {
    const isPendingApproval =
      currentListing && currentListingState === LISTING_STATE_PENDING_APPROVAL;

    // If page has already listingId (after submit) and current listings exist
    // redirect to listing page
    const listingSlug = currentListing ? createSlug(currentListing.attributes.title) : null;

    const redirectProps = isPendingApproval
      ? {
          name: 'ListingPageVariant',
          params: {
            id: listingId.uuid,
            slug: listingSlug,
            variant: LISTING_PAGE_PENDING_APPROVAL_VARIANT,
          },
        }
      : {
          name: 'ListingPage',
          params: {
            id: listingId.uuid,
            slug: listingSlug,
          },
        };

    return <NamedRedirect {...redirectProps} />;
  } else if (allowOnlyOneListing && isNewURI && currentUserListingFetched && currentUserListing) {
    // If we allow only one listing per provider, we need to redirect to correct listing.
    return (
      <NamedRedirect
        name=""
        params={{
          id: currentUserListing.id.uuid,
          slug: createSlug(currentUserListing.attributes.title),
          type: LISTING_PAGE_PARAM_TYPE_EDIT,
          tab: 'description',
        }}
      />
    );
  } else if (showForm) {
    const {
      createListingDraftError = null,
      publishListingError = null,
      updateListingError = null,
      showListingsError = null,
      uploadImageError = null,
      fetchExceptionsError = null,
      addExceptionError = null,
      deleteExceptionError = null,
    } = page;
    const errors = {
      createListingDraftError,
      updateListingError,
      showListingsError,
      fetchExceptionsError,
      addExceptionError,
      deleteExceptionError,
    };
    // TODO: is this dead code? (shouldRedirect is checked before)
    const newListingPublished =
      isDraftURI && currentListing && currentListingState !== LISTING_STATE_DRAFT;

    const updateInProgress = page.updateInProgress || page.createListingDraftInProgress;

    const submitButtonTranslationKey = 'CareTypePage.careTypesNextButton';
    const mess = intl.formatMessage({ id: submitButtonTranslationKey });

    const careTypesFeaturesLabel = intl.formatMessage({
      id: 'EditListingExperiencePanel.careTypesFormLabel',
    });

    const user = ensureCurrentUser(currentUser);

    const careTypes = user.publicData && user.publicData.careTypes;
    const initialValues = { careTypes };

    const userType = user.attributes.profile.publicData.userType;

    const formProps = {
      className: css.form,
      onChange,
      disabled,
      initialValues,
      ready,
      updateInProgress,
      fetchErrors: errors,
      intl,
    };

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperMain>
            <div className={css.content}>
              <EditListingFeaturesForm
                {...formProps}
                saveActionMsg={mess}
                onSubmit={values => {
                  const { careTypes = [] } = values;

                  const updatedValues = {
                    publicData: { careTypes },
                  };
                  handleSubmit(updatedValues);
                }}
                name="careTypes"
                label={careTypesFeaturesLabel}
                required={true}
              />
              <ProfileSettingsForm
                className={css.form}
                currentUser={currentUser}
                initialValues={{ firstName, lastName, bio, profileImage: user.profileImage }}
                profileImage={profileImage}
                onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
                uploadInProgress={uploadInProgress}
                updateInProgress={updateInProgress}
                uploadImageError={uploadImageError}
                updateProfileError={updateProfileError}
                onSubmit={handleSubmit}
              />
            </div>
          </LayoutWrapperMain>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

CareTypePageComponent.defaultProps = {
  createStripeAccountError: null,
  fetchStripeAccountError: null,
  getAccountLinkError: null,
  getAccountLinkInProgress: null,
  stripeAccountFetched: null,
  currentUser: null,
  stripeAccount: null,
  currentUserHasOrders: null,
  listing: null,
  listingDraft: null,
  notificationCount: 0,
  sendVerificationEmailError: null,
  currentUserListing: null,
  currentUserListingFetched: false,
};

CareTypePageComponent.propTypes = {
  createStripeAccountError: propTypes.error,
  fetchStripeAccountError: propTypes.error,
  getAccountLinkError: propTypes.error,
  getAccountLinkInProgress: bool,
  updateStripeAccountError: propTypes.error,
  currentUser: propTypes.currentUser,
  getOwnListing: func.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onGetStripeConnectAccountLink: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onPublishListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onPayoutDetailsFormChange: func.isRequired,
  onPayoutDetailsFormSubmit: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onRemoveListingImage: func.isRequired,
  onUpdateListing: func.isRequired,
  onChange: func.isRequired,
  page: object.isRequired,
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: string.isRequired,
    returnURLType: oneOf(STRIPE_ONBOARDING_RETURN_URL_TYPES),
  }).isRequired,
  stripeAccountFetched: bool,
  stripeAccount: object,
  scrollingDisabled: bool.isRequired,

  /* from withRouter */
  history: shape({
    push: func.isRequired,
  }).isRequired,

  /* from injectIntl */
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const page = state.CareTypePage;
  const { image, uploadInProgress } = state.ProfileSettingsPage;

  const {
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountInProgress,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
  } = state.stripeConnectAccount;

  const { currentUser, currentUserListing, currentUserListingFetched } = state.user;

  const fetchInProgress = createStripeAccountInProgress;

  const getOwnListing = id => {
    const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);

    return listings.length === 1 ? listings[0] : null;
  };
  return {
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
    currentUser,
    currentUserListing,
    currentUserListingFetched,
    fetchInProgress,
    getOwnListing,
    page,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onAddAvailabilityException: params => dispatch(requestAddAvailabilityException(params)),
  onDeleteAvailabilityException: params => dispatch(requestDeleteAvailabilityException(params)),
  onUpdateListing: (tab, values) => dispatch(requestUpdateListing(tab, values)),
  onCreateListingDraft: values => dispatch(requestCreateListingDraft(values)),
  onPublishListingDraft: listingId => dispatch(requestPublishListingDraft(listingId)),
  onImageUpload: data => dispatch(requestImageUpload(data)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onPayoutDetailsFormChange: () => dispatch(stripeAccountClearError()),
  onPayoutDetailsFormSubmit: (values, isUpdateCall) =>
    dispatch(savePayoutDetails(values, isUpdateCall)),
  onGetStripeConnectAccountLink: params => dispatch(getStripeConnectAccountLink(params)),
  onUpdateImageOrder: imageOrder => dispatch(updateImageOrder(imageOrder)),
  onRemoveListingImage: imageId => dispatch(removeListingImage(imageId)),
  onChange: () => dispatch(clearUpdatedTab()),
  onProfileImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const CareTypePage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(injectIntl(CareTypePageComponent));

export default CareTypePage;
