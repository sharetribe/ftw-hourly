import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionHowItWorksNew.module.css';

import cafeImage from './images/restaurant-icon.png';
import workerImage from './images/female-food-worker.png';
import signImage from './images/open-sign.png';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const locationLink = (name, image, searchQuery) => {
  const nameText = <span className={css.locationName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.location}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.locationImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionHowItWorksNew.listingsInLocation"
          values={{ location: nameText }}
        />
      </div>
    </NamedLink>
  );
};

const SectionHowItWorksNew = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id=".title" />
      </div>
      <div className={css.locations}>
        {locationLink(
          'New York',
          cafeImage,
          '?address=New%20York%20City%2C%20New%20York%2C%20USA&bounds=40.917576401307%2C-73.7008392055224%2C40.477399%2C-74.2590879797556'
        )}
        {locationLink(
          'Los Angeles',
          workerImage,
          '?address=Los%20Angeles%2C%20California%2C%20USA&bounds=34.161440999758%2C-118.121305008073%2C33.9018913203336%2C-118.521456965901'
        )}
        {locationLink(
          'San Francisco',
          signImage,
          '?address=San%20Francisco%2C%20California%2C%20USA&bounds=37.8324430069081%2C-122.354995082683%2C37.6044780500533%2C-122.517910874663'
        )}
      </div>
    </div>
  );
};

SectionHowItWorksNew.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionHowItWorksNew.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHowItWorksNew;
