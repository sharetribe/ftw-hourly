/* eslint-disable no-console */
import EditListingCareTypeForm from './EditListingCareTypeForm';

export const Empty = {
  component: EditListingCareTypeForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingDescriptionForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save description',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
