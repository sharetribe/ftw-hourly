/* eslint-disable no-console */
import EditListingBioForm from './EditListingBioForm';

export const Empty = {
  component: EditListingBioForm,
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
