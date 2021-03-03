import React from 'react';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.module.css';

const CustomExperienceSelectFieldMaybe = props => {
  const { name, id, experienceOptions, intl } = props;
  const experienceLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.experienceLabel',
  });

  return experienceOptions ? (
    <FieldSelect className={css.experience} name={name} id={id} label={experienceLabel}>
      {experienceOptions.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomExperienceSelectFieldMaybe;
