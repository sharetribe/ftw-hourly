import React from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ExternalLink } from '../../components';

import css from './Support.module.css';

const Support = props => {
    const { siteSupport, sitePolicies, siteSavanteWeb, siteInternetCookies } = config;
    const { rootClassName, className } = props;
    const classes = classNames(rootClassName || css.root, className);

    // prettier-ignore
    return (
        <div className={classes}>
        </div>
    );
};

Support.defaultProps = {
    rootClassName: null,
    className: null,
};

const { string } = PropTypes;

Support.propTypes = {
    rootClassName: string,
    className: string,
};

export default Support;
