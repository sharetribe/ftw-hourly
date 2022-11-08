/* eslint-disable no-console */
import React from 'react';
import CaregiverListingCard from './CaregiverListingCard';
import { createUser, createListing, fakeIntl } from '../../util/test-data';

const listing = createListing('listing1', {}, { author: createUser('user1') });

const CaregiverListingCardWrapper = props => (
  <div style={{ maxWidth: '400px' }}>
    <CaregiverListingCard {...props} />
  </div>
);

export const CaregiverListingCardWrapped = {
  component: CaregiverListingCardWrapper,
  props: {
    intl: fakeIntl,
    listing,
  },
};
