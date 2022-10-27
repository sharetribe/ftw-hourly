import React from 'react';
import {
  LayoutSingleColumn,
  LayoutWrapperMain,
  NamedLink,
  EditListingWizard
} from '../../components';

import StaticPage from '../../containers/StaticPage/StaticPage';

import css from './CreateCaregiverProfilePage.module.css';

const CreateCaregiverProfilePage = () => {
  return (
    <StaticPage
      className={css.root}
      title="CreateCaregiverProfile"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'ProfilePage',
        description: 'A page to create a caregiver profile after signup.',
        name: 'Create caregiver profile page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperMain>
        <EditListingWizard
          id="EditListingWizard"
          className={css.wizard}
          params={params}
          disabled={disableForm}
          errors={errors}
          fetchInProgress={fetchInProgress}
          newListingPublished={newListingPublished}
          history={history}
          images={images}
          listing={currentListing}
          onAddAvailabilityException={onAddAvailabilityException}
          onDeleteAvailabilityException={onDeleteAvailabilityException}
          onUpdateListing={onUpdateListing}
          onCreateListingDraft={onCreateListingDraft}
          onPublishListingDraft={onPublishListingDraft}
          onPayoutDetailsFormChange={onPayoutDetailsFormChange}
          onPayoutDetailsSubmit={onPayoutDetailsFormSubmit}
          onGetStripeConnectAccountLink={onGetStripeConnectAccountLink}
          getAccountLinkInProgress={getAccountLinkInProgress}
          onImageUpload={onImageUpload}
          onUpdateImageOrder={onUpdateImageOrder}
          onRemoveImage={onRemoveListingImage}
          onChange={onChange}
          currentUser={currentUser}
          onManageDisableScrolling={onManageDisableScrolling}
          stripeOnboardingReturnURL={params.returnURLType}
          updatedTab={page.updatedTab}
          updateInProgress={page.updateInProgress || page.createListingDraftInProgress}
          fetchExceptionsInProgress={page.fetchExceptionsInProgress}
          availabilityExceptions={page.availabilityExceptions}
          payoutDetailsSaveInProgress={page.payoutDetailsSaveInProgress}
          payoutDetailsSaved={page.payoutDetailsSaved}
          stripeAccountFetched={stripeAccountFetched}
          stripeAccount={stripeAccount}
          stripeAccountError={
            createStripeAccountError || updateStripeAccountError || fetchStripeAccountError
          } />
        </LayoutWrapperMain>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;