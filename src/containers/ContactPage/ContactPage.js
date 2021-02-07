import React from 'react';
import config from '../../config';
import { StaticPage, TopbarContainer } from '..';
import {
    LayoutSingleColumn,
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,
    ExternalLink,
} from '../../components';

import css from './ContactPage.module.css';

const ContactPage = () => {
    const { siteSavanteInfor } = config;

    return (
        <StaticPage
            title="Contact"
            schema={{
                '@context': 'http://schema.org',
                '@type': 'ContactPage',
                description: 'Contact Savante',
                name: 'Contact page',
            }}
        >
            <LayoutSingleColumn>
                <LayoutWrapperTopbar>
                    <TopbarContainer />
                </LayoutWrapperTopbar>

                <LayoutWrapperMain className={css.mainWrapper}>
                    <p>
                        <strong>Send all inquiries to</strong> <ExternalLink href={siteSavanteInfor}>info@savante.me</ExternalLink>
                    </p>
                </LayoutWrapperMain>

                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSingleColumn>
        </StaticPage>
    );
};

export default ContactPage;