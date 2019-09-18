// Import moment from moment-timezone. 10-year range only.
// The full data included in moment-timezone dependency is mostly irrelevant
// and slows down the first paint.
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range.min';
import jstz from 'jstimezonedetect';

/**
 * Input names for the DateRangePicker from react-dates.
 */
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';

/**
 * Check that the given parameter is a Date object.
 *
 * @param {Date} object that should be a Date.
 *
 * @returns {boolean} true if given parameter is a Date object.
 */
export const isDate = d =>
  d && Object.prototype.toString.call(d) === '[object Date]' && !Number.isNaN(d.getTime());

/**
 * Check if the given parameters represent the same Date value (timestamps are compared)
 *
 * @param {Date} first param that should be a Date and it should have same timestamp as second param.
 * @param {Date} second param that should be a Date and it should have same timestamp as second param.
 *
 * @returns {boolean} true if given parameters have the same timestamp.
 */
export const isSameDate = (a, b) => a && isDate(a) && b && isDate(b) && a.getTime() === b.getTime();

/**
 * Check if the browser's DateTimeFormat API supports time zones.
 *
 * @returns {Boolean} true if the browser returns current timezone.
 */
export const isTimeZoneSupported = () => {
  if (!Intl || typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
    return false;
  }

  const dtf = new Intl.DateTimeFormat();
  if (typeof dtf === 'undefined' || typeof dtf.resolvedOptions === 'undefined') {
    return false;
  }
  return !!dtf.resolvedOptions().timeZone;
};

/**
 * Detect the default timezone of user's browser.
 * This function can only be called from client side.
 * I.e. server-side rendering doesn't make sense - it would not return user's timezone.
 *
 * @returns {String} string containing IANA timezone key (e.g. 'Europe/Helsinki')
 */
export const getDefaultTimeZoneOnBrowser = () => {
  if (typeof window === 'undefined') {
    throw new Error(
      'Utility function: getDefaultTimeZoneOnBrowser() should be called on client-side only.'
    );
  }

  if (isTimeZoneSupported()) {
    const dtf = new Intl.DateTimeFormat();
    const currentTimeZone = dtf.resolvedOptions().timeZone;
    if (currentTimeZone) {
      return currentTimeZone;
    }
  }

  // Fallback to jstimezonedetect dependency.
  // However, most browsers support Intl.DateTimeFormat already.
  return jstz.determine().name();
};

/**
 * Check if the given time zone key is valid.
 *
 * @param {String} name of the time zone in IANA format
 *
 * @returns {Boolean} true if the browser recognizes the key.
 */
export const isValidTimeZone = timeZone => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format();
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Format date instance to string and localized it to given time zone.
 * Default formatting shows date and hours and minutes in 24 hour format:
 *
 * > localizeAndFormatDate(intl, 'America/Los_Angeles', new Date())
 * => "9/18/2019, 08:18"
 *
 * @param {Object} instance of React Intl
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Date} date to be localized.
 * @param {Object} formatting options for Intl.DateTimeFormat.
 *
 * @returns {String} date localized and formatted to string.
 */
export const localizeAndFormatDate = (intl, timeZone, date, formattingOptions = null) => {
  if (!isTimeZoneSupported()) {
    throw new Error(`Your browser doesn't support timezones.`);
  }

  if (!isValidTimeZone(timeZone)) {
    throw new Error(`Given time zone key (${timeZone}) is not valid.`);
  }

  const format = formattingOptions || {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return intl.formatTime(date, { ...format, timeZone });
};

/**
 * Format date instance to string and localized it to given time zone.
 * Default formatting shows hours and minutes in 24 hour format:
 *
 * > localizeAndFormatTime(intl, 'America/Los_Angeles', new Date())
 * => "08:18"
 *
 * @param {Object} instance of React Intl
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Date} date to be localized.
 * @param {Object} formatting options for Intl.DateTimeFormat.
 *
 * @returns {String} date localized and formatted to string.
 */
export const localizeAndFormatTime = (
  intl,
  timeZone,
  date,
  formattingOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
) => {
  return localizeAndFormatDate(intl, timeZone, date, formattingOptions);
};

// Helper function for exported function: getSharpHours
// Recursively find boundaries for bookable time slots.
const findBookingUnitBoundaries = params => {
  const {
    cumulatedResults,
    currentBoundary,
    startMoment,
    endMoment,
    nextBoundaryFn,
    intl,
    timeZone,
  } = params;

  if (moment(currentBoundary).isBetween(startMoment, endMoment, null, '[]')) {
    return findBookingUnitBoundaries({
      ...params,
      cumulatedResults: [
        ...cumulatedResults,
        {
          timestamp: currentBoundary.valueOf(),
          timeOfDay: localizeAndFormatTime(intl, timeZone, currentBoundary),
        },
      ],
      currentBoundary: moment(nextBoundaryFn(timeZone, currentBoundary)),
    });
  }
  return cumulatedResults;
};

/**
 * Find the next sharp hour after the current moment.
 *
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Moment|Date} Start point for looking next sharp hour.
 *
 * @returns {Array} an array of localized hours.
 */
export const findNextBoundary = (timeZone, currentMomentOrDate) =>
  moment(currentMomentOrDate)
    .clone()
    .tz(timeZone)
    .add(1, 'hour')
    .startOf('hour')
    .toDate();

/**
 * Find sharp hours inside given time window. Returned strings are localized to given time zone.
 *
 * > getSharpHours(intl, 'Europe/Helsinki', new Date('2019-09-18T08:00:00.000Z'), new Date('2019-09-18T11:00:00.000Z'));
 * => [
 *    {
 *      "timestamp": 1568793600000,
 *      "timeOfDay": "11:00",
 *    },
 *    {
 *      "timestamp": 1568797200000,
 *      "timeOfDay": "12:00",
 *    },
 *    {
 *      "timestamp": 1568800800000,
 *      "timeOfDay": "13:00",
 *    },
 *    {
 *      "timestamp": 1568804400000,
 *      "timeOfDay": "14:00",
 *    },
 *  ]
 *
 * @param {Object} formatting options for Intl.DateTimeFormat.
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Date} Start point of available time window.
 * @param {Date} End point of available time window.
 *
 * @returns {Array} an array of objects with keys timestamp and timeOfDay.
 */
export const getSharpHours = (intl, timeZone, startTime, endTime) => {
  if (!moment.tz.zone(timeZone)) {
    throw new Error(
      'Time zones are not loaded into moment-timezone. "getSharpHours" function uses time zones.'
    );
  }

  // Select a moment before startTime to find next possible sharp hour.
  // I.e. startTime might be a sharp hour.
  const millisecondBeforeStartTime = new Date(startTime.getTime() - 1);
  return findBookingUnitBoundaries({
    currentBoundary: findNextBoundary(timeZone, millisecondBeforeStartTime),
    startMoment: moment(startTime),
    endMoment: moment(endTime),
    nextBoundaryFn: findNextBoundary,
    cumulatedResults: [],
    intl,
    timeZone,
  });
};

/**
 * Find sharp start hours for bookable time units (hour) inside given time window.
 * Returned strings are localized to given time zone.
 *
 * > getStartHours(intl, 'Europe/Helsinki', new Date('2019-09-18T08:00:00.000Z'), new Date('2019-09-18T11:00:00.000Z'));
 * => [
 *    {
 *      "timestamp": 1568793600000,
 *      "timeOfDay": "11:00",
 *    },
 *    {
 *      "timestamp": 1568797200000,
 *      "timeOfDay": "12:00",
 *    },
 *    {
 *      "timestamp": 1568800800000,
 *      "timeOfDay": "13:00",
 *    },
 *  ]
 *
 * @param {Object} formatting options for Intl.DateTimeFormat.
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Date} Start point of available time window.
 * @param {Date} End point of available time window.
 *
 * @returns {Array} an array of objects with keys timestamp and timeOfDay.
 */
export const getStartHours = (intl, timeZone, startTime, endTime) => {
  const hours = getSharpHours(intl, timeZone, startTime, endTime);
  return hours.length < 2 ? hours : hours.slice(0, -1);
};

/**
 * Find sharp end hours for bookable time units (hour) inside given time window.
 * Returned strings are localized to given time zone.
 *
 * > getStartingHours(intl, 'Europe/Helsinki', new Date('2019-09-18T08:00:00.000Z'), new Date('2019-09-18T11:00:00.000Z'));
 * => [
 *    {
 *      "timestamp": 1568797200000,
 *      "timeOfDay": "12:00",
 *    },
 *    {
 *      "timestamp": 1568800800000,
 *      "timeOfDay": "13:00",
 *    },
 *    {
 *      "timestamp": 1568804400000,
 *      "timeOfDay": "14:00",
 *    },
 *  ]
 *
 * @param {Object} formatting options for Intl.DateTimeFormat.
 * @param {String} timezone name. It should represent IANA timezone key.
 * @param {Date} Start point of available time window.
 * @param {Date} End point of available time window.
 *
 * @returns {Array} an array of objects with keys timestamp and timeOfDay.
 */
export const getEndHours = (intl, timeZone, startTime, endTime) => {
  const hours = getSharpHours(intl, timeZone, startTime, endTime);
  return hours.length < 2 ? [] : hours.slice(1);
};

/**
 * Convert date given by API to something meaningful noon on browser's timezone
 * So, what happens is that date given by client
 * ("Fri Mar 30 2018 12:00:00 GMT-1100 (SST)" aka "Fri Mar 30 2018 23:00:00 GMT+0000 (UTC)")
 * will be read as UTC time. Then API normalizes night/day bookings to
 * start from 00:00 UTC (i.e. discards hours from UTC day).
 * So Api gives 00:00 UTC which (in our example) would be locally
 * "Thu Mar 29 2018 13:00:00 GMT-1100 (SST)".
 *
 * The resulting timestamp from API is:
 * localTimestamp.subtract(12h).add(timezoneoffset) (in eg. -23 h)
 *
 * So, this function adds those removed hours back.
 *
 * @param {Date} date is a local date object
 *
 * @returns {Date} date (given by API as UTC 00:00) converted back to local noon.
 */
export const dateFromAPIToLocalNoon = date => {
  const timezoneDiffInMinutes = moment(date).utcOffset();
  // Example timezone SST:
  // We get a Fri 00:00 UTC aka "Thu Mar 29 2018 13:00:00 GMT-1100 (SST)"
  // We need to subtract timezone difference (-11h), effectively adding 11h - to get to correct date
  const momentInLocalTimezone = moment(date).subtract(timezoneDiffInMinutes, 'minutes');
  // To be on the safe zone with leap seconds and stuff when using day / night picker
  // we'll add 12 h to get to the noon of day in local timezone.
  return momentInLocalTimezone.add(12, 'hours').toDate();
};

/**
 * Convert local date for API.
 * Date given by browser
 * ("Fri Mar 30 2018 12:00:00 GMT-1100 (SST)" aka "Fri Mar 30 2018 23:00:00 GMT+0000 (UTC)")
 * must be modified so that API will get correct moment also in UTC.
 * We achieve this by adding timezone offset to local date / timestamp.
 *
 * The resulting timestamp for the API is:
 * localTimestamp.add(timezoneoffset)
 * In eg. Fri Mar 30 2018 23:00:00 GMT-1100 (SST) aka "Fri Mar 30 2018 12:00:00 GMT+0000 (UTC)"
 *
 * @param {Date} date is a local date object
 *
 * @returns {Date} date (given by API as UTC 00:00) converted back to local noon.
 */
export const dateFromLocalToAPI = date => {
  const timezoneDiffInMinutes = moment(date).utcOffset();
  const momentInLocalTimezone = moment(date).add(timezoneDiffInMinutes, 'minutes');

  return momentInLocalTimezone.toDate();
};

/**
 * Calculate the number of nights between the given dates
 *
 * @param {Date} startDate start of the time period
 * @param {Date} endDate end of the time period
 *
 * @throws Will throw if the end date is before the start date
 * @returns {Number} number of nights between the given dates
 */
export const nightsBetween = (startDate, endDate) => {
  const nights = moment(endDate).diff(startDate, 'days');
  if (nights < 0) {
    throw new Error('End date cannot be before start date');
  }
  return nights;
};

/**
 * Calculate the number of days between the given dates
 *
 * @param {Date} startDate start of the time period
 * @param {Date} endDate end of the time period. NOTE: with daily
 * bookings, it is expected that this date is the exclusive end date,
 * i.e. the last day of the booking is the previous date of this end
 * date.
 *
 * @throws Will throw if the end date is before the start date
 * @returns {Number} number of days between the given dates
 */
export const daysBetween = (startDate, endDate) => {
  const days = moment(endDate).diff(startDate, 'days');
  if (days < 0) {
    throw new Error('End date cannot be before start date');
  }
  return days;
};

/**
 * Calculate the number of minutes between the given dates
 *
 * @param {Date} startDate start of the time period
 * @param {Date} endDate end of the time period.
 *
 * @throws Will throw if the end date is before the start date
 * @returns {Number} number of minutes between the given Date objects
 */
export const minutesBetween = (startDate, endDate) => {
  const minutes = moment(endDate).diff(startDate, 'minutes');
  if (minutes < 0) {
    throw new Error('End Date cannot be before start Date');
  }
  return minutes;
};

/**
 * Format the given date to month id/string
 *
 * @param {Date} date to be formatted
 *
 * @returns {String} formatted month string
 */
export const monthIdString = date => moment(date).format('YYYY-MM');

/**
 * Format the given date to UTC month id/string
 *
 * @param {Date} date to be formatted
 *
 * @returns {String} formatted month string
 */
export const monthIdStringInUTC = date =>
  moment(date)
    .utc()
    .format('YYYY-MM');

/**
 * Format the given date
 *
 * @param {Object} intl Intl object from react-intl
 * @param {String} todayString translation for the current day
 * @param {Date} d Date to be formatted
 *
 * @returns {String} formatted date
 */
export const formatDate = (intl, todayString, d) => {
  const paramsValid = intl && d instanceof Date && typeof todayString === 'string';
  if (!paramsValid) {
    throw new Error(`Invalid params for formatDate: (${intl}, ${todayString}, ${d})`);
  }

  // By default we can use moment() directly but in tests we need to use a specific dates.
  // fakeIntl used in tests contains now() function wich returns predefined date
  const now = intl.now ? moment(intl.now()) : moment();
  const formattedTime = intl.formatTime(d);
  let formattedDate;

  if (now.isSame(d, 'day')) {
    // e.g. "Today, 9:10pm"
    formattedDate = todayString;
  } else if (now.isSame(d, 'week')) {
    // e.g. "Wed, 8:00pm"
    formattedDate = intl.formatDate(d, {
      weekday: 'short',
    });
  } else if (now.isSame(d, 'year')) {
    // e.g. "Aug 22, 7:40pm"
    formattedDate = intl.formatDate(d, {
      month: 'short',
      day: 'numeric',
    });
  } else {
    // e.g. "Jul 17 2016, 6:02pm"
    const date = intl.formatDate(d, {
      month: 'short',
      day: 'numeric',
    });
    const year = intl.formatDate(d, {
      year: 'numeric',
    });
    formattedDate = `${date} ${year}`;
  }

  return `${formattedDate}, ${formattedTime}`;
};

/**
 * Converts string given in ISO8601 format to date object.
 * This is used e.g. when when dates are parsed form urlParams
 *
 * @param {String} dateString in 'YYYY-MM-DD'format
 *
 * @returns {Date} parsed date object
 */
export const parseDateFromISO8601 = dateString => {
  return moment(dateString, 'YYYY-MM-DD').toDate();
};

/**
 * Converts date to string ISO8601 format ('YYYY-MM-DD').
 * This string is used e.g. in urlParam.
 *
 * @param {Date} date
 *
 * @returns {String} string in 'YYYY-MM-DD'format
 */
export const stringifyDateToISO8601 = date => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Formats string ('YYYY-MM-DD') to UTC format ('0000-00-00T00:00:00.000Z').
 * This is used in search query.
 *
 * @param {String} string in 'YYYY-MM-DD'format
 *
 * @returns {String} string in '0000-00-00T00:00:00.000Z' format
 */
export const formatDateStringToUTC = dateString => {
  return moment.utc(dateString).toDate();
};

/**
 * Formats string ('YYYY-MM-DD') to UTC format ('0000-00-00T00:00:00.000Z') and adds one day.
 * This is used as end date of the search query.
 * One day must be added because end of the availability is exclusive in API.
 *
 * @param {String} string in 'YYYY-MM-DD'format
 *
 * @returns {String} string in '0000-00-00T00:00:00.000Z' format
 */
export const getExclusiveEndDate = dateString => {
  return moment
    .utc(dateString)
    .add(1, 'days')
    .startOf('day')
    .toDate();
};

export const formatDateToText = (intl, date) => {
  return {
    date: intl.formatDate(date, {
      month: 'short',
      day: 'numeric',
    }),
    time: intl.formatDate(date, {
      hour: 'numeric',
      minute: 'numeric',
    }),
    dateAndTime: intl.formatTime(date, {
      month: 'short',
      day: 'numeric',
    }),
  };
};
