import React, { Component, useEffect } from 'react';
import { array, bool, func, number, object, oneOf, shape, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { withViewport } from '../../util/contextHelpers';
import { propTypes } from '../../util/types';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../util/urlHelpers';
import {
  ensureCurrentUser,
  ensureListing,
  ensureStripeCustomer,
  ensurePaymentMethodCard,
} from '../../util/data';
import { EMAIL_VERIFICATION } from '../ModalMissingInformation/ModalMissingInformation';

import { Modal, NamedRedirect, Tabs } from '..';
import { PaymentMethodsForm } from '../../forms';

import EditListingWizardTab, {
  CARETYPES,
  AVAILABILITY,
  LOCATION,
  PRICING,
  CARE_RECEIVER_DETAILS,
  CAREGIVER_DETAILS,
  PROFILE_PICTURE,
} from '../EditListingWizardTab/EditListingWizardTab';
import css from './EmployerEditListingWizard.module.css';

// Show availability calendar only if environment variable availabilityEnabled is true
const availabilityMaybe = config.enableAvailability ? [AVAILABILITY] : [];

// You can reorder these panels.
// Note 1: You need to change save button translations for new listing flow
// Note 2: Ensure that draft listing is created after the first panel
// and listing publishing happens after last panel.
// Note 3: in FTW-hourly template we don't use the POLICY tab so it's commented out.
// If you want to add a free text field to your listings you can enable the POLICY tab
export const TABS = [
  CARETYPES,
  LOCATION,
  PRICING,
  ...availabilityMaybe,
  CARE_RECEIVER_DETAILS,
  CAREGIVER_DETAILS,
  PROFILE_PICTURE,
];

// Tabs are horizontal in small screens
const MAX_HORIZONTAL_NAV_SCREEN_WIDTH = 1023;

const STRIPE_ONBOARDING_RETURN_URL_SUCCESS = 'success';
const STRIPE_ONBOARDING_RETURN_URL_FAILURE = 'failure';

const tabLabel = (intl, tab) => {
  let key = null;
  if (tab === CARETYPES) {
    key = 'EmployerEditListingWizard.tabLabelCareTypes';
  } else if (tab === LOCATION) {
    key = 'EmployerEditListingWizard.tabLabelLocation';
  } else if (tab === PRICING) {
    key = 'EmployerEditListingWizard.tabLabelPricing';
  } else if (tab === AVAILABILITY) {
    key = 'EmployerEditListingWizard.tabLabelAvailability';
  } else if (tab === CARE_RECEIVER_DETAILS) {
    key = 'EmployerEditListingWizard.tabLabelCareRecipientDetails';
  } else if (tab === CAREGIVER_DETAILS) {
    key = 'EmployerEditListingWizard.tabLabelCaregiverDetails';
  } else if (tab === PROFILE_PICTURE) {
    key = 'EmployerEditListingWizard.tabLabelProfilePicture';
  }

  return intl.formatMessage({ id: key });
};

/**
 * Check if a wizard tab is completed.
 *
 * @param tab wizard's tab
 * @param listing is contains some specific data if tab is completed
 *
 * @return true if tab / step is completed.
 */
const tabCompleted = (tab, listing) => {
  const { availabilityPlan, description, geolocation, title, publicData } = listing.attributes;

  switch (tab) {
    case CARETYPES:
      return !!(publicData && publicData.careTypes);
    case LOCATION:
      return !!(geolocation && publicData && publicData.location);
    case PRICING:
      return !!(publicData && publicData.rates);
    case AVAILABILITY:
      return !!(publicData && publicData.availabilityPlan);
    case CARE_RECEIVER_DETAILS:
      return !!(
        publicData &&
        publicData.recipientRelationship &&
        publicData.gender &&
        publicData.age &&
        publicData.recipientDetails
      );
    case CAREGIVER_DETAILS:
      return !!(publicData && publicData.idealCaregiverDetails);
    case PROFILE_PICTURE:
      return !!(images && images.length > 0);
    default:
      return false;
  }
};

/**
 * Check which wizard tabs are active and which are not yet available. Tab is active if previous
 * tab is completed. In edit mode all tabs are active.
 *
 * @param isNew flag if a new listing is being created or an old one being edited
 * @param listing data to be checked
 *
 * @return object containing activity / editability of different tabs of this wizard
 */
const tabsActive = (isNew, listing) => {
  return TABS.reduce((acc, tab) => {
    const previousTabIndex = TABS.findIndex(t => t === tab) - 1;
    const isActive =
      previousTabIndex >= 0 ? !isNew || tabCompleted(TABS[previousTabIndex], listing) : true;
    return { ...acc, [tab]: isActive };
  }, {});
};

const scrollToTab = (tabPrefix, tabId) => {
  const el = document.querySelector(`#${tabPrefix}_${tabId}`);
  if (el) {
    el.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }
};

const RedirectToStripe = ({ redirectFn }) => {
  useEffect(redirectFn('custom_account_verification'), []);
  return <FormattedMessage id="EmployerEditListingWizard.redirectingToStripe" />;
};

// Create a new or edit listing through EmployerEditListingWizard
class EmployerEditListingWizard extends Component {
  constructor(props) {
    super(props);

    // Having this info in state would trigger unnecessary rerendering
    this.hasScrolledToTab = false;

    this.state = {
      draftId: null,
      showPayoutDetails: false,
      portalRoot: null,
      isSubmittingPayment: false,
      cardState: null,
    };
    this.handleCreateFlowTabScrolling = this.handleCreateFlowTabScrolling.bind(this);
    this.handlePublishListing = this.handlePublishListing.bind(this);
    this.handlePayoutModalClose = this.handlePayoutModalClose.bind(this);
    this.handlePayoutSubmit = this.handlePayoutSubmit.bind(this);
    this.handlePaymentMethodsSubmit = this.handlePaymentMethodsSubmit.bind(this);
    this.getClientSecret = this.getClientSecret.bind(this);
    this.getPaymentParams = this.getPaymentParams.bind(this);
  }

  handleCreateFlowTabScrolling(shouldScroll) {
    this.hasScrolledToTab = shouldScroll;
  }

  handlePublishListing(id) {
    const { onPublishListingDraft, currentUser, onChangeMissingInfoModal, history } = this.props;

    const hasDefaultPaymentMethod =
      currentUser && currentUser.stripeCustomer && currentUser.stripeCustomer.defaultPaymentMethod;

    onPublishListingDraft(id);

    if (
      currentUser &&
      !currentUser.attributes.emailVerified &&
      !history.location.pathname.includes('create-profile')
    ) {
      onChangeMissingInfoModal(EMAIL_VERIFICATION);
    } else if (!!!hasDefaultPaymentMethod) {
      this.setState({
        draftId: id,
        showPayoutDetails: true,
      });
    } else if (history.location.pathname.includes('create-profile')) {
      history.push('/signup');
    }
  }

  handlePayoutModalClose() {
    const { history } = this.props;

    this.setState({ showPayoutDetails: false });
    if (history.location.pathname.includes('create-profile')) {
      history.push('/signup');
    } else {
      history.push('/l');
    }
  }

  // TODO: Change for payment methods
  handlePayoutSubmit(values) {
    this.props
      .onPayoutDetailsSubmit(values)
      .then(response => {
        this.props.onManageDisableScrolling('EmployerEditListingWizard.payoutModal', false);
      })
      .catch(() => {
        // do nothing
      });
  }

  getClientSecret(setupIntent) {
    return setupIntent && setupIntent.attributes ? setupIntent.attributes.clientSecret : null;
  }
  getPaymentParams(currentUser, formValues) {
    const { name, addressLine1, addressLine2, postal, state, city, country } = formValues;
    const addressMaybe =
      addressLine1 && postal
        ? {
            address: {
              city: city,
              country: country,
              line1: addressLine1,
              line2: addressLine2,
              postal_code: postal,
              state: state,
            },
          }
        : {};
    const billingDetails = {
      name,
      email: ensureCurrentUser(currentUser).attributes.email,
      ...addressMaybe,
    };

    const paymentParams = {
      payment_method_data: {
        billing_details: billingDetails,
      },
    };

    return paymentParams;
  }

  handlePaymentMethodsSubmit(params) {
    const {
      onCreateSetupIntent,
      currentUser,
      onHandleCardSetup,
      onSavePaymentMethod,
      fetchStripeCustomer,
      history,
    } = this.props;

    this.setState({ isSubmittingPayment: true });
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const stripeCustomer = ensuredCurrentUser.stripeCustomer;
    const { stripe, card, formValues } = params;

    onCreateSetupIntent()
      .then(setupIntent => {
        const stripeParams = {
          stripe,
          card,
          setupIntentClientSecret: this.getClientSecret(setupIntent),
          paymentParams: this.getPaymentParams(currentUser, formValues),
        };

        return onHandleCardSetup(stripeParams);
      })
      .then(result => {
        const newPaymentMethod = result.setupIntent.payment_method;
        // Note: stripe.handleCardSetup might return an error inside successful call (200), but those are rejected in thunk functions.

        return onSavePaymentMethod(stripeCustomer, newPaymentMethod);
      })
      .then(() => {
        // Update currentUser entity and its sub entities: stripeCustomer and defaultPaymentMethod
        fetchStripeCustomer();
        this.setState({ isSubmittingPayment: false });
        this.setState({ cardState: 'default' });

        if (history.location.pathname.includes('create-profile')) {
          history.push('/signup');
        } else {
          history.push('/l');
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isSubmittingPayment: false });
      });
  }

  render() {
    const {
      id,
      className,
      rootClassName,
      params,
      listing,
      viewport,
      intl,
      errors,
      fetchInProgress,
      onManageDisableScrolling,
      currentUser,
      pageName,
      profileImage,
      onProfileImageUpload,
      onUpdateProfile,
      uploadInProgress,
      handleCardSetupError,
      addPaymentMethodError,
      createStripeCustomerError,
      ...rest
    } = this.props;

    const selectedTab = params.tab;
    const isNewListingFlow = [LISTING_PAGE_PARAM_TYPE_NEW, LISTING_PAGE_PARAM_TYPE_DRAFT].includes(
      params.type
    );
    const rootClasses = rootClassName || css.root;
    const classes = classNames(rootClasses, className);
    const currentListing = ensureListing(listing);
    const tabsStatus = tabsActive(isNewListingFlow, currentListing);

    // If selectedTab is not active, redirect to the beginning of wizard
    if (!tabsStatus[selectedTab]) {
      const currentTabIndex = TABS.indexOf(selectedTab);
      const nearestActiveTab = TABS.slice(0, currentTabIndex)
        .reverse()
        .find(t => tabsStatus[t]);

      return (
        <NamedRedirect
          name={pageName || 'EditListingPage'}
          params={{ ...params, tab: nearestActiveTab }}
        />
      );
    }

    const { width } = viewport;
    const hasViewport = width > 0;
    const hasHorizontalTabLayout = hasViewport && width <= MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
    const hasVerticalTabLayout = hasViewport && width > MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
    const hasFontsLoaded =
      hasViewport && document.documentElement.classList.contains('fontsLoaded');

    // Check if scrollToTab call is needed (tab is not visible on mobile)
    if (hasVerticalTabLayout) {
      this.hasScrolledToTab = true;
    } else if (hasHorizontalTabLayout && !this.hasScrolledToTab && hasFontsLoaded) {
      const tabPrefix = id;
      scrollToTab(tabPrefix, selectedTab);
      this.hasScrolledToTab = true;
    }

    const tabLink = tab => {
      return { name: pageName || 'EditListingPage', params: { ...params, tab } };
    };

    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const currentUserLoaded = !!ensuredCurrentUser.id;

    const rootURL = config.canonicalRootURL;
    const routes = routeConfiguration();
    const { returnURLType, ...pathParams } = params;

    const userName = currentUserLoaded
      ? `${ensuredCurrentUser.attributes.profile.firstName} ${ensuredCurrentUser.attributes.profile.lastName}`
      : null;

    const initalValuesForStripePayment = { name: userName };

    const hasDefaultPaymentMethod =
      currentUser &&
      ensureStripeCustomer(currentUser.stripeCustomer).attributes.stripeCustomerId &&
      ensurePaymentMethodCard(currentUser.stripeCustomer.defaultPaymentMethod).id;

    return (
      <div className={classes}>
        <Tabs
          rootClassName={css.tabsContainer}
          navRootClassName={css.nav}
          tabRootClassName={css.tab}
        >
          {TABS.map(tab => {
            return (
              <EditListingWizardTab
                {...rest}
                key={tab}
                tabId={`${id}_${tab}`}
                tabLabel={tabLabel(intl, tab)}
                tabLinkProps={tabLink(tab)}
                selected={selectedTab === tab}
                disabled={isNewListingFlow && !tabsStatus[tab]}
                tab={tab}
                intl={intl}
                params={params}
                listing={listing}
                marketplaceTabs={TABS}
                errors={errors}
                handleCreateFlowTabScrolling={this.handleCreateFlowTabScrolling}
                handlePublishListing={this.handlePublishListing}
                fetchInProgress={fetchInProgress}
                onManageDisableScrolling={onManageDisableScrolling}
                pageName={pageName}
                profileImage={profileImage}
                currentUser={currentUser}
                onProfileImageUpload={onProfileImageUpload}
                uploadInProgress={uploadInProgress}
                onUpdateProfile={onUpdateProfile}
              />
            );
          })}
        </Tabs>
        <Modal
          id="EmployerEditListingWizard.payoutModal"
          isOpen={this.state.showPayoutDetails}
          onClose={this.handlePayoutModalClose}
          onManageDisableScrolling={onManageDisableScrolling}
          usePortal
        >
          <div className={css.modalPayoutDetailsWrapper}>
            <h1 className={css.modalTitle}>
              <FormattedMessage id="EmployerEditListingWizard.payoutModalTitleOneMoreThing" />
              <br />
              <FormattedMessage id="EmployerEditListingWizard.payoutModalTitlePayoutPreferences" />
            </h1>
            {!currentUserLoaded ? (
              <FormattedMessage id="StripePayoutPage.loadingData" />
            ) : (
              <>
                <p className={css.modalMessage}>
                  <FormattedMessage id="EmployerEditListingWizard.payoutModalInfo" />
                </p>
                <PaymentMethodsForm
                  className={css.paymentForm}
                  formId="PaymentMethodsForm"
                  initialValues={initalValuesForStripePayment}
                  onSubmit={this.handlePaymentMethodsSubmit}
                  hasDefaultPaymentMethod={hasDefaultPaymentMethod}
                  addPaymentMethodError={addPaymentMethodError}
                  createStripeCustomerError={createStripeCustomerError}
                  handleCardSetupError={handleCardSetupError}
                  inProgress={this.state.isSubmittingPayment}
                />
              </>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

EmployerEditListingWizard.defaultProps = {
  className: null,
  currentUser: null,
  rootClassName: null,
  listing: null,
  pageName: 'EditListingPage',
};

EmployerEditListingWizard.propTypes = {
  id: string.isRequired,
  className: string,
  currentUser: propTypes.currentUser,
  rootClassName: string,
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(TABS).isRequired,
  }).isRequired,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  errors: shape({
    createListingDraftError: object,
    updateListingError: object,
    publishListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,

  fetchInProgress: bool.isRequired,
  onManageDisableScrolling: func.isRequired,

  // from withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
  profileImage: object,
};

export default compose(withViewport, injectIntl)(EmployerEditListingWizard);
