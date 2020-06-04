import {
  validURLParamForExtendedData,
  validFilterParams,
  validURLParamsForExtendedData,
  pickSearchParamsOnly,
} from './SearchPage.helpers.js';

const urlParams = {
  pub_certificate: '200h',
  pub_yogaStyles: 'vinyasa,yin',
};

const filters = [
  {
    id: 'certificate',
    label: 'Certificate',
    type: 'SelectSingleFilter',
    group: 'secondary',
    queryParamNames: ['pub_certificate'],
    config: {
      options: [{ key: '200h' }, { key: '500h' }],
    },
  },
  {
    id: 'test',
    label: 'Test',
    type: 'SelectSingleFilter',
    group: 'secondary',
    queryParamNames: ['pub_param1', 'pub_param1'],
    config: {
      options: [{ key: 'smoke', label: 'Smoke' }, { key: 'wooden', label: 'Wood' }],
    },
  },
  {
    id: 'yogaStyles',
    label: 'Yoga styles',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_yogaStyles'],
    config: {
      mode: 'has_all',
      options: [{ key: 'vinyasa' }, { key: 'yin' }],
    },
  },
];

const sortConfig = {
  active: true,
  queryParamName: 'sort',
  relevanceKey: 'relevance',
  conflictingFilters: ['keyword'],
  options: [
    { key: 'createdAt', label: 'Newest' },
    { key: '-createdAt', label: 'Oldest' },
    { key: '-price', label: 'Lowest price' },
    { key: 'price', label: 'Highest price' },
    { key: 'relevance', label: 'Relevance', longLabel: 'Relevance (Keyword search)' },
  ],
};

describe('SearchPage.helpers', () => {
  describe('validURLParamForExtendedData', () => {
    it('returns a valid parameter', () => {
      const validParam = validURLParamForExtendedData(
        'pub_certificate',
        '200h',
        filters,
        sortConfig
      );
      expect(validParam).toEqual({ pub_certificate: '200h' });
    });

    it('takes empty params', () => {
      const validParam = validURLParamForExtendedData('pub_certificate', '', filters, sortConfig);
      expect(validParam).toEqual({});
    });

    it('drops an invalid param value', () => {
      const validParam = validURLParamForExtendedData(
        'pub_certificate',
        'invalid',
        filters,
        sortConfig
      );
      expect(validParam).toEqual({});
    });

    it('drops a param with invalid name', () => {
      const validParam = validURLParamForExtendedData(
        'pub_invalid',
        'vinyasa',
        filters,
        sortConfig
      );
      expect(validParam).toEqual({});
    });
  });

  describe('validFilterParams', () => {
    it('returns valid parameters', () => {
      const validParams = validFilterParams(urlParams, filters, sortConfig);
      expect(validParams).toEqual(urlParams);
    });

    it('takes empty params', () => {
      const validParams = validFilterParams({}, filters, sortConfig);
      expect(validParams).toEqual({});
    });

    it('drops an invalid filter param value', () => {
      const params = { pub_certificate: '200h', pub_yogaStyles: 'invalid1,invalid2' };
      const validParams = validFilterParams(params, filters, sortConfig);
      expect(validParams).toEqual({ pub_certificate: '200h' });
    });

    it('drops non-filter params', () => {
      const params = { pub_certificate: '200h', other_param: 'somevalue' };
      const validParams = validFilterParams(params, filters, sortConfig);
      expect(validParams).toEqual({ pub_certificate: '200h' });
    });
  });

  describe('validURLParamsForExtendedData', () => {
    it('returns valid parameters', () => {
      const validParams = validURLParamsForExtendedData(urlParams, filters, sortConfig);
      expect(validParams).toEqual(urlParams);
    });

    it('takes empty params', () => {
      const validParams = validURLParamsForExtendedData({}, filters, sortConfig);
      expect(validParams).toEqual({});
    });

    it('drops an invalid filter param value', () => {
      const params = { pub_certificate: '200h', pub_yogaStyles: 'invalid1,invalid2' };
      const validParams = validURLParamsForExtendedData(params, filters, sortConfig);
      expect(validParams).toEqual({ pub_certificate: '200h' });
    });

    it('returns non-filter params', () => {
      const params = { pub_certificate: '200h', other_param: 'somevalue' };
      const validParams = validURLParamsForExtendedData(params, filters, sortConfig);
      expect(validParams).toEqual(params);
    });
  });

  describe('pickSearchParamsOnly', () => {
    it('returns search parameters', () => {
      const params = {
        address: 'address value',
        origin: 'origin value',
        bounds: 'bounds value',
      };
      const validParams = pickSearchParamsOnly(params, filters, sortConfig);
      expect(validParams).toEqual({ bounds: 'bounds value' });
    });

    it('returns filter parameters', () => {
      const validParams = pickSearchParamsOnly(urlParams, filters, sortConfig);
      expect(validParams).toEqual(urlParams);
    });

    it('drops an invalid filter param value', () => {
      const params = { pub_certificate: '200h', pub_yogaStyles: 'invalid1,invalid2' };
      const validParams = pickSearchParamsOnly(params, filters, sortConfig);
      expect(validParams).toEqual({ pub_certificate: '200h' });
    });

    it('drops non-search params', () => {
      const params = { pub_certificate: '200h', other_param: 'somevalue' };
      const validParams = pickSearchParamsOnly(params, filters, sortConfig);
      expect(validParams).toEqual({ pub_certificate: '200h' });
    });

    it('returns sort param', () => {
      const params = { sort: '-price', other_param: 'somevalue' };
      const validParams = pickSearchParamsOnly(params, filters, sortConfig);
      expect(validParams).toEqual({ sort: '-price' });
    });
  });
});
