import React from 'react';
import { renderShallow } from '../../util/test-helpers';
import { createUser, createListing, fakeIntl } from '../../util/test-data';
import { CaregiverListingCardComponent } from './CaregiverListingCard';

describe('CaregiverListingCard', () => {
  it('matches snapshot', () => {
    const listing = createListing('listing1', {}, { author: createUser('user1') });
    const tree = renderShallow(<CaregiverListingCardComponent listing={listing} intl={fakeIntl} />);
    expect(tree).toMatchSnapshot();
  });
});
