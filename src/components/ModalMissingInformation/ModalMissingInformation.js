import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import routeConfiguration from '../../routeConfiguration';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import { pathByRouteName } from '../../util/routes';
import { Modal } from '../../components';

import EmailReminder from './EmailReminder';
import PaymentDetailsReminder from './PaymentDetailsReminder';
import css from './ModalMissingInformation.module.css';

export const EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';
export const PAYMENT_DETAILS = 'PAYMENT_DETAILS';

class ModalMissingInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMissingInformationReminder: null,
    };
  }

  render() {
    const {
      rootClassName,
      className,
      containerClassName,
      currentUser,
      sendVerificationEmailInProgress,
      sendVerificationEmailError,
      onManageDisableScrolling,
      onResendVerificationEmail,
      modalValue,
      onChangeModalValue,
    } = this.props;

    const user = ensureCurrentUser(currentUser);
    const classes = classNames(rootClassName || css.root, className);

    let content = null;

    const currentUserLoaded = user && user.id;
    if (currentUserLoaded) {
      if (modalValue === EMAIL_VERIFICATION) {
        content = (
          <EmailReminder
            className={classes}
            user={user}
            onResendVerificationEmail={onResendVerificationEmail}
            sendVerificationEmailInProgress={sendVerificationEmailInProgress}
            sendVerificationEmailError={sendVerificationEmailError}
            onChangeModalValue={onChangeModalValue}
          />
        );
      } else if (modalValue === PAYMENT_DETAILS) {
        content = (
          <PaymentDetailsReminder
            className={classes}
            currentUser={currentUser}
            onChangeModalValue={onChangeModalValue}
          />
        );
      } else {
        content = null;
      }
    }

    const closeButtonMessage = (
      <FormattedMessage id="ModalMissingInformation.closeVerifyEmailReminder" />
    );

    return (
      <Modal
        id="MissingInformationReminder"
        containerClassName={containerClassName}
        isOpen={!!content}
        onClose={() => onChangeModalValue(null)}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
        closeButtonMessage={closeButtonMessage}
      >
        {content}
      </Modal>
    );
  }
}

ModalMissingInformation.defaultProps = {
  className: null,
  rootClassName: null,
  currentUser: null,
};

ModalMissingInformation.propTypes = {
  id: string.isRequired,
  className: string,
  rootClassName: string,
  containerClassName: string,

  currentUser: propTypes.currentUser,
  onManageDisableScrolling: func.isRequired,
  sendVerificationEmailError: propTypes.error,
  sendVerificationEmailInProgress: bool.isRequired,
};

ModalMissingInformation.displayName = 'ModalMissingInformation';

export default ModalMissingInformation;
