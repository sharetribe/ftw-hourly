import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { verify } from '../../ducks/EmailVerification.duck';
import { parse } from '../../util/urlHelpers';
import { ensureCurrentUser } from '../../util/data';
import { zoomExchangeAuthorizeCode } from '../../util/api';
import qs from 'query-string';
import {
  Page,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedRedirect,
} from '../../components';
import { TopbarContainer } from '..';

import css from './ZoomIntegrationPage.module.css';

/**
  Parse verification token from URL

  Returns stringified token, if the token is provided.

  Returns `null` if verification token is not provided.

  Please note that we need to explicitely stringify the token, because
  the unwanted result of the `parse` method is that it automatically
  parses the token to number.
*/

export const EmailVerificationPageComponent = props => {
  const { currentUser, intl } = props;

  const [isLoading, setIsLoading] = useState(true);
  const title = intl.formatMessage({
    id: 'EmailVerificationPage.title',
  });

  useEffect(() => {
    if (currentUser) {
      const { code } = qs.parse(props.location.search);
      zoomExchangeAuthorizeCode(code).then(res => {
        setIsLoading(false);
        window.location.href = '/account/contact-details';
      });
    }
  }, [currentUser]);

  return (
    <Page title={title} referrer="origin" scrollingDisabled={true}>
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain className={css.layoutWrapperMain}>
          <div className={css.root}>
            <div className={css.content}>
              {isLoading ? <div>Loading</div> : <div>Successfull</div>}
            </div>
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser,
  };
};

const mapDispatchToProps = dispatch => ({
  submitVerification: ({ verificationToken }) => {
    return dispatch(verify(verificationToken));
  },
});

const EmailVerificationPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EmailVerificationPageComponent);

export default EmailVerificationPage;
