import { createIntl, createIntlCache } from './reactIntl';
import { fakeIntl } from './test-data';
import {
  isDate,
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
  minutesBetween,
  monthIdStringInTimeZone,
  formatDate,
  getMonthStartInTimeZone,
  getNextMonthStartInTimeZone,
  parseDateFromISO8601,
  stringifyDateToISO8601,
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
        hour: '2-digit',
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
    it('should fail if end Date is before start Date', () => {
      const start = new Date(2017, 0, 2);
      const end = new Date(2017, 0, 1);
      expect(() => minutesBetween(start, end)).toThrow('End Date cannot be before start Date');
    });
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
      const d = new Date(Date.UTC(2017, 10, 23, 13, 51));
      expect(formatDate(fakeIntl, 'Today', d)).toEqual('Today, 13:51');
    });
    it('formats a date', () => {
      const d = new Date(Date.UTC(2017, 10, 22, 13, 51));
      expect(formatDate(fakeIntl, 'Today', d)).toEqual('2017-11-22, 13:51');
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

  describe('getNextMonthStartInTimeZone() for 2019-11-23', () => {
    it('should return correct start of the next month', () => {
      const date = new Date(Date.UTC(2019, 10, 23, 14, 34, 22));
      expect(
        localizeAndFormatDate(
          intl,
          'Australia/Eucla',
          getNextMonthStartInTimeZone(date, 'Australia/Eucla')
        )
      ).toEqual('12/1/2019, 00:00');
      expect(
        localizeAndFormatDate(
          intl,
          'Europe/Helsinki',
          getNextMonthStartInTimeZone(date, 'Europe/Helsinki')
        )
      ).toEqual('12/1/2019, 00:00');
      expect(
        localizeAndFormatDate(
          intl,
          'America/Los_Angeles',
          getNextMonthStartInTimeZone(date, 'America/Los_Angeles')
        )
      ).toEqual('12/1/2019, 00:00');
    });
  });
});
