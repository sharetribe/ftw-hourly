import React from 'react';
import { FieldSelect, FieldCheckboxGroup } from '../../components';

import css from './EditListingDescriptionForm.module.css';

const CustomLanguageSelectField = props => {
  const { name, id, languageOptions, intl } = props;
  const languageLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.languageLabel',
  });

  return languageOptions ? (
    <FieldSelect className={css.language} name={name} id={id} label={languageLabel}>
      {languageOptions.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : // <FieldCheckboxGroup
  //   key="formLanguage"
  //   className={css.language}
  //   id={id}
  //   name={name}
  //   options={languageOptions}
  //   label={languageLabel}
  // />
  null;
};

export default CustomLanguageSelectField;
