import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';
import css from './SectionHero.css';
import * as animationData from '../../assets/oogo-animation';
import Lottie from 'react-lottie';

class LottieWrapper extends PureComponent {
  LOTTIE_OPTIONS = {
    autoplay: false,
    loop: false,
    animationData,
    renderer: 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
  };
  render() {
    return <Lottie options={this.LOTTIE_OPTIONS} isClickToPauseDisabled />;
  }
}

const SectionHero = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <h1 className={css.heroMainTitle}>
          <FormattedMessage id="SectionHero.title" />
        </h1>
        <h2 className={css.heroSubTitle}>
          <FormattedMessage id="SectionHero.subTitle" />
        </h2>
        <NamedLink
          name="SearchPage"
          to={{
            search:
              'address=The%20Fitzwilliam%20Hotel%2C%202%20St%20Stephen%27s%20Green%2C%20Dublin%2C%20County%20Dublin%20D02%2C%20Ireland&bounds=53.357425305541426%2C-6.231841356760021%2C53.32149269445857%2C-6.292022643239979',
          }}
          className={css.heroButton}
        >
          <FormattedMessage id="SectionHero.browseButton" />
        </NamedLink>
        <div className={css.heroVideoContainer}></div>
        <LottieWrapper />
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
