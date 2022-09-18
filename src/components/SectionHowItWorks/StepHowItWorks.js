import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './StepHowItWorks.module.css';

const StepHowItWorks = props => {
  const { rootClassName, className, stepTitle, stepText, stepImg } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={css.step}>
      <div className={css.icon}> {stepImg}</div>

      <h2 className={css.stepTitle}>
        <FormattedMessage id={stepTitle} />
      </h2>
      <p>
        <FormattedMessage id={stepText} />
      </p>
    </div>
  );
};

StepHowItWorks.defaultProps = {
  rootClassName: null,
  className: null,
  stepTitle: '',
  stepText: '',
};

StepHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
  stepTitle: string,
  stepText: string,
};

export default StepHowItWorks;
