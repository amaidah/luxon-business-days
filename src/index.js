import { DateTime } from 'luxon';

import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAYS, ONE_DAY } from './defaults';

DateTime.prototype.setupBusiness = function({
  businessDays = DEFAULT_BUSINESS_DAYS,
  holidays = DEFAULT_HOLIDAYS,
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
  DateTime.prototype.holidays = holidays;
};

DateTime.prototype.clearBusinessSetup = function() {
  delete DateTime.prototype.businessDays;
  delete DateTime.prototype.holidays;
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

    if (dt.isBusinessDay()) {
      businessDaysLeftToAdd--;
    }
  }

  return dt;
};

function clone(inst) {
  return new DateTime(Object.assign({}, inst));
}

export { DateTime, clone };
