import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconConfirm.module.css';
const SIZE_SMALL = 'small';
const SIZE_NORMAL = 'normal';

const IconConfirm = props => {
  const { className, rootClassName, size } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={css.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      {' '}
      <circle className={css.checkmark__circle} cx="26" cy="26" r="25" fill="none" />{' '}
      <path className={css.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  );
};

const { string } = PropTypes;

IconConfirm.defaultProps = {
  className: null,
  rootClassName: null,
  size: SIZE_NORMAL,
};

IconConfirm.propTypes = {
  className: string,
  rootClassName: string,
  size: string,
};

export default IconConfirm;
