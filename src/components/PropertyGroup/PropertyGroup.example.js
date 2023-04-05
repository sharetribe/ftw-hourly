import PropertyGroup from './PropertyGroup';

const exampleOptions = [
  { key: 'ashtanga', label: 'Ashtanga' },
  { key: 'hatha', label: 'Hatha' },
  { key: 'kundalini', label: 'Kundalini' },
  { key: 'restorative', label: 'Restorative' },
  { key: 'vinyasa', label: 'Vinyasa' },
  { key: 'yin', label: 'yin' },
];

export const WithSomeSelected = {
  component: PropertyGroup,
  props: {
    id: 'yogaStyles',
    options: exampleOptions,
    selectedOptions: ['hatha', 'vinyasa', 'yin'],
    twoColumns: true,
  },
  group: 'misc',
};
