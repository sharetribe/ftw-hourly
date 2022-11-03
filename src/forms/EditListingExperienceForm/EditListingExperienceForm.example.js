/* eslint-disable no-console */
import EditListingExperienceForm from './EditListingExperienceForm';

export const Empty = {
  component: EditListingExperienceForm,
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
