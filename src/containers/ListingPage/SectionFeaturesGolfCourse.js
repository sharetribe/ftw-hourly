import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionFeaturesGolfCourse = props => {
  const { options, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedOptions = publicData && publicData.golfCourse ? publicData.golfCourse : [];
  const selectedConfigOptions = options.filter(o => selectedOptions.find(s => s === o.key));

  console.log(selectedOptions, 'PublicData');

  return (
    <div className={css.sectionFeatures}>
      <h2 className={css.featuresTitle}>
        <FormattedMessage id="Golf Courses" />
      </h2>
      <PropertyGroup
        id="ListingPage.golfCourse"
        options={selectedConfigOptions}
        selectedOptions={selectedOptions}
        twoColumns={selectedConfigOptions.length > 5}
      />
    </div>
  );
};

export default SectionFeaturesGolfCourse;
