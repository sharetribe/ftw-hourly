import React, { Component } from 'react';
import { func, object, shape, string, bool } from 'prop-types';
import { Field } from 'react-final-form';
import { ValidationError } from '../../components';
import LocationAutocompleteInputImpl from './LocationAutocompleteInputImpl.js';

class LocationAutocompleteInputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.onChangeLoading = this.onChangeLoading.bind(this);
  }

  onChangeLoading = () => {
    this.setState(prevState => {
      const isLoading = !prevState.isLoading;
      return { isLoading };
    });

    console.log(this.state.isLoading);
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { rootClassName, labelClassName, ...restProps } = this.props;
    const { input, label, meta, valueFromForm, useCurrentLocation, ...otherProps } = restProps;
    /* eslint-enable no-unused-vars */

    const value = typeof valueFromForm !== 'undefined' ? valueFromForm : input.value;
    const locationAutocompleteProps = {
      label,
      meta,
      ...otherProps,
      input: { ...input, value },
      useCurrentLocation,
      onChangeLoading: this.onChangeLoading,
    };
    const labelInfo = label ? (
      <label className={labelClassName} htmlFor={input.name}>
        {label}
      </label>
    ) : null;

    return (
      <div className={rootClassName}>
        {labelInfo}
        <LocationAutocompleteInputImpl {...locationAutocompleteProps} />
        {!this.state.isLoading && <ValidationError fieldMeta={meta} />}
      </div>
    );
  }
}

LocationAutocompleteInputComponent.defaultProps = {
  rootClassName: null,
  labelClassName: null,
  type: null,
  label: null,
  useCurrentLocation: false,
};

LocationAutocompleteInputComponent.propTypes = {
  rootClassName: string,
  labelClassName: string,
  input: shape({
    onChange: func.isRequired,
    name: string.isRequired,
  }).isRequired,
  label: string,
  meta: object.isRequired,
  useCurrentLocation: bool,
};

export default LocationAutocompleteInputImpl;

export const LocationAutocompleteInputField = props => {
  return <Field component={LocationAutocompleteInputComponent} {...props} />;
};
