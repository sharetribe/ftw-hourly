import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './SectionHero.module.css';
import ServicesDropdownForm from '../ServicesDropdownForm/ServicesDropdownForm';
import { render } from 'enzyme';

const SectionHero = props => {
  const [mounted, setMounted] = useState(false);
  const { rootClassName, className } = props;

  useEffect(() => {
    setMounted(true);
  }, []);

  const classes = classNames(rootClassName || css.root, className);
  // let myVal = document.getElementById('SectionHero.chosenService').value;
  // console.log(myVal);
  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <h1 className={classNames(css.heroMainTitle, { [css.heroMainTitleFEDelay]: mounted })}>
          <FormattedMessage id="SectionHero.title" />
        </h1>
        <h2 className={classNames(css.heroSubTitle, { [css.heroSubTitleFEDelay]: mounted })}>
          <FormattedMessage id="SectionHero.subTitle" />
        </h2>
        <div className={css.heroSelectionBlock}>
          <ServicesDropdownForm id="SectionHero.chosenService" />

          <NamedLink
            // name="SearchPage"
            // to={{
            //   search: 'address=Poland&bounds=52.43782325%2C21.21824438%2C52.06658088%2C20.76360492',
            // }}
            name="BookingPage"
            className={classNames(css.heroButton, { [css.heroButtonFEDelay]: mounted })}
          >
            <FormattedMessage id="SectionHero.browseButton" />
          </NamedLink>
        </div>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
