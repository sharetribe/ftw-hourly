import React from 'react';
import { string } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './SectionGuarantee.module.css';

const SectionGuarantee = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionGuarantee.title" />
      </div>

      <div className={css.body}>
        <div className={css.icon}>
          {' '}
          <FontAwesomeIcon icon={faAward} className="fa-8x" />
        </div>

        <p>
          <FormattedMessage id="SectionGuarantee.text" />
        </p>
      </div>
    </div>
  );
};

SectionGuarantee.defaultProps = {
  rootClassName: null,
  className: null,
};

SectionGuarantee.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionGuarantee;
