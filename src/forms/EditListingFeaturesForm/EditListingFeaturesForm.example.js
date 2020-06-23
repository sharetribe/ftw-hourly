import EditListingFeaturesForm from './EditListingFeaturesForm';

const NAME = 'yogaStyles';

const initialValueArray = ['hatha', 'vinyasa', 'yin'];
const initialValues = { [NAME]: initialValueArray };

const filterConfig = [
  {
    id: 'yogaStyles',
    label: 'Yoga styles',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_yogaStyles'],
    config: {
      mode: 'has_all',
      options: [
        { key: 'ashtanga', label: 'Ashtanga' },
        { key: 'hatha', label: 'Hatha' },
        { key: 'kundalini', label: 'Kundalini' },
        { key: 'restorative', label: 'Restorative' },
        { key: 'vinyasa', label: 'Vinyasa' },
        { key: 'yin', label: 'Yin' },
      ],
    },
  },
];

export const YogaStyles = {
  component: EditListingFeaturesForm,
  props: {
    name: NAME,
    onSubmit: values => console.log('EditListingFeaturesForm submit:', values),
    initialValues: initialValues,
    saveActionMsg: 'Save yoga styles',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
    filterConfig,
  },
  group: 'forms',
};
