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
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { LISTING_STATE_DRAFT, LISTING_STATE_PENDING_APPROVAL, propTypes } from '../../util/types';
import { ensureOwnListing, ensureCurrentUser } from '../../util/data';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { NamedRedirect, Page } from '../../components';
import { EditListingFeaturesForm } from '../../forms';

import {
  requestAddAvailabilityException,
  requestDeleteAvailabilityException,
  requestCreateListingDraft,
  requestUpdateListing,
  clearUpdatedTab,
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
    getOwnListing,
    history,
    intl,
    onCreateListingDraft,
    onUpdateListing,
    onChange,
    createProfilePage,
    params,
    scrollingDisabled,
    allowOnlyOneListing,
  } = props;

  const { id, type, returnURLType } = params;

  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW;
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT;
  const isNewListingFlow = isNewURI || isDraftURI;

  const listingId = createProfilePage.submittedListingId || (id ? new UUID(id) : null);
  const listing = getOwnListing(listingId);
  const currentListing = ensureOwnListing(listing);
  const { state: currentListingState } = currentListing.attributes;

  const isPastDraft = currentListingState && currentListingState !== LISTING_STATE_DRAFT;
  const shouldRedirect = isNewListingFlow && listingId && isPastDraft;

  const hasStripeOnboardingDataIfNeeded = returnURLType ? !!(currentUser && currentUser.id) : true;
  const showForm = hasStripeOnboardingDataIfNeeded && (isNewURI || currentListing.id);

  const user = ensureCurrentUser(currentUser);
  const userType = user.attributes?.profile?.publicData?.userType;

  const redirectAfterDraftUpdate = (listingId, params, history) => {
    const currentPathParams = {
      ...params,
      type: LISTING_PAGE_PARAM_TYPE_DRAFT,
      id: listingId,
      // Change depending on user type
      tab: 'bio',
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
        throw e;
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
      updateListingError = null,
      showListingsError = null,
      fetchExceptionsError = null,
      addExceptionError = null,
      deleteExceptionError = null,
    } = createProfilePage;
    const errors = {
      createListingDraftError,
      updateListingError,
      showListingsError,
      fetchExceptionsError,
      addExceptionError,
      deleteExceptionError,
    };

    const updateInProgress =
      createProfilePage.updateInProgress || createProfilePage.createListingDraftInProgress;

    const submitButtonTranslationKey = 'CareTypePage.careTypesNextButton';
    const mess = intl.formatMessage({ id: submitButtonTranslationKey });

    const careTypesFeaturesLabel = intl.formatMessage(
      userType === 'caregiver'
        ? { id: 'CareTypePage.caregiverFormLabel' }
        : { id: 'CareTypePage.employerFormLabel' }
    );

    const careTypes = user.publicData && user.publicData.careTypes;
    const initialValues = { careTypes };

    const formProps = {
      className: css.form,
      onChange,
      initialValues,
      updateInProgress,
      fetchErrors: errors,
      intl,
    };

    const title = isNewListingFlow
      ? intl.formatMessage({ id: 'CreateProfilePage.titleCreateListing' })
      : intl.formatMessage({ id: 'CreateProfilePage.titleEditListing' });

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <div className={css.content}>
          <EditListingFeaturesForm
            {...formProps}
            rootClassName={css.form}
            saveActionMsg={mess}
            onSubmit={values => {
              const { careTypes = [] } = values;

              const updatedValues = {
                title: 'Title',
                publicData: { careTypes },
              };
              handleSubmit(updatedValues);
            }}
            name="careTypes"
            label={careTypesFeaturesLabel}
            required={true}
            disabled={false}
            ready={false}
            updated={false}
          />
        </div>
      </Page>
    );
  }
};

CareTypePageComponent.defaultProps = {
  stripeAccountFetched: null,
  currentUser: null,
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
  onCreateListingDraft: func.isRequired,
  onUpdateListing: func.isRequired,
  onChange: func.isRequired,
  createProfilePage: object.isRequired,
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
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
  const createProfilePage = state.CreateProfilePage;

  const { currentUser, currentUserListing, currentUserListingFetched } = state.user;

  const getOwnListing = id => {
    const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);

    return listings.length === 1 ? listings[0] : null;
  };
  return {
    currentUser,
    currentUserListing,
    currentUserListingFetched,
    getOwnListing,
    createProfilePage,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onAddAvailabilityException: params => dispatch(requestAddAvailabilityException(params)),
  onDeleteAvailabilityException: params => dispatch(requestDeleteAvailabilityException(params)),
  onUpdateListing: (tab, values) => dispatch(requestUpdateListing(tab, values)),
  onCreateListingDraft: values => dispatch(requestCreateListingDraft(values)),
  onChange: () => dispatch(clearUpdatedTab()),
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
