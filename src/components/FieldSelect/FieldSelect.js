import React from 'react';
import { func, node, object, string } from 'prop-types';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { ValidationError } from '../../components';

import css from './FieldSelect.css';

const handleChange = (propsOnChange, inputOnChange) => event => {
  if (propsOnChange) {
    const value = event.nativeEvent.target.value;
    propsOnChange(value);
  }
  inputOnChange(event);
};

const FieldSelectComponent = props => {
  const {
    rootClassName,
    className,
    selectClassName,
    id,
    label,
    input,
    meta,
    children,
    onChange,
    ...rest
  } = props;

  if (label && !id) {
    throw new Error('id required when a label is given');
  }

  const { valid, invalid, touched, error } = meta;

  // Error message and input error styles are only shown if the
  // field has been touched and the validation has failed.
  const hasError = touched && invalid && error;

  const selectClasses = classNames(selectClassName, css.select, {
    [css.selectSuccess]: valid,
    [css.selectError]: hasError,
  });

  const { onChange: inputOnChange, ...restOfInput } = input;
  const selectProps = {
    className: selectClasses,
    id,
    onChange: handleChange(onChange, inputOnChange),
    ...restOfInput,
    ...rest,
  };

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <select {...selectProps}>{children}</select>
      <ValidationError fieldMeta={meta} />
    </div>
  );
};

FieldSelectComponent.defaultProps = {
  rootClassName: null,
  className: null,
  selectClassName: null,
  id: null,
  label: null,
  children: null,
};

FieldSelectComponent.propTypes = {
  rootClassName: string,
  className: string,
  selectClassName: string,

  onChange: func,

  // Label is optional, but if it is given, an id is also required so
  // the label can reference the input in the `for` attribute
  id: string,
  label: string,

  // Generated by final-form's Field component
  input: object.isRequired,
  meta: object.isRequired,

  children: node,
};

const FieldSelect = props => {
  return <Field component={FieldSelectComponent} {...props} />;
};

export default FieldSelect;
