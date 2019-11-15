import EditListingFeaturesForm from './EditListingFeaturesForm';

const NAME = 'yogaStyles';

const initialValueArray = ['hatha', 'vinyasa', 'yin'];
const initialValues = { [NAME]: initialValueArray };

export const YogaStyles = {
  component: EditListingFeaturesForm,
  props: {
    name: NAME,
    onSubmit: values => console.log('EditListingFeaturesForm submit:', values),
    initialValues: initialValues,
    saveActionMsg: 'Save yoga styles',
    updated: false,
    updateInProgress: false,
  },
  group: 'forms',
};
