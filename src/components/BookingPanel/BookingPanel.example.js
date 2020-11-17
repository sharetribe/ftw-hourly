import React from 'react';
import { createListing } from '../../util/test-data';
import { LISTING_STATE_CLOSED } from '../../util/types';
import BookingPanel from './BookingPanel';
import css from './BookingPanelExample.module.css';

const noop = () => null;
export const Default = {
  component: BookingPanel,
  props: {
    className: css.example,
    listing: createListing('listing_1', { availabilityPlan: { timezone: 'Etc/UTC' } }),
    onSubmit: values => console.log('Submit:', values),
    title: <span>Booking title</span>,
    subTitle: 'Hosted by Author N',
    authorDisplayName: 'Author Name',
    onManageDisableScrolling: noop,
    onFetchTimeSlots: noop,
    fetchLineItemsInProgress: false,
    onFetchTransactionLineItems: noop,
  },
};

export const WithClosedListing = {
  component: BookingPanel,
  props: {
    className: css.example,
    listing: createListing('listing_1', {
      availabilityPlan: { timezone: 'Etc/UTC' },
      state: LISTING_STATE_CLOSED,
    }),
    onSubmit: values => console.log('Submit:', values),
    title: <span>Booking title</span>,
    subTitle: 'Hosted by Author N',
    authorDisplayName: 'Author Name',
    onManageDisableScrolling: noop,
    onFetchTimeSlots: noop,
    fetchLineItemsInProgress: false,
    onFetchTransactionLineItems: noop,
  },
};
