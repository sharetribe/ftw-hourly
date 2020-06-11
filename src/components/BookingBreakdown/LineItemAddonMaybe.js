/**
 * Renders Add-On line items
 */
import React from 'react';
import { intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_ADDON, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemAddonItemsMaybe = props => {
  const { transaction, intl } = props;

  const items = transaction.attributes.lineItems.filter(
    item => item.code === LINE_ITEM_ADDON && !item.reversal
  );

  const addonsTitles = transaction.attributes.protectedData && transaction.attributes.protectedData.addonsTitles;

  return items.length > 0 ? (
    <React.Fragment>
      {items.map((item, i) => {
        const label = item.addonTitle;
        const formattedTotal = formatMoney(intl, item.lineTotal);
        return (
          <div key={`${i}-item.code`} className={css.lineItem}>
            <span className={css.itemLabel}>{label || (addonsTitles && Array.isArray(addonsTitles) && addonsTitles[i])}</span>
            <span className={css.itemValue}>{formattedTotal}</span>
          </div>
        );
      })}
    </React.Fragment>
  ) : null;
};

LineItemAddonItemsMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemAddonItemsMaybe;
