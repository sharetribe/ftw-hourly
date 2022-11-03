/* eslint-disable no-console */
import EditListingExperienceLevelForm from './EditListingExperienceLevelForm';

export const Empty = {
  component: EditListingExperienceLevelForm,
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
