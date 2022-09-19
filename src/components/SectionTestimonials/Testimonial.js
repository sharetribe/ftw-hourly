import React from 'react';
import { string, integer } from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmileBeam } from '@fortawesome/free-regular-svg-icons';
import { FormattedMessage } from '../../util/reactIntl';

import css from './Testimonial.module.css';

const Testimonial = props => {
  const { rootClassName, className, rating, text, userInfo } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={css.Testimonial}>
      <div>
        {' '}
        <FontAwesomeIcon icon={faFaceSmileBeam} className="fa-3x" />{' '}
        <p className={css.userInfo}>{userInfo}</p>
      </div>
      <p>{text}</p>
      <div className={css.icon}> {rating}</div>
    </div>
  );
};

Testimonial.defaultProps = {
  rootClassName: null,
  className: null,
  rating: 5,
  text: '',
  userInfo: '',
};

Testimonial.propTypes = {
  rootClassName: string,
  className: string,
};

export default Testimonial;
