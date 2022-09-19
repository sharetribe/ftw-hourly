import React, { Component } from 'react';
import { string } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Testimonial from './Testimonial';

import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './SectionTestimonials.module.css';

class SectionTestimonials extends Component {
  constructor(props) {
    super(props);
    this.state = { testimonialId: 0 };
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }
  moveLeft() {
    if (this.state.testimonialId > 0) {
      this.setState(state => ({
        testimonialId: state.testimonialId - 1,
      }));
    }
  }
  moveRight() {
    if (this.state.testimonialId < Object.keys(this.props['testimonials']).length - 1) {
      this.setState(state => ({
        testimonialId: state.testimonialId + 1,
      }));
    }
  }

  render() {
    const { rootClassName, className, testimonials } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    const showLeftArrow = this.state.testimonialId > 0;
    const showRightArrow =
      this.state.testimonialId < Object.keys(this.props['testimonials']).length - 1;

    return (
      <div className={classes}>
        <div className={css.title}>
          <FormattedMessage id="SectionTestimonials.title" />
        </div>

        <div className={css.body}>
          <div className={css.arrowBox}>
            {showLeftArrow && (
              <FontAwesomeIcon
                icon={faPlay}
                className="fa-2x fa-rotate-180"
                onClick={this.moveLeft}
              />
            )}
          </div>

          <Testimonial
            rating={testimonials[this.state.testimonialId].rating}
            text={testimonials[this.state.testimonialId].text}
            userInfo={testimonials[this.state.testimonialId].userInfo}
          />
          <div className={css.arrowBox}>
            {showRightArrow && (
              <FontAwesomeIcon icon={faPlay} className="fa-2x" onClick={this.moveRight} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

SectionTestimonials.defaultProps = {
  rootClassName: null,
  className: null,
  testimonials: {
    0: {
      rating: 5,
      text: 'Best service ever!!!',
      userInfo: 'Anna, Warszawa',
    },
    1: {
      rating: 5,
      text: 'Wow. Just wow. What heroes.',
      userInfo: 'Bartosz, Warszawa',
    },
    2: {
      rating: 4.5,
      text: 'Great experience, highly recommended!',
      userInfo: 'Iwona, Warszawa',
    },
    3: {
      rating: 3.5,
      text: 'Was ok, but the cleaner was 10 minutes late.',
      userInfo: 'Łukasz, Warszawa',
    },
  },
};

SectionTestimonials.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionTestimonials;
