import React from 'react';
import { array, string } from 'prop-types';
import { FieldSelect } from '../../components';

// You can update timezone keys if needed by running timezone script (aka parse-iana-timezones.js).
// We have a script that can generate keys from moment-timezone data format
// https://github.com/moment/moment-timezone/tree/develop/data/unpacked
// Check the instructions from generated file: iana-2019b-keys.js
import timezones from './iana-2019b-keys.js';

const FieldTimeZoneSelect = props => {
  return (
    <FieldSelect {...props}>
      <option disabled value="">
        Pick something...
      </option>
      {timezones.map(tz => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </FieldSelect>
  );
};

FieldTimeZoneSelect.defaultProps = {
  rootClassName: null,
  className: null,
  id: null,
  label: null,
  timezones: timezones,
};

FieldTimeZoneSelect.propTypes = {
  rootClassName: string,
  className: string,

  // Label is optional, but if it is given, an id is also required so
  // the label can reference the input in the `for` attribute
  id: string,
  label: string,
  name: string.isRequired,

  timezones: array,
};

export default FieldTimeZoneSelect;
