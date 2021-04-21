import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { TopbarContainer } from '../../containers';
import {
    Page,
    LayoutSideNavigation,
    LayoutWrapperMain,
    LayoutWrapperSideNav,
    LayoutWrapperTopbar,
    LayoutWrapperFooter,
    Support,
    Footer,
} from '../../components';
import config from '../../config';

import css from './SupportPage.module.css';

const SupportPageComponent = props => {
    const { scrollingDisabled, intl } = props;

    const tabs = [
        {
            text: intl.formatMessage({ id: 'SupportPage.privacyTabTitle' }),
            selected: false,
            linkProps: {
                name: 'PrivacyPolicyPage',
            },
        },
        {
            text: intl.formatMessage({ id: 'SupportPage.tosTabTitle' }),
            selected: false,
            linkProps: {
                name: 'TermsOfServicePage',
            },
        },
        {
            text: intl.formatMessage({ id: 'SupportPage.supportTabTitle' }),
            selected: true,
            linkProps: {
                name: 'SupportPage',
            },
        },
    ];
    const siteTitle = config.siteTitle;
    const schemaTitle = intl.formatMessage({ id: 'SupportPage.schemaTitle' }, { siteTitle });
    const schema = {
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        name: schemaTitle,
    };
    return (
        <Page title={schemaTitle} scrollingDisabled={scrollingDisabled} schema={schema}>
            <LayoutSideNavigation>
                <LayoutWrapperTopbar>
                    <TopbarContainer currentPage="SupportPage" />
                </LayoutWrapperTopbar>
                <LayoutWrapperSideNav tabs={tabs} />
                <LayoutWrapperMain>
                    <div className={css.content}>
                        <h1 className={css.heading}>
                            <FormattedMessage id="SupportPage.heading" />
                        </h1>
                        <Support />
                    </div>
                </LayoutWrapperMain>
                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSideNavigation>
        </Page>
    );
};

const { bool } = PropTypes;

SupportPageComponent.propTypes = {
    scrollingDisabled: bool.isRequired,

    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    return {
        scrollingDisabled: isScrollingDisabled(state),
    };
};

const SupportPage = compose(
    connect(mapStateToProps),
    injectIntl
)(SupportPageComponent);

export default SupportPage;
