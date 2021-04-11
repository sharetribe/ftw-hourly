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
            <LayoutSingleColumn>
                <LayoutWrapperTopbar>
                    <TopbarContainer />
                </LayoutWrapperTopbar>

                <LayoutWrapperMain className={css.mainWrapper}>
                    <div>
                        <p>
                            {zoomVerification}
                        </p>
                    </div>
                </LayoutWrapperMain>

                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSingleColumn>
        </StaticPage>
    );
};

export default ZoomVerifyPage;