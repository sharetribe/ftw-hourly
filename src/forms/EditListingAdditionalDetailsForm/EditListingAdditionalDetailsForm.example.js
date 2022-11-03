/* eslint-disable no-console */
import EditListingAdditionalDetailsForm from './EditListingAdditionalDetailsForm';

export const Empty = {
  component: EditListingAdditionalDetailsForm,
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
