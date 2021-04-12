import React from 'react';
import config from '../../config';
import { StaticPage, TopbarContainer } from '../../containers';
import {
    LayoutSingleColumn,
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,
} from '../../components';

import css from './ZoomVerify.module.css';

const ZoomVerifyPage = () => {
    const { zoomVerification } = config;

    return (
        <StaticPage
            title="ZoomVerify"
            schema={{
                '@context': 'http://schema.org',
                '@type': 'ZoomVerifyPage',
                description: 'Zoom Savante',
                name: 'Zoom verify page',
            }}
        >
            <LayoutWrapperMain className={css.mainWrapper}>
                <div>
                    <p>
                        a723cf53f6264c79bcf4650c8f5ce1a1
                    </p>
                </div>
            </LayoutWrapperMain>
        </StaticPage>
    );
};

export default ZoomVerifyPage;