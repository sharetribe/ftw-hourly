import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionFeaturesMaybe = props => {
  const { options, publicData } = props;
  const selectedOption =
    publicData && publicData.categories ? publicData.categories : null;

  if (!publicData || !selectedOption) {
    return null;
  }

  const optionConfig = options.find(o => o.key === selectedOption);
  const optionLabel = optionConfig ? optionConfig.label : null;

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="ListingPage.featuresTitle" />
      </h2>
      {/* <PropertyGroup
        id="ListingPage.yogaStyles"
        options={selectedConfigOptions}
        selectedOptions={selectedOptions}
        twoColumns={selectedConfigOptions.length > 5}
      /> */}
      <p className={css.consultation}>
        <FormattedMessage
          id="ListingPage.featuresDetail"
          values={{ categories: optionLabel }}
        />
      </p>
    </div>
  );
};

export default SectionFeaturesMaybe;
