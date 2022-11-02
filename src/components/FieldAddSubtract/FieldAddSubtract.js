import React, { Component } from 'react';
import { func, instanceOf, object, node, string, bool, number } from 'prop-types';
import { Field } from 'react-final-form';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ValidationError } from '..';

import css from './FieldAddSubtract.module.css';

const handleChange = (propsOnChange, inputOnChange) => event => {
  // If "onChange" callback is passed through the props,
  // it can notify the parent when the content of the input has changed.
  if (propsOnChange) {
    // "handleChange" function is attached to the low level <select> component
    // value of the element needs to be picked from target
    const value = event.nativeEvent.target.value;
    propsOnChange(value);
  }
  // Notify Final Form that the input has changed.
  // (Final Form knows how to deal with synthetic events of React.)
  inputOnChange(event);
};

class AddSubtractComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 0,
    };
  }

  componentDidMount() {
    this.setState(state => ({
      currentCount: Number.parseInt(this.props.startingCount),
    }));
  }

  add = () => {
    this.setState(state => ({
      currentCount: state.currentCount + 1,
    }));
  };

  subtract = () => {
    this.setState(state => ({
      currentCount: state.currentCount - 1,
    }));
  };

  render() {
    const {
      className,
      id,
      buttonClassName,
      countClassName,
      startingCount,
      countLabel,
      onChange,
      label,
      input,
      meta,
      ...rest
    } = this.props;

    const { valid, invalid, touched, error } = meta;

    const { onChange: inputOnChange, ...restOfInput } = input;
    const spanProps = {
      className,
      id,
      onChange: handleChange(onChange, inputOnChange),
      ...restOfInput,
      ...rest,
    };

    return (
      <div className={className}>
        {label ? <label>{label}</label> : null}
        <div>
          <button onClick={this.subtract} className={css.buttonClassName}>
            -
          </button>
          <span {...spanProps}>{this.state.currentCount}</span>
          <button onClick={this.add} className={css.buttonClassName}>
            +
          </button>
        </div>
        <div>{countLabel}</div>
        <ValidationError fieldMeta={meta} />
      </div>
    );
  }
}

AddSubtractComponent.defaultProps = {
  className: null,
  buttonClassName: null,
  countClassName: null,
  startingCount: 0,
  countLabel: null,
  label: null,
};

AddSubtractComponent.propTypes = {
  className: string,
  buttonClassName: string,
  countClassName: string,
  startingCount: string,
  countLabel: string,
  label: string,
  onChange: func,

  input: object.isRequired,
  meta: object.isRequired,
  id: string,
};

const FieldAddSubtract = props => {
  return <Field component={AddSubtractComponent} {...props} />;
};

export default FieldAddSubtract;
