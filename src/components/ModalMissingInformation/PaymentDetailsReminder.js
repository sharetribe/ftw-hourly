import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { NamedLink } from '..';

import css from './ModalMissingInformation.module.css';

const StripeAccountReminder = props => {
  const { className, currentUser } = props;

  const { userType } = currentUser && currentUser.attributes.profile.metadata;

  const redirectPageName = userType === 'caregiver' ? 'StripePayoutPage' : 'PaymentMethodsPage';

  if (currentUser) {
    return (
      <div className={className}>
        <p className={css.modalTitle}>
          <FormattedMessage id="ModalMissingInformation.missingPaymentDetailsTitle" /> :
        </p>
        <p className={css.modalMessage}>
          {userType === 'caregiver' ? (
            <FormattedMessage id="ModalMissingInformation.missingStripeAccountText" />
          ) : (
            <FormattedMessage id="ModalMissingInformation.missingPaymentMethodsText" />
          )}
        </p>
        <div className={css.bottomWrapper}>
          <NamedLink className={css.reminderModalLinkButton} name={redirectPageName}>
            <FormattedMessage id="ModalMissingInformation.gotoPaymentSettings" />
          </NamedLink>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default StripeAccountReminder;
