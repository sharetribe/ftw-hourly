import React, { Component } from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '../../util/reactIntl';
import debounce from 'lodash/debounce';
import { FieldTextInput } from '..';

import { FilterPopup, FilterPlain } from '..';
import css from './DistanceFilter.module.css';

// When user types, we wait for new keystrokes a while before searching new content
const DEBOUNCE_WAIT_TIME = 600;
// Short search queries (e.g. 2 letters) have a longer timeout before search is made
const TIMEOUT_FOR_SHORT_QUERIES = 2000;

const getDistanceQueryParam = queryParamNames => {
  return Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
    ? queryParamNames
    : 'distance';
};

class DistanceFilter extends Component {
  constructor(props) {
    super(props);

    this.filter = null;
    this.filterContent = null;
    this.shortDistanceTimeout = null;
    this.mobileInputRef = React.createRef();

    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  componentWillUnmount() {
    window.clearTimeout(this.shortDistanceTimeout);
  }

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      name,
      label,
      initialValues,
      contentPlacementOffset,
      onSubmit,
      queryParamNames,
      intl,
      showAsPopup,
      ...rest
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);

    const urlParam = getDistanceQueryParam(queryParamNames);
    const hasInitialValues =
      !!initialValues && !!initialValues[urlParam] && initialValues[urlParam].length > 0;
    const labelForPopup = hasInitialValues
      ? intl.formatMessage(
          { id: 'DistanceFilter.labelSelected' },
          { labelText: initialValues[urlParam] }
        )
      : label;

    const labelForPlain = hasInitialValues
      ? intl.formatMessage(
          { id: 'DistanceFilterPlainForm.labelSelected' },
          { labelText: initialValues[urlParam] }
        )
      : label;

    const filterText = intl.formatMessage({ id: 'DistanceFilter.filterText' });

    const placeholder = intl.formatMessage({ id: 'DistanceFilter.placeholder' });

    const contentStyle = this.positionStyleForContent();

    // pass the initial values with the name key so that
    // they can be passed to the correct field
    const namedInitialValues = { [name]: initialValues[urlParam] };

    const handleSubmit = values => {
      const usedValue = values ? values[name] : values;
      onSubmit({ [urlParam]: usedValue });
    };

    const debouncedSubmit = debounce(handleSubmit, DEBOUNCE_WAIT_TIME, {
      leading: false,
      trailing: true,
    });
    // Use timeout for shart queries and debounce for queries with any length
    const handleChangeWithDebounce = values => {
      // handleSubmit gets values as params.
      // If this field ("Distance") is short, create timeout
      const hasDistanceValue = values && values[name];
      const DistanceValue = hasDistanceValue ? values && values[name] : '';
      if (!hasDistanceValue || (hasDistanceValue && DistanceValue.length >= 3)) {
        if (this.shortDistanceTimeout) {
          window.clearTimeout(this.shortDistanceTimeout);
        }
        return debouncedSubmit(values);
      } else {
        this.shortDistanceTimeout = window.setTimeout(() => {
          // if mobileInputRef exists, use the most up-to-date value from there
          return this.mobileInputRef && this.mobileInputRef.current
            ? handleSubmit({ ...values, [name]: this.mobileInputRef.current.value })
            : handleSubmit(values);
        }, TIMEOUT_FOR_SHORT_QUERIES);
      }
    };

    // Uncontrolled input needs to be cleared through the reference to DOM element.
    const handleClear = () => {
      if (this.mobileInputRef && this.mobileInputRef.current) {
        this.mobileInputRef.current.value = '';
      }
    };

    return showAsPopup ? (
      <FilterPopup
        className={classes}
        rootPopupClassName={css.popupRoot}
        name={name}
        label={labelForPopup}
        isSelected={hasInitialValues}
        id={`${id}.popup`}
        showAsPopup
        labelMaxWidth={250}
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        initialValues={namedInitialValues}
        keepDirtyOnReinitialize
        {...rest}
      >
        <div>
          <FieldTextInput
            className={css.field}
            name={name}
            id={`${id}-input`}
            type="text"
            label={filterText}
            placeholder={placeholder}
            autoComplete="off"
          />
          <label className={css.unitLabel}>
            {intl.formatMessage({ id: 'DistanceFilter.unit' })}
          </label>
        </div>
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={hasInitialValues}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentStyle}
        onSubmit={handleChangeWithDebounce}
        onClear={handleClear}
        initialValues={namedInitialValues}
        {...rest}
      >
        <fieldset className={css.fieldPlain}>
          <label>{filterText}</label>
          <FieldTextInput
            name={name}
            id={`${id}-input`}
            isUncontrolled
            inputRef={this.mobileInputRef}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
          />
        </fieldset>
      </FilterPlain>
    );
  }
}

DistanceFilter.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

DistanceFilter.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  queryParamNames: arrayOf(string).isRequired,
  label: string.isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    Distance: string,
  }),
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(DistanceFilter);
