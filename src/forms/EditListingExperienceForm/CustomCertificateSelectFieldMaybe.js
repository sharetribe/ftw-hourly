import React from 'react';
import { FieldSelect } from '../../components';

import css from './EditListingExperienceForm.module.css';

const CustomCertificateSelectFieldMaybe = props => {
  const { name, id, certificateOptions, intl } = props;
  const certificateLabel = intl.formatMessage({
    id: 'EditListingExperienceForm.certificateLabel',
  });

  return certificateOptions ? (
    <FieldSelect className={css.certificate} name={name} id={id} label={certificateLabel}>
      {certificateOptions.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCertificateSelectFieldMaybe;
