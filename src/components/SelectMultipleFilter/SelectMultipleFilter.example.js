import React from 'react';
import { withRouter } from 'react-router-dom';
import SelectMultipleFilter from './SelectMultipleFilter';
import { stringify, parse } from '../../util/urlHelpers';

const URL_PARAM = 'pub_yogaStyles';

const options = [
  { key: 'ashtanga', label: 'Ashtanga' },
  { key: 'hatha', label: 'Hatha' },
  { key: 'kundalini', label: 'Kundalini' },
  { key: 'restorative', label: 'Restorative' },
  { key: 'vinyasa', label: 'Vinyasa' },
  { key: 'yin', label: 'yin' },
];

const handleSubmit = (urlParam, values, history) => {
  console.log('Submitting values', values);
  const queryParams = values ? `?${stringify({ [urlParam]: values.join(',') })}` : '';
  history.push(`${window.location.pathname}${queryParams}`);
};

const YogaStylesFilterPopup = withRouter(props => {
  const { history, location } = props;

  const params = parse(location.search);
  const yogaStyles = params[URL_PARAM];
  const initialValues = !!yogaStyles ? yogaStyles.split(',') : [];

  return (
    <SelectMultipleFilter
      id="SelectMultipleFilterPopupExample"
      name="yogaStyles"
      urlParam={URL_PARAM}
      label="yogaStyles"
      onSubmit={(urlParam, values) => handleSubmit(urlParam, values, history)}
      showAsPopup={true}
      liveEdit={false}
      options={options}
      initialValues={initialValues}
      contentPlacementOffset={-14}
    />
  );
});

export const YogaStylesFilterPopupExample = {
  component: YogaStylesFilterPopup,
  props: {},
  group: 'filters',
};

const YogaStylesFilterPlain = withRouter(props => {
  const { history, location } = props;

  const params = parse(location.search);
  const yogaStyles = params[URL_PARAM];
  const initialValues = !!yogaStyles ? yogaStyles.split(',') : [];

  return (
    <SelectMultipleFilter
      id="SelectMultipleFilterPlainExample"
      name="yogaStyles"
      urlParam={URL_PARAM}
      label="yogaStyles"
      onSubmit={(urlParam, values) => {
        handleSubmit(urlParam, values, history);
      }}
      showAsPopup={false}
      liveEdit={true}
      options={options}
      initialValues={initialValues}
    />
  );
});

export const YogaStylesFilterPlainExample = {
  component: YogaStylesFilterPlain,
  props: {},
  group: 'filters',
};
