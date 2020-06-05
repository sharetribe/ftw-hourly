/**
 * Renders Add-On line items
 */
import React from 'react';
import { intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_ADDON, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemUnknownItemsMaybe = props => {
  const { transaction, intl } = props;

  const items = transaction.attributes.lineItems.filter(
    item => item.code === LINE_ITEM_ADDON && !item.reversal
  );

  return items.length > 0 ? (
    <React.Fragment>
      {items.map((item, i) => {
        const label = item.addonTitle;
        const formattedTotal = formatMoney(intl, item.lineTotal);
        return (
          <div key={`${i}-item.code`} className={css.lineItem}>
            <span className={css.itemLabel}>{label}</span>
            <span className={css.itemValue}>{formattedTotal}</span>
          </div>
        );
      })}
    </React.Fragment>
  ) : null;
};

LineItemUnknownItemsMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemUnknownItemsMaybe;
