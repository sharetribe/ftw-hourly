import React, { Component } from 'react';
import { FormSpy } from 'react-final-form';
import { object, string } from 'prop-types';
import classNames from 'classnames';
import { FieldDateInput, FieldSelect } from '../../components';
import { intlShape } from '../../util/reactIntl';
import {
  getStartHours,
  getEndHours,
  isInRange,
  isSameDate,
  resetToStartOfDay,
  dateIsAfter,
  findNextBoundary,
  timestampToDate,
  localDateToSelectedTimezone,
  monthIdStringInTimeZone,
} from '../../util/dates';

import css from './FieldDateAndTimeInput.css';

const getAvailableStartTimes = (intl, timeZone, bookingStart, timeSlotsOnSelectedDate) => {
  if (!timeSlotsOnSelectedDate[0] || !bookingStart) {
    return [];
  }
  const bookingStartDate = resetToStartOfDay(bookingStart, timeZone);

  const allHours = timeSlotsOnSelectedDate.reduce((availableHours, t) => {
    const startDate = t.attributes.start;
    const endDate = t.attributes.end;
    const nextDate = resetToStartOfDay(bookingStartDate, timeZone, 1);

    // If the start date is after timeslot start, use the start date.
    // Otherwise use the timeslot start time.
    const startLimit = dateIsAfter(bookingStartDate, startDate) ? bookingStartDate : startDate;

    // If date next to selected start date is inside timeslot use the next date to get the hours of full day.
    // Otherwise use the end of the timeslot.
    const endLimit = dateIsAfter(endDate, nextDate) ? nextDate : endDate;

    const hours = getStartHours(intl, timeZone, startLimit, endLimit);
    return availableHours.concat(hours);
  }, []);
  return allHours;
};

const getAvailableEndTimes = (
  intl,
  timeZone,
  bookingStartTime,
  bookingEndDate,
  selectedTimeSlot
) => {
  if (!selectedTimeSlot || !selectedTimeSlot.attributes || !bookingEndDate || !bookingStartTime) {
    return [];
  }

  const endDate = selectedTimeSlot.attributes.end;
  const bookingStartTimeAsDate = timestampToDate(bookingStartTime);

  const dayAfterBookingEnd = resetToStartOfDay(bookingEndDate, timeZone, 1);
  const dayAfterBookingStart = resetToStartOfDay(bookingStartTimeAsDate, timeZone, 1);
  const startOfEndDay = resetToStartOfDay(bookingEndDate, timeZone);

  let startLimit;
  let endLimit;

  if (!dateIsAfter(startOfEndDay, bookingStartTimeAsDate)) {
    startLimit = bookingStartTimeAsDate;
    endLimit = dateIsAfter(dayAfterBookingStart, endDate) ? endDate : dayAfterBookingStart;
  } else {
    // If the end date is on the same day as the selected booking start time
    // use the start time as limit. Otherwise use the start of the selected end date.
    startLimit = dateIsAfter(bookingStartTimeAsDate, startOfEndDay)
      ? bookingStartTimeAsDate
      : startOfEndDay;

    // If the selected end date is on the same day as timeslot end, use the timeslot end.
    // Else use the start of the next day after selected date.
    endLimit = isSameDate(resetToStartOfDay(endDate, timeZone), startOfEndDay)
      ? endDate
      : dayAfterBookingEnd;
  }

  return getEndHours(intl, timeZone, startLimit, endLimit);
};

const getTimeSlots = (timeSlots, date) => {
  return timeSlots && timeSlots[0]
    ? timeSlots.filter(t => isInRange(date, t.attributes.start, t.attributes.end, 'day'))
    : [];
};

// Use start date to calculate the first possible start time or times, end date and end time or times.
// If the selected value is passed to function it will be used instead of calculated value.
const getAllTimeValues = (
  intl,
  timeZone,
  timeSlots,
  startDate,
  selectedStartTime,
  selectedEndDate
) => {
  const startTimes = selectedStartTime
    ? []
    : getAvailableStartTimes(intl, timeZone, startDate, getTimeSlots(timeSlots, startDate));

  const startTime = selectedStartTime
    ? selectedStartTime
    : startTimes[0]
    ? startTimes[0].timestamp
    : null;

  const startTimeAsDate = startTime ? timestampToDate(startTime) : null;

  const endDate = selectedEndDate ? selectedEndDate : findNextBoundary(timeZone, startTimeAsDate);

  const selectedTimeSlot = timeSlots.find(t =>
    isInRange(startTimeAsDate, t.attributes.start, t.attributes.end)
  );

  const endTimes = getAvailableEndTimes(intl, timeZone, startTime, endDate, selectedTimeSlot);
  const endTime = endTimes[0] ? endTimes[0].timestamp : null;

  return { startTime, endDate, endTime, selectedTimeSlot };
};

const getMonthlyTimeSlots = (monthlyTimeSlots, date, timeZone) => {
  const monthId = monthIdStringInTimeZone(date, timeZone);

  return !monthlyTimeSlots || Object.keys(monthlyTimeSlots).length === 0
    ? []
    : monthlyTimeSlots[monthId] && monthlyTimeSlots[monthId].timeSlots
    ? monthlyTimeSlots[monthId].timeSlots
    : [];
};

class FieldDateAndTimeInput extends Component {
  constructor(props) {
    super(props);
    const { intl, timeZone, monthlyTimeSlots, form, values } = props;
    const startDate = localDateToSelectedTimezone(values.bookingStartDate.date, timeZone);
    const timeSlots = getMonthlyTimeSlots(monthlyTimeSlots, new Date(), timeZone);

    // Calculate the first values based on the initial start date
    // and change form values to these calculated values
    const { startTime, endDate, endTime, selectedTimeSlot } = getAllTimeValues(
      intl,
      timeZone,
      timeSlots,
      startDate
    );

    this.state = {
      bookingStartDate: startDate,
      bookingStartTime: startTime,
      bookingEndDate: endDate,
      bookingEndTime: endTime,
      selectedTimeSlot,
    };

    form.change('bookingStartTime', startTime);
    form.change('bookingEndDate', { date: endDate });
    form.change('bookingEndTime', endTime);

    this.onBookingStartDateChange = this.onBookingStartDateChange.bind(this);
    this.onBookingStartTimeChange = this.onBookingStartTimeChange.bind(this);
    this.onBookingEndDateChange = this.onBookingEndDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onBookingStartDateChange = (timeSlots, intl, timeZone, values, form) => {
    const startDate = localDateToSelectedTimezone(values.bookingStartDate.date, timeZone);
    const timeSlotsOnSelectedDate = getTimeSlots(timeSlots, startDate);

    const { startTime, endDate, endTime, selectedTimeSlot } = getAllTimeValues(
      intl,
      timeZone,
      timeSlotsOnSelectedDate,
      values.bookingStartDate.date
    );

    this.setState(
      {
        bookingStartDate: values.bookingStartDate.date,
        bookingStartTime: startTime,
        bookingEndDate: endDate,
        bookingEndTime: endTime,
        selectedTimeSlot,
      },
      () => {
        form.change('bookingStartTime', startTime);
        form.change('bookingEndDate', {
          date: endDate,
        });
        form.change('bookingEndTime', endTime);
      }
    );
  };

  onBookingStartTimeChange = (timeSlots, intl, timeZone, values, form) => {
    const startTime = values.bookingStartTime;
    const startDate = this.state.bookingStartDate;
    const timeSlotsOnSelectedDate = getTimeSlots(timeSlots, startDate);

    const { endDate, endTime, selectedTimeSlot } = getAllTimeValues(
      intl,
      timeZone,
      timeSlotsOnSelectedDate,
      startDate,
      startTime
    );

    this.setState(
      {
        bookingStartTime: values.bookingStartTime,
        bookingEndDate: endDate,
        bookingEndTime: endTime,
        selectedTimeSlot,
      },
      () => {
        form.change('bookingEndDate', {
          date: endDate,
        });
        form.change('bookingEndTime', endTime);
      }
    );
  };

  onBookingEndDateChange = (timeSlots, intl, timeZone, values, form) => {
    const startDate = this.state.bookingStartDate;
    const timeSlotsOnSelectedDate = getTimeSlots(timeSlots, startDate);
    const { endDate, endTime } = getAllTimeValues(
      intl,
      timeZone,
      timeSlotsOnSelectedDate,
      startDate,
      this.state.bookingStartTime,
      values.bookingEndDate.date
    );

    this.setState(
      {
        bookingEndDate: endDate,
        bookingEndTime: endTime,
      },
      () => {
        form.change('bookingEndTime', endTime);
      }
    );
  };

  handleChange = formState => {
    const { monthlyTimeSlots, timeZone, intl, form } = this.props;
    const { dirtyFields, values } = formState;
    const timeSlots = getMonthlyTimeSlots(monthlyTimeSlots, new Date(), timeZone);

    const shouldCalculateValues = timeSlots.length > 0 && (!values || !values.bookingStartTime);
    if (
      shouldCalculateValues ||
      (dirtyFields &&
        dirtyFields.bookingStartDate &&
        !isSameDate(values.bookingStartDate.date, this.state.bookingStartDate))
    ) {
      this.onBookingStartDateChange(timeSlots, intl, timeZone, values, form);
    }

    if (
      dirtyFields &&
      dirtyFields.bookingStartTime &&
      values.bookingStartTime !== this.state.bookingStartTime
    ) {
      this.onBookingStartTimeChange(timeSlots, intl, timeZone, values, form);
    }

    if (
      dirtyFields &&
      dirtyFields.bookingEndDate &&
      values.bookingEndDate.date !== this.state.bookingEndDate
    ) {
      this.onBookingEndDateChange(timeSlots, intl, timeZone, values, form);
    }

    if (
      dirtyFields &&
      dirtyFields.bookingEndTime &&
      values.bookingEndTime !== this.state.bookingEndTime
    ) {
      this.setState({
        bookingEndTime: values.bookingEndTime,
      });
    }
  };

  render() {
    const {
      rootClassName,
      className,
      startDateInputProps,
      endDateInputProps,
      startTimeInputProps,
      endTimeInputProps,
      values,
      monthlyTimeSlots,
      timeZone,
      intl,
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);

    const bookingStartDate = values.bookingStartDate
      ? values.bookingStartDate.date
      : this.state.bookingStartDate;
    const bookingStartTime = values.bookingStartTime
      ? values.bookingStartTime
      : this.state.bookingStartTime;
    const bookingEndDate = values.bookingEndDate
      ? values.bookingEndDate.date
      : this.state.bookingEndDate;

    const startTimeDisabled = !bookingStartDate;
    const endDateDisabled = !bookingStartDate || !bookingStartTime;
    const endTimeDisabled = !bookingStartDate || !bookingStartTime || !bookingEndDate;

    const timeSlotsOnSelectedMonth = getMonthlyTimeSlots(monthlyTimeSlots, new Date(), timeZone);
    const timeSlotsOnSelectedDate = getTimeSlots(timeSlotsOnSelectedMonth, bookingStartDate);

    const availableStartTimes = getAvailableStartTimes(
      intl,
      timeZone,
      bookingStartDate,
      timeSlotsOnSelectedDate
    );

    const availableEndTimes = getAvailableEndTimes(
      intl,
      timeZone,
      this.state.bookingStartTime,
      this.state.bookingEndDate,
      this.state.selectedTimeSlot
    );

    return (
      <div className={classes}>
        <FormSpy onChange={this.handleChange} />
        <div className={css.formRow}>
          <div className={css.field}>
            <FieldDateInput
              {...startDateInputProps}
              format={value => ({
                date: resetToStartOfDay(value.date, timeZone),
              })}
              timeSlots={timeSlotsOnSelectedMonth}
              timeZone={timeZone}
            />
          </div>
          <div className={css.field}>
            <FieldSelect
              {...startTimeInputProps}
              selectClassName={css.fieldSelect}
              disabled={startTimeDisabled}
            >
              {this.state.bookingStartDate ? (
                availableStartTimes.map(p => (
                  <option key={p.timeOfDay} value={p.timestamp}>
                    {p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>--:--</option>
              )}
            </FieldSelect>
          </div>
        </div>
        <div className={css.formRow}>
          <div className={css.field}>
            <FieldDateInput
              {...endDateInputProps}
              format={value =>
                value && value.date ? { date: resetToStartOfDay(value.date, timeZone) } : value
              }
              timeSlots={timeSlotsOnSelectedDate}
              timeZone={timeZone}
              isOutsideRange={day => {
                if (!this.state.selectedTimeSlot) {
                  return true;
                }

                const endDate = resetToStartOfDay(
                  this.state.selectedTimeSlot.attributes.end,
                  timeZone,
                  1
                );
                const startDate = resetToStartOfDay(this.state.bookingStartDate, timeZone);
                const outsideRange = !(dateIsAfter(day, startDate) && dateIsAfter(endDate, day));
                return outsideRange;
              }}
              disabled={endDateDisabled}
            />
          </div>
          <div className={css.field}>
            <FieldSelect
              {...endTimeInputProps}
              selectClassName={css.fieldSelect}
              disabled={endTimeDisabled}
            >
              {this.state.bookingStartDate && this.state.bookingStartTime ? (
                availableEndTimes.map(p => (
                  <option key={p.timeOfDay} value={p.timestamp}>
                    {p.timeOfDay}
                  </option>
                ))
              ) : (
                <option>--:--</option>
              )}
            </FieldSelect>
          </div>
        </div>
      </div>
    );
  }
}

FieldDateAndTimeInput.defaultProps = {
  rootClassName: null,
  className: null,
  startDateInputProps: null,
  endDateInputProps: null,
  startTimeInputProps: null,
  endTimeInputProps: null,
  monthlyTimeSlots: null,
  timeZone: null,
};

FieldDateAndTimeInput.propTypes = {
  rootClassName: string,
  className: string,
  startDateInputProps: object,
  endDateInputProps: object,
  startTimeInputProps: object,
  endTimeInputProps: object,
  form: object.isRequired,
  values: object.isRequired,
  monthlyTimeSlots: object,
  timeZone: string,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default FieldDateAndTimeInput;
