import React from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import moment from 'moment';
import { LINE_ITEM_NIGHT, LINE_ITEM_UNITS, DATE_TYPE_DATE, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemCustomerAddressMaybe = props => {
  const { transaction, intl } = props;

  const customerAddress = transaction && transaction.attributes &&
    transaction.attributes.protectedData && transaction.attributes.protectedData.customerAddress || '';

  return (
    <>
    {customerAddress !== '' ?
      <>
        <p/>
        <div className={css.lineItem}>
          <div className={css.customerAddressLabel}>
            <FormattedMessage id="BookingBreakdown.customerAddressLabel" />
          </div>
          <div className={css.customerAddressInfo}>
            {customerAddress}
          </div>
        </div>
        <hr className={css.totalDivider} />
      </> : null
    }
    </>
  );
};
LineItemCustomerAddressMaybe.defaultProps = { dateType: null };

LineItemCustomerAddressMaybe.propTypes = {
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,
};

export default LineItemCustomerAddressMaybe;
