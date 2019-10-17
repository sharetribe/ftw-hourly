import EditListingAvailabilityPlanForm from './EditListingAvailabilityPlanForm';

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const Example = {
  component: EditListingAvailabilityPlanForm,
  props: {
    formId: 'EditListingAvailabilityPlanFormExample',
    listingTitle: 'Sauna with a view',
    weekdays: WEEKDAYS,
    onSubmit(values) {
      console.log('submit with values:', values);
    },
    fetchErrors: {},
  },
  group: 'forms',
};
