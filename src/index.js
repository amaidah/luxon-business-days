/**
 * @augments DateTime
 */
let DateTime;

/* istanbul ignore next */
if (typeof luxon === 'object' && typeof window !== 'undefined') {
  /* istanbul ignore next */
  DateTime = luxon.DateTime;
} else {
  /* istanbul ignore next */
  DateTime = require('luxon').DateTime;
}

import * as holidays from './holidays';
import * as helpers from './helpers';

import {
  DEFAULT_BUSINESS_DAYS,
  DEFAULT_HOLIDAY_MATCHERS,
  ONE_DAY,
} from './defaults';

/**
 * All built-in holiday matchers.
 * @augments DateTime
 * @member {Object}
 * @property {function} isNewYearsDay - A provided holiday matcher.
 * @property {function} isMLKDay - A provided holiday matcher.
 * @property {function} isEasterDay - A provided holiday matcher.
 * @property {function} isMemorialDay - A provided holiday matcher.
 * @property {function} isIndependanceDay - A provided holiday matcher.
 * @property {function} isLaborDay - A provided holiday matcher.
 * @property {function} isColumbusDay - A provided holiday matcher.
 * @property {function} isThanksgivingDay - A provided holiday matcher.
 * @property {function} isChristmasDay - A provided holiday matcher.
 */
DateTime.prototype.availableHolidayMatchers = holidays;

/**
 * Exposes all available holiday helpers to a DateTime instance.
 * @augments DateTime
 * @member {Object}
 * @property {function} getEasterMonthAndDay - A provided holiday helper function that can be helpful for custom holiday matchers.
 */
DateTime.prototype.availableHolidayHelpers = helpers;

/**
 * Sets up business days and holiday matchers globally for all DateTime instances.
 * @augments DateTime
 * @param {Array<number>} [businessDays=DEFAULT_BUSINESS_DAYS] - The working business days for the business.
 * @param {Array<function>} [holidayMatchers=DEFAULT_HOLIDAY_MATCHERS] - The holiday matchers used to check if a particular day is a holiday for the business.
 */
DateTime.prototype.setupBusiness = function({
  businessDays = DEFAULT_BUSINESS_DAYS,
  holidayMatchers = DEFAULT_HOLIDAY_MATCHERS,
} = {}) {
  /*
   * luxon does not clone custom properties so to maintain
   * config access across new instances we add our config
   * to the chain as a workaround
   * https://github.com/moment/luxon/blob/master/src/datetime.js#L62
   *
   * The limitation to this is that this plugin can only support one
   * business setup at a time currently
   */
  DateTime.prototype.businessDays = businessDays;
  DateTime.prototype.holidayMatchers = holidayMatchers;
};

/**
 * Clears business setup globally from all DateTime instances.
 * @augments DateTime
 */
DateTime.prototype.clearBusinessSetup = function() {
  delete DateTime.prototype.businessDays;
  delete DateTime.prototype.holidayMatchers;
};

/**
 * Checks if DateTime instance is a holiday by checking against all holiday matchers.
 * @augments DateTime
 * @param {...*} [args] - Any additional arguments to pass through to each holiday matcher.
 * @returns {boolean}
 */
DateTime.prototype.isHoliday = function(...args) {
  const holidayMatchers = this.holidayMatchers || DEFAULT_HOLIDAY_MATCHERS;

  const isDayAnyHoliday = holidayMatchers.some(holidayMatcher => {
    return holidayMatcher(this, ...args);
  });

  return isDayAnyHoliday;
};

/**
 * Checks if DateTime instance is a business day.
 * @augments DateTime
 * @returns {boolean}
 */
DateTime.prototype.isBusinessDay = function() {
  const businessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return businessDays.includes(this.weekday);
};

/**
 * Adds business days to an existing DateTime instance.
 * @augments DateTime
 * @param {number} [days=1] - The number of business days to add.
 * @returns {DateTime}
 */
DateTime.prototype.plusBusiness = function({ days = ONE_DAY } = {}) {
  let dt = this;

  if (!dt.isValid) {
    return dt;
  }

  const isNegative = days < 0;

  let businessDaysLeftToAdd = isNegative
    ? Math.round(-1 * days)
    : Math.round(days);

  while (businessDaysLeftToAdd > 0) {
    const oneDayByDirection = isNegative ? -ONE_DAY : ONE_DAY;

    dt = dt.plus({ days: oneDayByDirection });

    if (dt.isBusinessDay() && !dt.isHoliday()) {
      businessDaysLeftToAdd--;
    }
  }

  return dt;
};

/**
 * Subtracts business days to an existing DateTime instance.
 * @augments DateTime
 * @param {number} [days=1] - The number of business days to subtract.
 * @returns {DateTime}
 */
DateTime.prototype.minusBusiness = function({ days = ONE_DAY } = {}) {
  return this.plusBusiness({ days: -days });
};

/**
 * @typedef BusinessDiffConfig
 * @property {boolean} [includeEndDate=false] includeEndDate
 * @property {boolean} [relative=false] relative
 */

/**
 * Returns the difference in business days.  Set relative to true if you need to support past dates.
 * @param {DateTime} targetDate
 * @param {BusinessDiffConfig} config
 * @returns {number}
 */
DateTime.prototype.businessDiff = function(
  targetDate,
  { includeEndDate = false, relative = false } = {}
) {
  let dt = this;
  let start = dt < targetDate ? dt : targetDate;
  let end = dt < targetDate ? targetDate : dt;
  let daysDiff = includeEndDate ? 1 : 0;
  let isSameDay =
    dt.hasSame(targetDate, 'day') &&
    dt.hasSame(targetDate, 'month') &&
    dt.hasSame(targetDate, 'year');

  if (isSameDay) {
    return daysDiff;
  }

  while (start < end) {
    if (start.isBusinessDay() && !start.isHoliday()) {
      daysDiff += 1;
    }

    start = start.plus({ days: 1 });
  }

  if (relative) {
    return dt <= targetDate ? daysDiff : -daysDiff;
  }

  return daysDiff;
};

export { DateTime };
