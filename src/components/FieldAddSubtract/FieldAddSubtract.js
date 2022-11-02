import React, { Component } from 'react';
import { func, instanceOf, object, node, string, bool, number } from 'prop-types';
import { Field } from 'react-final-form';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ValidationError } from '..';
import { Button } from '../../components';

import css from './FieldAddSubtract.module.css';

class AddSubtractComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 0,
    };
  }

  componentDidMount() {
    this.setState(state => ({
      currentCount: this.props.startingCount,
    }));

    this.props.input.onChange(this.state.currentCount);
  }

  render() {
    const {
      rootClassName,
      buttonClassName,
      countClassName,
      fieldClassName,
      id,
      startingCount,
      countLabel,
      label,
      input,
      meta,
      ...rest
    } = this.props;

    const { onChange: inputOnChange, ...restOfInput } = input;

    const add = async () => {
      await this.setState(state => ({
        currentCount: state.currentCount + 1,
      }));

      inputOnChange(this.state.currentCount);
    };

    const subtract = async () => {
      await this.setState(state => ({
        currentCount: state.currentCount - 1,
      }));

      inputOnChange(this.state.currentCount);
    };

    const spanProps = {
      className: css.counter + ' ' + css.largeCount,
      id,
      ...restOfInput,
      ...rest,
    };

    const classes = classNames(rootClassName || css.root);

    const fieldClass = classNames(fieldClassName || css.fieldRoot);

    console.log(startingCount);

    return (
      <div className={classes}>
        {label ? (
          <label className={css.fieldLabel} htmlFor={input.name}>
            {label}
          </label>
        ) : null}
        <div className={fieldClass}>
          <Button type="button" onClick={subtract} className={css.button}>
            -
          </Button>
          <div class={css.count}>
            <div {...spanProps}>{this.state.currentCount}</div>
            <div className={css.counter}>{countLabel}</div>
          </div>
          <Button type="button" onClick={add} className={css.button}>
            +
          </Button>
        </div>
        <div className={fieldClass}></div>
        <ValidationError fieldMeta={meta} />
      </div>
    );
  }
}

AddSubtractComponent.defaultProps = {
  rootClassName: null,
  buttonClassName: null,
  countClassName: null,
  fieldClassName: null,
  startingCount: 0,
  countLabel: null,
  label: null,
};

AddSubtractComponent.propTypes = {
  rootClassName: string,
  buttonClassName: string,
  countClassName: string,
  fieldClassName: string,
  startingCount: number,
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
