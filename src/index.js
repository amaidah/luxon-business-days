import { DateTime } from 'luxon';

import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAYS } from './defaults';

DateTime.prototype.setupBusiness = function({
  businessDays = DEFAULT_BUSINESS_DAYS,
  holidays = DEFAULT_HOLIDAYS,
} = {}) {
  /**
   * luxon does not clone custom properties so to maintain
   * config access across new instances we add our config
   * to the chain as a workaround
   * https://github.com/moment/luxon/blob/master/src/datetime.js#L62
   */
  DateTime.prototype.businessDays = businessDays;
  DateTime.prototype.holidays = holidays;
};

DateTime.prototype.isBusinessDay = function() {
  const defaultBusinessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return defaultBusinessDays.includes(this.weekday);
};

export { DateTime };
