if (typeof require === 'function') {
  var { DateTime } = require('luxon');
}

const DEFAULT_BUSINESS_DAYS = [1, 2, 3, 4, 5];

// Object.defineProperty(DateTime, 'businessDays', {
//   get: function() {
//     return this.businessDays;
//   },
//   set: function(newBusinessDays) {
//     this.businessDays = newBusinessDays;
//   },
// });

// DateTime.prototype.defineBusinessDays = function(businessDays) {
//   this.businessDays = businessDays;
// };

// DateTime.prototype.getBusinessDays = function() {
//   console.log(this.businessDays);
//   return this.businessDays;
// };

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
