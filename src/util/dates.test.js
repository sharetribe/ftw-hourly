import { createIntl, createIntlCache } from './reactIntl';
import {
  isDate,
  isInRange,
  isSameDate,
  isValidTimeZone,
  getTimeZoneNames,
  localizeAndFormatDate,
  localizeAndFormatTime,
  findNextBoundary,
  getSharpHours,
  getStartHours,
  getEndHours,
  nightsBetween,
  daysBetween,
  isSameDay,
  minutesBetween,
  monthIdStringInTimeZone,
  formatDate,
  getMonthStartInTimeZone,
  nextMonthFn,
  prevMonthFn,
  parseDateFromISO8601,
  stringifyDateToISO8601,
  timeOfDayFromLocalToTimeZone,
  timeOfDayFromTimeZoneToLocal,
  timestampToDate,
  dateIsAfter,
  resetToStartOfDay,
  calculateQuantityFromHours,
} from './dates';

describe('date utils', () => {
  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale: 'en-US',
      messages: {},
    },
    cache
  );

  describe('isDate()', () => {
    it('should return false if parameters is string', () => {
      expect(isDate('Monday')).toBeFalsy();
    });
    it('should return false if parameters is number', () => {
      expect(isDate('1546293600000')).toBeFalsy();
    });
    it('should return false if parameters is incorrect Date', () => {
      expect(isDate(new Date('random string'))).toBeFalsy();
    });
    it('should return true if parameters is Date', () => {
      expect(isDate(new Date(1546293600000))).toBeTruthy();
    });
  });

  describe('isSameDate()', () => {
    it('should return falsy if parameters do not match', () => {
      const a = new Date(1546293600000);
      const b = new Date(1546293600001);
      expect(isSameDate(a, b)).toBeFalsy();
    });
    it('should be truthy if parameters match', () => {
      expect(isSameDate(new Date(2019, 0, 1), new Date(2019, 0, 1))).toBeTruthy();
    });
  });

  describe('isValidTimeZone()', () => {
    it('should return falsy for "MiddleEarth/Mordor"', () => {
      expect(isValidTimeZone('MiddleEarth/Mordor')).toBeFalsy();
    });
    it('should return truthy for "Europe/Helsinki"', () => {
      expect(isValidTimeZone('Europe/Helsinki')).toBeTruthy();
    });
  });

  describe('getTimeZoneNames()', () => {
    it('should return filtered time zone names', () => {
      const relevantZonesPattern = new RegExp('^(Australia/Eucla|Europe/Helsinki)');
      expect(getTimeZoneNames(relevantZonesPattern)).toEqual([
        'Australia/Eucla',
        'Europe/Helsinki',
      ]);
    });
  });

  describe('localizeAndFormatDate()', () => {
    it('should return localized date for "2019-09-18T00:45:00.000Z"', () => {
      expect(
        localizeAndFormatDate(intl, 'America/Los_Angeles', new Date('2019-09-18T00:45:00.000Z'))
      ).toEqual('9/17/2019, 17:45');
    });

    it('should return localized time for "2019-09-18T00:45:00.000Z"', () => {
      expect(
        localizeAndFormatTime(intl, 'America/Los_Angeles', new Date('2019-09-18T00:45:00.000Z'))
      ).toEqual('17:45');
    });
    it('should return localized time for "2019-09-18T00:45:00.000Z" with 12h format', () => {
      const formattingOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };

      expect(
        localizeAndFormatTime(
          intl,
          'America/Los_Angeles',
          new Date('2019-09-18T00:45:00.000Z'),
          formattingOptions
        )
      ).toEqual('5:45 PM');
    });
  });

  describe('findNextBoundary()', () => {
    it('should return 01:00 as next boundary when starting from 00:45', () => {
      expect(findNextBoundary('Etc/UTC', new Date('2019-09-18T00:45:00.000Z'))).toEqual(
        new Date('2019-09-18T01:00:00.000Z')
      );
    });
    it('should return 02:00 as next boundary when starting from 01:00', () => {
      expect(findNextBoundary('Etc/UTC', new Date('2019-09-18T01:00:00.000Z'))).toEqual(
        new Date('2019-09-18T02:00:00.000Z')
      );
    });
  });

  describe('getSharpHours()', () => {
    it('should return sharp hours, when startTime and endTime are sharp hours', () => {
      const startHour = new Date('2019-09-18T08:00:00.000Z');
      const endHour = new Date('2019-09-18T09:00:00.000Z');
      expect(getSharpHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([
        { timestamp: 1568793600000, timeOfDay: '11:00' },
        { timestamp: 1568797200000, timeOfDay: '12:00' },
      ]);
    });
    it('should return sharp hours, when startTime and endTime are half hours', () => {
      const startHour = new Date('2019-09-18T08:30:00.000Z');
      const endHour = new Date('2019-09-18T09:30:00.000Z');
      expect(getSharpHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([
        { timestamp: 1568797200000, timeOfDay: '12:00' },
      ]);
    });
  });

  describe('getStartHours()', () => {
    it('should return sharp hours, when startTime and endTime are sharp hours', () => {
      const startHour = new Date('2019-09-18T08:00:00.000Z');
      const endHour = new Date('2019-09-18T09:00:00.000Z');
      expect(getStartHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([
        { timestamp: 1568793600000, timeOfDay: '11:00' },
      ]);
    });
    it('should return sharp hours, when startTime and endTime are half hours', () => {
      const startHour = new Date('2019-09-18T08:30:00.000Z');
      const endHour = new Date('2019-09-18T09:30:00.000Z');
      expect(getStartHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([
        { timestamp: 1568797200000, timeOfDay: '12:00' },
      ]);
    });
  });

  describe('getEndHours()', () => {
    it('should return sharp hours, when startTime and endTime are sharp hours', () => {
      const startHour = new Date('2019-09-18T08:00:00.000Z');
      const endHour = new Date('2019-09-18T09:00:00.000Z');
      expect(getEndHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([
        { timestamp: 1568797200000, timeOfDay: '12:00' },
      ]);
    });
    it('should return sharp hours, when startTime and endTime are half hours', () => {
      const startHour = new Date('2019-09-18T08:30:00.000Z');
      const endHour = new Date('2019-09-18T09:30:00.000Z');
      expect(getEndHours(intl, 'Europe/Helsinki', startHour, endHour)).toEqual([]);
    });
  });

  describe('nightsBetween()', () => {
    it('should fail if end date is before start date', () => {
      const start = new Date(2017, 0, 2);
      const end = new Date(2017, 0, 1);
      expect(() => nightsBetween(start, end)).toThrow('End date cannot be before start date');
    });
    it('should handle equal start and end dates', () => {
      const d = new Date(2017, 0, 1);
      expect(nightsBetween(d, d)).toEqual(0);
    });
    it('should calculate night count for a single night', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 2);
      expect(nightsBetween(start, end)).toEqual(1);
    });
    it('should calculate night count', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 3);
      expect(nightsBetween(start, end)).toEqual(2);
    });
  });

  describe('daysBetween()', () => {
    it('should fail if end date is before start date', () => {
      const start = new Date(2017, 0, 2);
      const end = new Date(2017, 0, 1);
      expect(() => daysBetween(start, end)).toThrow('End date cannot be before start date');
    });
    it('should handle equal start and end dates', () => {
      const d = new Date(2017, 0, 1);
      expect(daysBetween(d, d)).toEqual(0);
    });
    it('should calculate night count for a single day', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 2);
      expect(daysBetween(start, end)).toEqual(1);
    });
    it('should calculate day count', () => {
      const start = new Date(2017, 0, 1);
      const end = new Date(2017, 0, 3);
      expect(daysBetween(start, end)).toEqual(2);
    });
  });

  describe('minutesBetween()', () => {
    it('should handle equal start and end Dates', () => {
      const d = new Date(2017, 0, 1, 10, 35, 0);
      expect(minutesBetween(d, d)).toEqual(0);
    });
    it('should calculate minutes count for one hour', () => {
      const start = new Date(2017, 0, 1, 10, 35, 0);
      const end = new Date(2017, 0, 1, 11, 35, 0);
      expect(minutesBetween(start, end)).toEqual(60);
    });
    it('should calculate minutes', () => {
      const start = new Date(2017, 0, 1, 10, 35, 0);
      const end = new Date(2017, 0, 1, 10, 55, 0);
      expect(minutesBetween(start, end)).toEqual(20);
    });
  });

  describe('isSameDay()', () => {
    it('should fail if the dates are pointing to different days', () => {
      const d1 = new Date(Date.UTC(2019, 0, 1, 10, 0, 0));
      const d2 = new Date(Date.UTC(2019, 0, 2, 10, 0, 0));
      expect(isSameDay(d1, d2, 'Etc/UTC')).toBeFalsy();

      // 1 second difference around midnight
      const d3 = new Date(Date.UTC(2019, 0, 1, 23, 59, 59));
      const d4 = new Date(Date.UTC(2019, 0, 2, 0, 0, 0));
      expect(isSameDay(d3, d4, 'Etc/UTC')).toBeFalsy();
    });
    it('should succeed if the dates are pointing to the same days', () => {
      const d1 = new Date(Date.UTC(2019, 0, 1, 10, 0, 0));
      const d2 = new Date(Date.UTC(2019, 0, 1, 10, 0, 0));
      expect(isSameDay(d1, d2, 'Etc/UTC')).toBeTruthy();
    });
  });

  describe('monthIdStringInTimeZone() for 2019-11-01', () => {
    it('should return correct month-id string', () => {
      const date = new Date(Date.UTC(2019, 10, 1, 0, 0, 0));
      expect(monthIdStringInTimeZone(date, 'Australia/Eucla')).toEqual('2019-11');
      expect(monthIdStringInTimeZone(date, 'Europe/Helsinki')).toEqual('2019-11');
      // Note month has changed in UTC (and therefore in Eucla and Helsinki),
      // but not yet in Los Angeles.
      expect(monthIdStringInTimeZone(date, 'America/Los_Angeles')).toEqual('2019-10');
    });
  });

  describe('formatDate()', () => {
    /*
      NOTE: These are not really testing the formatting properly since
      the fakeIntl object has to be used in the tests.
     */

    it('formats a date today', () => {
      expect(formatDate(intl, 'Today', new Date())).toMatch(/Today/);
    });
    it('formats a date', () => {
      const d = new Date(Date.UTC(2017, 10, 22, 13, 51));
      expect(formatDate(intl, 'Today', d)).not.toMatch(/Today/);
    });
  });

  describe('parseDateFromISO8601()', () => {
    it('should return date', () => {
      const dateString = '2018-11-23';
      const date = new Date(2018, 10, 23);
      expect(parseDateFromISO8601(dateString)).toEqual(date);
    });
  });

  describe('stringifyDateToISO8601()', () => {
    it('should return string in YYYY-MM-DD format', () => {
      const date = new Date(2018, 10, 23);
      expect(stringifyDateToISO8601(date)).toEqual('2018-11-23');
    });
  });

  describe('getMonthStartInTimeZone() for 2019-11-23', () => {
    it('should return correct start of the month', () => {
      const date = new Date(Date.UTC(2019, 10, 23, 14, 34, 22));
      expect(
        localizeAndFormatDate(
          intl,
          'Australia/Eucla',
          getMonthStartInTimeZone(date, 'Australia/Eucla')
        )
      ).toEqual('11/1/2019, 00:00');
      expect(
        localizeAndFormatDate(
          intl,
          'Europe/Helsinki',
          getMonthStartInTimeZone(date, 'Europe/Helsinki')
        )
      ).toEqual('11/1/2019, 00:00');
      expect(
        localizeAndFormatDate(
          intl,
          'America/Los_Angeles',
          getMonthStartInTimeZone(date, 'America/Los_Angeles')
        )
      ).toEqual('11/1/2019, 00:00');
    });
  });

  describe('nextMonthFn() for 2019-11-23', () => {
    it('should return correct start of the next month', () => {
      // November == 10
      const date = new Date(Date.UTC(2019, 10, 23, 14, 34, 22));
      expect(
        localizeAndFormatDate(intl, 'Australia/Eucla', nextMonthFn(date, 'Australia/Eucla'))
      ).toEqual('12/1/2019, 00:00');
      expect(
        localizeAndFormatDate(intl, 'Europe/Helsinki', nextMonthFn(date, 'Europe/Helsinki'))
      ).toEqual('12/1/2019, 00:00');
      expect(
        localizeAndFormatDate(intl, 'America/Los_Angeles', nextMonthFn(date, 'America/Los_Angeles'))
      ).toEqual('12/1/2019, 00:00');
    });
  });

  describe('prevMonthFn() for 2019-11-23', () => {
    it('should return correct start of the next month', () => {
      // November == 10
      const date = new Date(Date.UTC(2019, 10, 23, 14, 34, 22));
      expect(
        localizeAndFormatDate(intl, 'Australia/Eucla', prevMonthFn(date, 'Australia/Eucla'))
      ).toEqual('10/1/2019, 00:00');
      expect(
        localizeAndFormatDate(intl, 'Europe/Helsinki', prevMonthFn(date, 'Europe/Helsinki'))
      ).toEqual('10/1/2019, 00:00');
      expect(
        localizeAndFormatDate(intl, 'America/Los_Angeles', prevMonthFn(date, 'America/Los_Angeles'))
      ).toEqual('10/1/2019, 00:00');
    });
  });

  describe('timeOfDayFromLocalToTimeZone()', () => {
    const formattingOptions = tz => {
      const tzMaybe = tz ? { timeZone: tz } : {};
      return {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        ...tzMaybe,
      };
    };

    it('should return date in selected timezone America/New York', () => {
      const date = new Date(2019, 10, 10, 0, 0, 0);
      const tz = 'America/New_York';

      const convertedDate = timeOfDayFromLocalToTimeZone(date, tz);
      const testEnvFormattedDateTime = intl.formatDate(convertedDate, formattingOptions(tz));
      const nyFormattedDateTime = intl.formatDate(date, formattingOptions());

      expect(testEnvFormattedDateTime).toEqual(nyFormattedDateTime);
    });

    it('should return date in selected timezone Australia/Adelaide', () => {
      const date = new Date(2019, 10, 10, 0, 0, 0);
      const tz = 'Australia/Adelaide';
      const convertedDate = timeOfDayFromLocalToTimeZone(date, tz);
      const testEnvFormattedDateTime = intl.formatDate(convertedDate, formattingOptions(tz));
      const adelFormattedDateTime = intl.formatDate(date, formattingOptions());

      expect(testEnvFormattedDateTime).toEqual(adelFormattedDateTime);
    });
  });

  describe('timeOfDayFromTimeZoneToLocal()', () => {
    const formattingOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    it('should return date in selected timezone America/New_York', () => {
      const date = new Date('Sun Nov 10 2019 00:00:00 GMT-0500 (Eastern Standard Time)');
      const tz = 'America/New_York';

      const convertedDate = timeOfDayFromTimeZoneToLocal(date, tz);
      const testEnvFormattedDateTime = intl.formatDate(convertedDate, formattingOptions);
      const nyFormattedDateTime = localizeAndFormatDate(intl, tz, date);

      expect(testEnvFormattedDateTime).toEqual(nyFormattedDateTime);
    });

    it('should return date in selected timezone Australia/Adelaide', () => {
      const date = new Date('Sun Nov 10 2019 00:00:00 GMT+1030 (Australian Central Daylight Time)');
      const tz = 'Australia/Adelaide';

      const convertedDate = timeOfDayFromTimeZoneToLocal(date, tz);
      const testEnvFormattedDateTime = intl.formatDate(convertedDate, formattingOptions);
      const adelFormattedDateTime = localizeAndFormatDate(intl, tz, date);

      expect(testEnvFormattedDateTime).toEqual(adelFormattedDateTime);
    });
  });

  describe('timestampToDate()', () => {
    const date = new Date(Date.UTC(2019, 10, 10, 0, 0, 0));
    it('should return timestamp as date', () => {
      expect(timestampToDate(date.getTime())).toEqual(date);
    });

    it('should return timestamp string as date', () => {
      expect(timestampToDate(date.getTime().toString())).toEqual(date);
    });
  });

  describe('dateIsAfter()', () => {
    const date = new Date(Date.UTC(2019, 10, 10, 12, 0, 0));
    const nextHour = new Date(Date.UTC(2019, 10, 10, 13, 0, 0));
    const nextDay = new Date(Date.UTC(2019, 10, 11, 12, 0, 0));

    it('should return true when the other date is next day', () => {
      expect(dateIsAfter(nextDay, date)).toBeTruthy();
    });

    it('should return true when the other date is next hout', () => {
      expect(dateIsAfter(nextHour, date)).toBeTruthy();
    });

    it('should return false when the other date is previous day', () => {
      expect(dateIsAfter(date, nextDay)).toBeFalsy();
    });

    it('should return true if the dates are same', () => {
      expect(dateIsAfter(date, date)).toBeTruthy();
    });
  });

  describe('isInRange()', () => {
    const startDate = new Date(Date.UTC(2019, 10, 10, 0, 0, 0));
    const endDate = new Date(Date.UTC(2019, 10, 11, 12, 0, 0));

    it('should return true if the date is inside range', () => {
      const date = new Date(Date.UTC(2019, 10, 10, 12, 0, 0));
      expect(isInRange(date, startDate, endDate)).toBeTruthy();
    });

    it('should return false if the date is outside range', () => {
      const date = new Date(Date.UTC(2019, 10, 9, 12, 0, 0));
      expect(isInRange(date, startDate, endDate)).toBeFalsy();
    });

    it('should return true if the date is inside day-range on correct time zone', () => {
      const date = new Date('Wed Oct 16 2019 00:00:00 GMT-1100 (Samoa Standard Time)');
      // aka new Date('Wed Oct 16 2019 23:00:00 GMT+1200 (Anadyr Standard Time)')

      const start = new Date('Wed Oct 16 2019 00:00:00 GMT+1200 (Anadyr Standard Time)');
      const end = new Date('Wed Oct 16 2019 09:00:00 GMT+1200 (Anadyr Standard Time)');

      // Day scope in local time zone fails if you are running the test on environment using
      // Samoa Standard Time (like Pacific/Pago_Pago).
      // I.e. this fails: expect(isInRange(date, start, end, 'day')).toBeTruthy();

      // Day scope in correct time zone succeeds
      expect(isInRange(date, start, end, 'day', 'Asia/Anadyr')).toBeTruthy();
    });
  });

  describe('resetToStartOfDay()', () => {
    const date = new Date(Date.UTC(2019, 10, 10, 12, 11, 11));

    it('reset to start of day', () => {
      expect(resetToStartOfDay(date, 'Etc/UTC')).toEqual(new Date(Date.UTC(2019, 10, 10, 0, 0, 0)));
    });

    it('reset to start of day with given offset', () => {
      expect(resetToStartOfDay(date, 'Etc/UTC', 5)).toEqual(
        new Date(Date.UTC(2019, 10, 15, 0, 0, 0))
      );
    });
  });

  describe('calculateQuantityFromHours()', () => {
    const startDate = new Date(Date.UTC(2019, 10, 10, 12, 0, 0));
    const endDate = new Date(Date.UTC(2019, 10, 10, 18, 0, 0));
    const endDateNextDay = new Date(Date.UTC(2019, 10, 11, 18, 0, 0));

    it('calculates the number of hours', () => {
      expect(calculateQuantityFromHours(startDate, endDate)).toEqual(6);
    });

    it('calculates the number of hours when start and en are in different days', () => {
      expect(calculateQuantityFromHours(startDate, endDateNextDay)).toEqual(30);
    });
  });
});
