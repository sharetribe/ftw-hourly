import React, { Component, useEffect, useState } from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './SectionHero.module.css';
import ServicesDropdownForm from '../ServicesDropdownForm/ServicesDropdownForm';
import { render } from 'enzyme';

class SectionHero extends Component {
  constructor(props) {
    super(props);
    this.state = { service: 'cleaning', mounted: true };
    this.changeService = this.changeService.bind(this);
  }
  changeService(newService) {
    this.setState(state => ({
      service: newService,
    }));
  }
  render() {
    // const [mounted, setMounted] = useState(false);
    // const mounted = true;
    const { rootClassName, className } = this.props;

    // useEffect(() => {
    //   setMounted(true);
    // }, []);

    const classes = classNames(rootClassName || css.root, className);
    let chosenService = { service: this.state.service };
    // console.log(chosenService);
    return (
      <div className={classes}>
        <div className={css.heroContent}>
          <h1
            className={classNames(css.heroMainTitle, {
              [css.heroMainTitleFEDelay]: this.state.mounted,
            })}
          >
            <FormattedMessage id="SectionHero.title" />
          </h1>
          <h2
            className={classNames(css.heroSubTitle, {
              [css.heroSubTitleFEDelay]: this.state.mounted,
            })}
          >
            <FormattedMessage id="SectionHero.subTitle" />
          </h2>
          <div className={css.heroSelectionBlock}>
            <ServicesDropdownForm
              id="SectionHero.chosenService"
              changeService={this.changeService}
            />

            <NamedLink
              name="BookingPage"
              params={chosenService}
              className={classNames(css.heroButton, {
                [css.heroButtonFEDelay]: this.state.mounted,
              })}
            >
              <FormattedMessage id="SectionHero.browseButton" />
            </NamedLink>
          </div>
        </div>
      </div>
    );
  }
}

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
