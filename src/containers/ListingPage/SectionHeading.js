import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';

import css from './ListingPage.css';

const getCertificateInfo = (certificateConfig, key) => {
  return certificateConfig.find(c => c.key === key);
};

const SectionHeading = props => {
  const {
    richTitle,
    listingCertificate,
    certificateConfig,
    showContactUser,
    onContactUser,
  } = props;

  const certificate = getCertificateInfo(certificateConfig, listingCertificate);
  const showCertificate = certificate && !certificate.hideFromListingInfo;
  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <div className={css.author}>
          {showCertificate ? <span>{certificate.label}</span> : null}
          {showContactUser ? (
            <span className={css.contactWrapper}>
              {showCertificate ? <span className={css.separator}>•</span> : null}
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
