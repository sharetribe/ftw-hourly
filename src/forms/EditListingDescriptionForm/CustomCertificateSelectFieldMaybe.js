import React from 'react';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.css';

const CustomCertificateSelectFieldMaybe = props => {
  const { name, id, certificate, intl } = props;
  const certificateLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.certificateLabel',
  });

  return certificate ? (
    <FieldSelect className={css.certificate} name={name} id={id} label={certificateLabel}>
      {certificate.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCertificateSelectFieldMaybe;
