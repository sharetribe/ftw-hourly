import React from 'react';
import { bool, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import {
  Form,
  InlineTextButton,
  IconClose,
  PrimaryButton,
  FieldSelect,
  FieldTimeZoneSelect,
} from '../../components';

import css from './EditListingAvailabilityPlanForm.module.css';

const printHourStrings = h => {
  if (h === 0 || h === 24) {
    return '12:00am';
  }

  if (h === 12) {
    return '12:00pm';
  }

  if (h > 12) {
    h = h % 12;
    return `${h}:00pm`;
  }

  return `${h}:00am`;
};

const timeOrderMap = new Map([
  ['12:00am', 0],
  ['1:00am', 1],
  ['2:00am', 2],
  ['3:00am', 3],
  ['4:00am', 4],
  ['5:00am', 5],
  ['6:00am', 6],
  ['7:00am', 7],
  ['8:00am', 8],
  ['9:00am', 9],
  ['10:00am', 10],
  ['11:00am', 11],
  ['12:00pm', 12],
  ['1:00pm', 13],
  ['2:00pm', 14],
  ['3:00pm', 15],
  ['4:00pm', 16],
  ['5:00pm', 17],
  ['6:00pm', 18],
  ['7:00pm', 19],
  ['8:00pm', 20],
  ['9:00pm', 21],
  ['10:00pm', 22],
  ['11:00pm', 23],
]);

const HOURS = Array(24).fill();
const ALL_START_HOURS = [...HOURS].map((v, i) => printHourStrings(i));
const ALL_END_HOURS = [...HOURS].map((v, i) => printHourStrings(i + 1));

const sortEntries = (defaultCompareReturn = 0) => (a, b) => {
  if (a.startTime && b.startTime) {
    const aStart = Number.parseInt(a.startTime.split(':')[0]);
    const bStart = Number.parseInt(b.startTime.split(':')[0]);
    return aStart - bStart;
  }
  return defaultCompareReturn;
};

const findEntryFn = entry => e => e.startTime === entry.startTime && e.endTime === entry.endTime;

const filterStartHours = (availableStartHours, values, dayOfWeek, index) => {
  const entries = values[dayOfWeek];
  const currentEntry = entries[index];

  // If there is no end time selected, return all the available start times
  if (!currentEntry.endTime || currentEntry.endTime === '12:00am') {
    return availableStartHours;
  }

  // By default the entries are not in order so we need to sort the entries by startTime
  // in order to find out the previous entry
  const sortedEntries = [...entries].sort(sortEntries());

  // Find the index of the current entry from sorted entries
  const currentIndex = sortedEntries.findIndex(findEntryFn(currentEntry));

  // If there is no next entry or the previous entry does not have endTime,
  // return all the available times before current selected end time.
  // Otherwise return all the available start times that are after the previous entry or entries.
  const prevEntry = sortedEntries[currentIndex - 1];
  const pickBefore = time => h => {
    return timeOrderMap.get(h) < timeOrderMap.get(time);
  };
  const pickBetween = (start, end) => h =>
    timeOrderMap.get(h) >= timeOrderMap.get(start) && timeOrderMap.get(h) < timeOrderMap.get(end);

  return !prevEntry || !prevEntry.endTime
    ? availableStartHours.filter(pickBefore(currentEntry.endTime))
    : availableStartHours.filter(pickBetween(prevEntry.endTime, currentEntry.endTime));
};

const filterEndHours = (availableEndHours, values, dayOfWeek, index) => {
  const entries = values[dayOfWeek];
  const currentEntry = entries[index];

  // If there is no start time selected, return an empty array;
  if (!currentEntry.startTime) {
    return [];
  }

  if (currentEntry.startTime === '12:00am') {
    return availableEndHours;
  }

  // By default the entries are not in order so we need to sort the entries by startTime
  // in order to find out the allowed start times
  const sortedEntries = [...entries].sort(sortEntries(-1));

  // Find the index of the current entry from sorted entries
  const currentIndex = sortedEntries.findIndex(findEntryFn(currentEntry));

  // If there is no next entry,
  // return all the available end times that are after the start of current entry.
  // Otherwise return all the available end hours between current start time and next entry.
  const nextEntry = sortedEntries[currentIndex + 1];
  const pickAfter = time => h => {
    return timeOrderMap.get(h) > timeOrderMap.get(time);
  };
  const pickBetween = (start, end) => h =>
    timeOrderMap.get(h) > timeOrderMap.get(start) && timeOrderMap.get(h) <= timeOrderMap.get(end);

  let availableHours = null;

  !nextEntry || !nextEntry.startTime
    ? (availableHours = availableEndHours.filter(pickAfter(currentEntry.startTime)))
    : (availableHours = availableEndHours.filter(
        pickBetween(currentEntry.startTime, nextEntry.startTime)
      ));

  nextEntry ? availableHours.push('12:00am') : null;

  return availableHours;
};

const getEntryBoundaries = (values, dayOfWeek, intl, findStartHours) => index => {
  const entries = values[dayOfWeek];
  const boundaryDiff = findStartHours ? 0 : 1;

  return entries.reduce((allHours, entry, i) => {
    const { startTime, endTime } = entry || {};

    if (i !== index && startTime && endTime) {
      const startHour = Number.parseInt(startTime.split(':')[0]);
      const endHour = Number.parseInt(endTime.split(':')[0]);
      const hoursBetween = Array(endHour - startHour)
        .fill()
        .map((v, i) => printHourStrings(startHour + i + boundaryDiff));

      return allHours.concat(hoursBetween);
    }

    return allHours;
  }, []);
};

const DailyPlan = props => {
  const { dayOfWeek, values, intl } = props;
  const getEntryStartTimes = getEntryBoundaries(values, dayOfWeek, intl, true);
  const getEntryEndTimes = getEntryBoundaries(values, dayOfWeek, intl, false);

  const hasEntries = values[dayOfWeek] && values[dayOfWeek][0];

  const startTimePlaceholder = intl.formatMessage({
    id: 'EditListingAvailabilityPlanForm.startTimePlaceholder',
  });
  const endTimePlaceholder = intl.formatMessage({
    id: 'EditListingAvailabilityPlanForm.endTimePlaceholder',
  });

  return (
    <div className={classNames(css.weekDay, hasEntries ? css.hasEntries : null)}>
      <div className={css.dayOfWeek}>
        <FormattedMessage id={`EditListingAvailabilityPlanForm.dayOfWeek.${dayOfWeek}`} />
      </div>

      <FieldArray name={dayOfWeek}>
        {({ fields }) => {
          return (
            <div className={css.timePicker}>
              {fields.map((name, index) => {
                // Pick available start hours
                const pickUnreservedStartHours = h => !getEntryStartTimes(index).includes(h);
                const availableStartHours = ALL_START_HOURS.filter(pickUnreservedStartHours);

                // Pick available end hours
                const pickUnreservedEndHours = h => !getEntryEndTimes(index).includes(h);
                const availableEndHours = ALL_END_HOURS.filter(pickUnreservedEndHours);

                return (
                  <div className={css.fieldWrapper} key={name}>
                    <div className={css.formRow}>
                      <div className={css.field}>
                        <FieldSelect
                          id={`${name}.startTime`}
                          name={`${name}.startTime`}
                          selectClassName={css.fieldSelect}
                          initialValueSelected={fields.value[0].startTime}
                        >
                          {filterStartHours(availableStartHours, values, dayOfWeek, index).map(
                            s => (
                              <option value={s} key={s}>
                                {s}
                              </option>
                            )
                          )}
                        </FieldSelect>
                      </div>
                      <span className={css.dashBetweenTimes}>-</span>
                      <div className={css.field}>
                        <FieldSelect
                          id={`${name}.endTime`}
                          name={`${name}.endTime`}
                          selectClassName={css.fieldSelect}
                          initialValueSelected={fields.value[0].endTime}
                        >
                          {filterEndHours(availableEndHours, values, dayOfWeek, index).map(s => (
                            <option value={s} key={s}>
                              {s}
                            </option>
                          ))}
                        </FieldSelect>
                      </div>
                    </div>
                    <div
                      className={css.fieldArrayRemove}
                      onClick={() => fields.remove(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <IconClose rootClassName={css.closeIcon} />
                    </div>
                  </div>
                );
              })}

              {fields.length === 0 ? (
                <InlineTextButton
                  type="button"
                  className={css.buttonSetHours}
                  onClick={() => fields.push({ startTime: '8:00am', endTime: '5:00pm' })}
                >
                  <FormattedMessage id="EditListingAvailabilityPlanForm.setHours" />
                </InlineTextButton>
              ) : (
                <InlineTextButton
                  type="button"
                  className={css.buttonAddNew}
                  onClick={() => fields.push({ startTime: null, endTime: null })}
                >
                  <FormattedMessage id="EditListingAvailabilityPlanForm.addAnother" />
                </InlineTextButton>
              )}
            </div>
          );
        }}
      </FieldArray>
    </div>
  );
};

const submit = (onSubmit, weekdays) => values => {
  const sortedValues = weekdays.reduce(
    (submitValues, day) => {
      return submitValues[day]
        ? {
            ...submitValues,
            [day]: submitValues[day].sort(sortEntries()),
          }
        : submitValues;
    },
    { ...values }
  );

  onSubmit(sortedValues);
};

const EditListingAvailabilityPlanFormComponent = props => {
  const { onSubmit, ...restOfprops } = props;
  return (
    <FinalForm
      {...restOfprops}
      onSubmit={submit(onSubmit, props.weekdays)}
      mutators={{
        ...arrayMutators,
      }}
      render={fieldRenderProps => {
        const {
          rootClassName,
          className,
          formId,
          handleSubmit,
          inProgress,
          intl,
          listingTitle,
          weekdays,
          fetchErrors,
          values,
        } = fieldRenderProps;

        const classes = classNames(rootClassName || css.root, className);
        const submitInProgress = inProgress;

        const concatDayEntriesReducer = (entries, day) => {
          return values[day] ? entries.concat(values[day]) : entries;
        };
        const hasUnfinishedEntries = !!weekdays
          .reduce(concatDayEntriesReducer, [])
          .find(e => !e.startTime || !e.endTime);

        const { updateListingError } = fetchErrors || {};

        const submitDisabled = submitInProgress || hasUnfinishedEntries;

        return (
          <Form id={formId} className={classes} onSubmit={handleSubmit}>
            <h2 className={css.heading}>
              <FormattedMessage
                id="EditListingAvailabilityPlanForm.title"
                values={{ listingTitle }}
              />
            </h2>
            <h3 className={css.subheading}>
              <FormattedMessage id="EditListingAvailabilityPlanForm.timezonePickerTitle" />
            </h3>
            <div className={css.timezonePicker}>
              <FieldTimeZoneSelect id="timezone" name="timezone" />
            </div>
            <h3 className={css.subheading}>
              <FormattedMessage id="EditListingAvailabilityPlanForm.hoursOfOperationTitle" />
            </h3>
            <div className={css.week}>
              {weekdays.map(w => {
                return <DailyPlan dayOfWeek={w} key={w} values={values} intl={intl} />;
              })}
            </div>

            <div className={css.submitButton}>
              {updateListingError ? (
                <p className={css.error}>
                  <FormattedMessage id="EditListingAvailabilityPlanForm.updateFailed" />
                </p>
              ) : null}
              <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
                <FormattedMessage id="EditListingAvailabilityPlanForm.saveSchedule" />
              </PrimaryButton>
            </div>
          </Form>
        );
      }}
    />
  );
};

EditListingAvailabilityPlanFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  inProgress: false,
};

EditListingAvailabilityPlanFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  inProgress: bool,
  fetchErrors: object.isRequired,

  listingTitle: string.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const EditListingAvailabilityPlanForm = compose(injectIntl)(
  EditListingAvailabilityPlanFormComponent
);

EditListingAvailabilityPlanForm.displayName = 'EditListingAvailabilityPlanForm';

export default EditListingAvailabilityPlanForm;
