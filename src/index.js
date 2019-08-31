if (typeof require === 'function') {
  var { DateTime } = require('luxon');
}

const DEFAULT_BUSINESS_DAYS = [1, 2, 3, 4, 5];

DateTime.prototype.setupBusiness = function(config) {
  const { businessDays, holidays } = config;

  this.businessDays = businessDays;
  this.holidays = holidays;
};

DateTime.prototype.isBusinessDay = function() {
  const defaultBusinessDays = this.businessDays || DEFAULT_BUSINESS_DAYS;

  return defaultBusinessDays.includes(this.weekday);
};

export { DateTime };
