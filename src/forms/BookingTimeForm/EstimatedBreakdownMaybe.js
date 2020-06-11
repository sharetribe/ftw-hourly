/**
 * Booking breakdown estimation
 *
 * Transactions have payment information that can be shown with the
 * BookingBreakdown component. However, when selecting booking
 * details, there is no transaction object present and we have to
 * estimate the breakdown of the transaction without data from the
 * API.
 *
 * If the payment process of a customized marketplace is something
 * else than simply daily or nightly bookings, the estimation will
 * most likely need some changes.
 *
 * To customize the estimation, first change the BookingDatesForm to
 * collect all booking information from the user (in addition to the
 * default date pickers), and provide that data to the
 * EstimatedBreakdownMaybe components. You can then make customization
 * within this file to create a fake transaction object that
 * calculates the breakdown information correctly according to the
 * process.
 *
 * In the future, the optimal scenario would be to use the same
 * transactions.initiateSpeculative API endpoint as the CheckoutPage
 * is using to get the breakdown information from the API, but
 * currently the API doesn't support that for logged out users, and we
 * are forced to estimate the information here.
 */
import React from 'react';
import Decimal from 'decimal.js';
import { types as sdkTypes } from '../../util/sdkLoader';
import { TRANSITION_REQUEST_PAYMENT, TX_TRANSITION_ACTOR_CUSTOMER } from '../../util/transaction';
import { LINE_ITEM_UNITS, LINE_ITEM_ADDON } from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit } from '../../util/currency';
import { BookingBreakdown } from '../../components';

import css from './BookingTimeForm.css';

const { Money, UUID } = sdkTypes;

const estimatedRentalPrice = (unitPrice, unitCount) => {
  const numericPrice = convertMoneyToNumber(unitPrice);
  const numericTotalPrice = new Decimal(numericPrice).times(unitCount).toNumber();
  return new Money(
    convertUnitToSubUnit(numericTotalPrice, unitDivisor(unitPrice.currency)),
    unitPrice.currency
  );
};

const estimatedTotalPrice = (unitPrice, unitCount, addons) => {
  const numericPrice = convertMoneyToNumber(unitPrice);
  const addonsPrice = (addons && Array.isArray(addons) && addons.length > 0)
    ? addons.map(function(addonData) { return addonData.addOnPrice }).reduce(function(a, b) { return Number(a) + Number(b) }) / 100
    : null;
  const numericTotalPrice = addonsPrice
    ? new Decimal(numericPrice)
      .times(unitCount)
      .plus(addonsPrice)
      .toNumber()
    : new Decimal(numericPrice).times(unitCount).toNumber();
  return new Money(
    convertUnitToSubUnit(
      numericTotalPrice,
      unitDivisor(unitPrice.currency)
    ),
    unitPrice.currency
  );
};

// When we cannot speculatively initiate a transaction (i.e. logged
// out), we must estimate the booking breakdown. This function creates
// an estimated transaction object for that use case.
const estimatedTransaction = (unitType, bookingStart, bookingEnd, unitPrice, quantity, addons) => {
  const now = new Date();
  const totalPrice = estimatedTotalPrice(unitPrice, quantity, addons);

  let addonsLineItems = [];

  if (addons && Array.isArray(addons) && addons.length > 0) {
    addons.forEach(addonData => {

      addonsLineItems.push(
        {
          code: LINE_ITEM_ADDON,
          includeFor: ['customer', 'provider'],
          unitPrice: new Money(addonData.addOnPrice, unitPrice.currency),
          quantity: new Decimal(1),
          lineTotal: new Money(addonData.addOnPrice, unitPrice.currency),
          reversal: false,
          addonTitle: addonData.addOnTitle
        }
      );

    });
  }

  const addonsLineItemMaybe = addons ? addonsLineItems : [];

  const lineItems = [
    ...addonsLineItemMaybe,
    {
      code: unitType,
      includeFor: ['customer', 'provider'],
      unitPrice: unitPrice,
      quantity: new Decimal(quantity),
      lineTotal: estimatedRentalPrice(unitPrice, quantity),
      reversal: false,
    },
  ];

  return {
    id: new UUID('estimated-transaction'),
    type: 'transaction',
    attributes: {
      createdAt: now,
      lastTransitionedAt: now,
      lastTransition: TRANSITION_REQUEST_PAYMENT,
      payinTotal: totalPrice,
      payoutTotal: totalPrice,
      lineItems: lineItems,
      transitions: [
        {
          createdAt: now,
          by: TX_TRANSITION_ACTOR_CUSTOMER,
          transition: TRANSITION_REQUEST_PAYMENT,
        },
      ],
    },
    booking: {
      id: new UUID('estimated-booking'),
      type: 'booking',
      attributes: {
        start: bookingStart,
        end: bookingEnd,
      },
    },
  };
};

const EstimatedBreakdownMaybe = props => {
  const { unitType, unitPrice, startDate, endDate, quantity, timeZone, addons } = props.bookingData;

  const isUnits = unitType === LINE_ITEM_UNITS;
  const quantityIfUsingUnits = !isUnits || Number.isInteger(quantity);
  const canEstimatePrice = startDate && endDate && unitPrice && quantityIfUsingUnits;
  if (!canEstimatePrice) {
    return null;
  }

  const tx = estimatedTransaction(unitType, startDate, endDate, unitPrice, quantity, addons);

  return (
    <BookingBreakdown
      className={css.receipt}
      userRole="customer"
      unitType={unitType}
      transaction={tx}
      booking={tx.booking}
      timeZone={timeZone}
    />
  );
};

export default EstimatedBreakdownMaybe;
