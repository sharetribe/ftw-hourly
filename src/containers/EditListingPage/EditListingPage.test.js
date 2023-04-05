import React from 'react';
import { renderShallow } from '../../util/test-helpers';
import { fakeIntl } from '../../util/test-data';
import { EditListingPageComponent } from './EditListingPage';

const noop = () => null;

describe('EditListingPageComponent', () => {
  it('matches snapshot', () => {
    const getOwnListing = () => null;
    const tree = renderShallow(
      <EditListingPageComponent
        params={{ id: 'id', slug: 'slug', type: 'new', tab: 'description' }}
        currentUserHasListings={false}
        isAuthenticated={false}
        authInProgress={false}
        fetchInProgress={false}
        location={{ search: '' }}
        history={{ push: noop }}
        getOwnListing={getOwnListing}
        images={[]}
        intl={fakeIntl}
        onManageDisableScrolling={noop}
        onAddAvailabilityException={noop}
        onDeleteAvailabilityException={noop}
        onCreateListingDraft={noop}
        onPublishListingDraft={noop}
        onUpdateListing={noop}
        onImageUpload={noop}
        onRemoveListingImage={noop}
        onPayoutDetailsFormChange={noop}
        onPayoutDetailsSubmit={noop}
        onUpdateImageOrder={noop}
        onChange={noop}
        onGetStripeConnectAccountLink={noop}
        onPayoutDetailsFormSubmit={noop}
        page={{ imageOrder: [], images: {} }}
        scrollingDisabled={false}
        tab="description"
        type="new"
        sendVerificationEmailInProgress={false}
        onResendVerificationEmail={noop}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
