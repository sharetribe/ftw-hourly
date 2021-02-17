import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';

const getCertificateInfo = (certificateOptions, key) => {
  return certificateOptions.find(c => c.key === key);
};


const SectionHeading = props => {
  const {
    richTitle,
    listingCertificate,
    certificateOptions,
    features,
    showContactUser,
    onContactUser,
  } = props;

  const certificate = getCertificateInfo(certificateOptions, listingCertificate);
  const showCertificate = certificate && !certificate.hideFromListingInfo;

  // const features = getFeaturesInfo(featuresOptions, listingFeatures);
  const showFeatures = features && !features.hideFromListingInfo;

  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <div className={css.author}>
          {showCertificate ? <span>{certificate.label}</span> : null}
          {showFeatures ? <span>{features.label}</span> : null}
          {showContactUser ? (
            <span className={css.contactWrapper}>
              {showCertificate ? <span className={css.separator}>•</span> : null}
              {showFeatures ? <span className={css.separator}>•</span> : null}
              <InlineTextButton rootClassName={css.contactLink} onClick={onContactUser}>
                <FormattedMessage id="ListingPage.contactUser" />
              </InlineTextButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
