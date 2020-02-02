import { DateTime } from 'luxon';

import * as holidays from './holidays';

import {
  DEFAULT_BUSINESS_DAYS,
  DEFAULT_HOLIDAY_MATCHERS,
  ONE_DAY,
} from './defaults';

/**
 * All available holiday matchers provided.
 * @augments DateTime
 * @var {Object} availableHolidayMatchers
 * @property {function} isNewYearsDay - A provided holiday matcher.
 * @property {function} isEasterDay - A provided holiday matcher.
 * @property {function} isMemorialDay - A provided holiday matcher.
 * @property {function} isIndependanceDay - A provided holiday matcher.
 * @property {function} isLaborDay - A provided holiday matcher.
 * @property {function} isThanksgivingDay - A provided holiday matcher.
 * @property {function} isChristmasDay - A provided holiday matcher.
 */
DateTime.prototype.availableHolidayMatchers = holidays;

/**
 * Sets up business days and holiday matchers globally for all DateTime instances.
 * @augments DateTime
 * @method setupBusiness
 * @param {Array<number>} [businessDays=DEFAULT_BUSINESS_DAYS] - The working business days for the business.
 * @param {Array<function>} [holidayMatchers=DEFAULT_HOLIDAY_MATCHERS] - The holiday matchers used to check if a particular day is a holiday for the business.
 */
DateTime.prototype.setupBusiness = function({
  businessDays = DEFAULT_BUSINESS_DAYS,
  holidayMatchers = DEFAULT_HOLIDAY_MATCHERS,
} = {}) {
  /**
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
 * @method clearBusinessSetup
 */
DateTime.prototype.clearBusinessSetup = function() {
  delete DateTime.prototype.businessDays;
  delete DateTime.prototype.holidayMatchers;
};

/**
 * Checks if DateTime instance is a holiday by checking against all holiday matchers.
 * @augments DateTime
 * @method isHoliday
 * @returns {boolean}
 */
DateTime.prototype.isHoliday = function() {
  const holidayMatchers = this.holidayMatchers || DEFAULT_HOLIDAY_MATCHERS;

  const isDayAnyHoliday = holidayMatchers.some(holidayMatcher => {
    return holidayMatcher(this);
  });

  return isDayAnyHoliday;
};

/**
 * Checks if DateTime instance is a business day.
 * @augments DateTime
 * @method isBusinessDay
 * @returns {boolean}
 */
DateTime.prototype.isBusinessDay = function() {
  const businessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return businessDays.includes(this.weekday);
};

/**
 * Adds business days to an existing DateTime instance.
 * @augments DateTime
 * @method plusBusiness
 * @param {number} [days=1] - The number of business days to add.
 * @returns {DateTime}
 */
DateTime.prototype.plusBusiness = function({ days = ONE_DAY } = {}) {
  let dt = clone(this);
  if (!dt.isValid) {
    return dt;
  }

  let businessDaysLeftToAdd = Math.round(days);

  while (businessDaysLeftToAdd > 0) {
    dt = dt.plus({ days: ONE_DAY });

    if (dt.isBusinessDay() && !dt.isHoliday()) {
      businessDaysLeftToAdd--;
    }
  }

  return dt;
};

function clone(inst) {
  return new DateTime(Object.assign({}, inst));
}

export { DateTime, clone };
