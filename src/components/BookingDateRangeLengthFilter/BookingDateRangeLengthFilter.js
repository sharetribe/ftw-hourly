import React, { Component } from 'react';
import { bool, func, number, object, string } from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';

import { FieldDateRangeController, FieldSelect, FilterPopup, FilterPlain } from '../../components';
import { propTypes } from '../../util/types';
import css from './BookingDateRangeLengthFilter.css';

const formatSelectedLabel = (minDurationOptions, minDuration, startDate, endDate) => {
  // Only show the minimum duration label for options whose key
  // matches the given param and that have the short label defined.
  const minDurationOption =
    typeof minDuration === 'number'
      ? minDurationOptions.find(option => {
          return minDuration.toString() === option.key && option.shortLabel;
        })
      : null;
  return minDurationOption
    ? `${startDate} - ${endDate}, ${minDurationOption.shortLabel}`
    : `${startDate} - ${endDate}`;
};

export class BookingDateRangeLengthFilterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We need to sync the currently selected dates from the
      // datepicker so we can enable the min duration only when there
      // are dates selected.
      selectedDates: null,
    };

    this.popupControllerRef = null;
    this.plainControllerRef = null;
  }

  render() {
    const {
      className,
      rootClassName,
      dateRangeLengthFilter,
      showAsPopup,
      initialDateValues: initialDateValuesRaw,
      initialDurationValue,
      id,
      contentPlacementOffset,
      onSubmit,
      datesUrlParam,
      durationUrlParam,
      intl,
      ...rest
    } = this.props;

    const isDatesSelected = !!initialDateValuesRaw && !!initialDateValuesRaw.dates;
    const initialDateValues = isDatesSelected ? initialDateValuesRaw : { dates: null };

    const startDate = isDatesSelected ? initialDateValues.dates.startDate : null;
    const endDate = isDatesSelected ? initialDateValues.dates.endDate : null;

    const format = {
      month: 'short',
      day: 'numeric',
    };

    const formattedStartDate = isDatesSelected ? intl.formatDate(startDate, format) : null;
    const formattedEndDate = isDatesSelected ? intl.formatDate(endDate, format) : null;

    const labelForPlain = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPlain' },
          {
            dates: formatSelectedLabel(
              dateRangeLengthFilter.config.options,
              initialDurationValue,
              formattedStartDate,
              formattedEndDate
            ),
          }
        )
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPlain' });

    const labelForPopup = isDatesSelected
      ? intl.formatMessage(
          { id: 'BookingDateRangeLengthFilter.labelSelectedPopup' },
          {
            dates: formatSelectedLabel(
              dateRangeLengthFilter.config.options,
              initialDurationValue,
              formattedStartDate,
              formattedEndDate
            ),
          }
        )
      : intl.formatMessage({ id: 'BookingDateRangeLengthFilter.labelPopup' });

    const minDurationLabel = intl.formatMessage({
      id: 'BookingDateRangeLengthFilter.minDurationLabel',
    });

    const onClearPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? {
            onClear: () => {
              this.setState({ selectedDates: null });
              this.popupControllerRef.onReset(null, null);
            },
          }
        : {};

    const onCancelPopupMaybe =
      this.popupControllerRef && this.popupControllerRef.onReset
        ? {
            onCancel: () => {
              this.setState({ selectedDates: null });
              this.popupControllerRef.onReset(startDate, endDate);
            },
          }
        : {};

    const onClearPlainMaybe =
      this.plainControllerRef && this.plainControllerRef.onReset
        ? {
            onClear: () => {
              this.setState({ selectedDates: null });
              this.plainControllerRef.onReset(null, null);
            },
          }
        : {};

    const handleSubmit = (param, values) => {
      this.setState({ selectedDates: null });
      onSubmit(values);
    };

    const handleChange = (param, values) => {
      this.setState({ selectedDates: values[datesUrlParam] });
    };

    const datesSelected = !!(initialDateValues.dates || this.state.selectedDates);

    const initialValues = {
      ...initialDateValues,
      minDuration: initialDurationValue,
    };

    const fields = (
      <>
        <FieldDateRangeController
          name={datesUrlParam}
          controllerRef={node => {
            this.popupControllerRef = node;
          }}
        />
        <FieldSelect
          id="BookingDateRangeLengthFilter.duration"
          name={durationUrlParam}
          label={minDurationLabel}
          className={css.duration}
          disabled={!datesSelected}
        >
          {dateRangeLengthFilter.config.options.map(({ key, label }) => {
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </FieldSelect>
      </>
    );

    return showAsPopup ? (
      <FilterPopup
        className={className}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        label={labelForPopup}
        isSelected={isDatesSelected}
        id={`${id}.popup`}
        showAsPopup
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        onChange={handleChange}
        {...onClearPopupMaybe}
        {...onCancelPopupMaybe}
        initialValues={initialValues}
        urlParam={datesUrlParam}
        {...rest}
      >
        {fields}
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={isDatesSelected}
        id={`${id}.plain`}
        liveEdit
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        {...onClearPlainMaybe}
        initialValues={initialValues}
        urlParam={datesUrlParam}
        {...rest}
      >
        {fields}
      </FilterPlain>
    );
  }
}

BookingDateRangeLengthFilterComponent.defaultProps = {
  rootClassName: null,
  className: null,
  dateRangeLengthFitler: null,
  showAsPopup: true,
  liveEdit: false,
  initialDateValues: null,
  initialDurationValue: null,
  contentPlacementOffset: 0,
};

BookingDateRangeLengthFilterComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  dateRangeLengthFitler: propTypes.filterConfig,
  showAsPopup: bool,
  liveEdit: bool,
  datesUrlParam: string.isRequired,
  durationUrlParam: string.isRequired,
  onSubmit: func.isRequired,
  initialDateValues: object,
  initialDurationValue: number,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

const BookingDateRangeLengthFilter = injectIntl(BookingDateRangeLengthFilterComponent);

export default BookingDateRangeLengthFilter;
