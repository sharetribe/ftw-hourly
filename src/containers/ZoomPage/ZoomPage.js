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

import css from './Zoom.module.css';

const ZoomPage = () => {

    return (
        <StaticPage
            title="Zoom"
            schema={{
                '@context': 'http://schema.org',
                '@type': 'ZoomPage',
                description: 'Zoom Savante',
                name: 'Zoom page',
            }}
        >
            <LayoutSingleColumn>
                <LayoutWrapperTopbar>
                    <TopbarContainer />
                </LayoutWrapperTopbar>

                <LayoutWrapperMain className={css.mainWrapper}>
                    <div>
                        <h3>Why should I use Savante?</h3>
                        <a href={`https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_ZOOM_API_KEY}&redirect_uri=${process.env.REACT_APP_ZOOM_REDIRECT_URL}`}>
                            Connect Zoom
                        </a>
                    </div>
                </LayoutWrapperMain>

                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSingleColumn>
        </StaticPage>
    );
};

export default ZoomPage;