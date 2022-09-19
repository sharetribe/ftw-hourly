import React from 'react';
import { string, integer } from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmileBeam, faStar as faEmptyStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfStroke, faStar } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from '../../util/reactIntl';

import css from './Testimonial.module.css';

const StarRating = props => {
  const { rating } = props;
  const nFullStars = Math.floor(rating);
  const nHalfStars = rating % 1 == 0 ? 0 : 1;
  const nEmptyStars = 5 - nFullStars - nHalfStars;
  return (
    <div>
      {Array.from(Array(nFullStars).keys()).map(elem => {
        return <FontAwesomeIcon icon={faStar} className="fa-3x" />;
      })}
      {Array.from(Array(nHalfStars).keys()).map(elem => {
        return <FontAwesomeIcon icon={faStarHalfStroke} className="fa-3x" />;
      })}
      {Array.from(Array(nEmptyStars).keys()).map(elem => {
        return <FontAwesomeIcon icon={faEmptyStar} className="fa-3x" />;
      })}
    </div>
  );
};

const Testimonial = props => {
  const { rootClassName, className, rating, text, userInfo } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={css.Testimonial}>
      <section className={css.userInfo}>
        <FontAwesomeIcon icon={faFaceSmileBeam} className="fa-3x" />
        <p>{userInfo}</p>
      </section>
      <section className={css.ratingSection}>
        <div className={css.icon}>
          <StarRating rating={rating} />
        </div>
        <p>{text}</p>
      </section>
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
