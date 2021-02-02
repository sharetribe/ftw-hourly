import React from 'react';
import { FieldSelect } from '../../components';

import css from './EditListingFeaturesForm.module.css';

const CustomCategorySelectFieldMaybe = props => {
    const { name, id, categoryOptions, intl } = props;
    const categoryLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.categoryLabel',
    });

    return categoryOptions ? (
        <FieldSelect className={css.category} name={name} id={id} label={categoryLabel}>
            {categoryOptions.map(c => (
                <option key={c.key} value={c.key}>
                    {c.label}
                </option>
            ))}
        </FieldSelect>
    ) : null;
};

export default CustomCategorySelectFieldMaybe;
