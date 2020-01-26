/*
 * Marketplace specific configuration.
 */

export const yogaStyles = [
  { key: 'ashtanga', label: 'Ashtanga' },
  { key: 'hatha', label: 'Hatha' },
  { key: 'kundalini', label: 'Kundalini' },
  { key: 'restorative', label: 'Restorative' },
  { key: 'vinyasa', label: 'Vinyasa' },
  { key: 'yin', label: 'Yin' },
];

export const certificate = [
  { key: 'none', label: 'None', hideFromFilters: true, hideFromListingInfo: true },
  { key: '200h', label: 'Registered yoga teacher 200h' },
  { key: '500h', label: 'Registered yoga teacher 500h' },
];

// Price filter configuration
// Note: unlike most prices this is not handled in subunits
export const priceFilterConfig = {
  min: 0,
  max: 1000,
  step: 5,
};

// Activate booking dates filter on search page
export const dateRangeFilterConfig = {
  active: true,
};

// Activate keyword filter on search page

// NOTE: If you are ordering search results by distance the keyword search can't be used at the same time.
// You can turn off ordering by distance in config.js file
export const keywordFilterConfig = {
  active: true,
};

export const languageCountryConfig = {
  UK: 'EN',
  US: 'en',
  IT: 'it',
  // FR: "fr",
  // DE: "de",
  ES: 'es',
};

export const spokenlanguages = [
  { key: 'english', label: 'English', label_it: 'Inglese', label_es: 'Inglesa', code: 'en' },
  { key: 'spanish', label: 'Spanish', label_it: 'Spagnolo', label_es: 'Española', code: 'es' },
  { key: 'italian', label: 'Italian', label_it: 'Italiano', label_es: 'Italiano', code: 'it' },
  // { key: 'french', label: 'French', code: 'fr' },
  // { key: 'german', label: 'German', code: 'de' },
  // { key: 'dutch', label: 'Dutch', code: 'nl' },
  // { key: 'chinese', label: 'Chinese', code: 'zh' },
];
