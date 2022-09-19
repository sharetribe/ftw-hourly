import React from 'react';
import { string } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './SectionTestimonials.module.css';

const SectionTestimonials = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionTestimonials.title" />
      </div>

      <div className={css.body}>
        <FontAwesomeIcon icon={faAward} className="fa-8x" />
        <p>
          <FormattedMessage id="SectionTestimonials.text" />
        </p>
      </div>
    </div>
  );
};

SectionTestimonials.defaultProps = {
  rootClassName: null,
  className: null,
};

SectionTestimonials.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionTestimonials;
