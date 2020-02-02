import { DateTime } from 'luxon';

import {
  DEFAULT_BUSINESS_DAYS,
  DEFAULT_HOLIDAY_MATCHERS,
  ONE_DAY,
} from './defaults';

/**
 * Sets up business days and holiday matchers.
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

DateTime.prototype.clearBusinessSetup = function() {
  delete DateTime.prototype.businessDays;
  delete DateTime.prototype.holidayMatchers;
};

DateTime.prototype.isHoliday = function() {
  const holidayMatchers = this.holidayMatchers || DEFAULT_HOLIDAY_MATCHERS;

  const isDayAnyHoliday = holidayMatchers.some(holidayMatcher => {
    return holidayMatcher(this);
  });

  return isDayAnyHoliday;
};

DateTime.prototype.isBusinessDay = function() {
  const businessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return businessDays.includes(this.weekday);
};

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
