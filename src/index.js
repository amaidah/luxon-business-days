import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAYS } from './defaults';

// if (typeof require === 'function') {
var { DateTime } = require('luxon');
// }

DateTime.prototype.setupBusiness = function({
  businessDays = DEFAULT_BUSINESS_DAYS,
  holidays = DEFAULT_HOLIDAYS,
} = {}) {
  // luxon is immutable so we add our config to the chain
  // so we can maintain access across new instances
  DateTime.prototype.businessDays = businessDays;
  DateTime.prototype.holidays = holidays;
};

DateTime.prototype.isBusinessDay = function() {
  console.log('this.businessDays', this.businessDays);
  const defaultBusinessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return defaultBusinessDays.includes(this.weekday);
};

export { DateTime };
