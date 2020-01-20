import { DateTime } from 'luxon';

import { getEasterMonthAndDay } from './helpers';

export const isNewYearsDay = function(inst) {
  const matchesMonth = inst.month === 1;
  const matchesDay = inst.day === 1;

  return matchesMonth && matchesDay;
};

// first Sunday after the Full Moon date, that falls on or after March 21
export const isEasterDay = function(inst) {
  const instanceYear = inst.year;
  const [
    easterMonthForInstanceYear,
    easterDayForInstanceYear,
  ] = getEasterMonthAndDay(instanceYear);
  const easterDay = DateTime.fromObject({
    year: instanceYear,
    month: easterMonthForInstanceYear,
    day: easterDayForInstanceYear,
  });

  return +inst === +easterDay;
};

// last Monday of May
export const isMemorialDay = function(inst) {
  const DAYS_IN_MAY = 31;
  const MONTH_OF_MAY = 5;
  const isMatchingMonth = inst.month === MONTH_OF_MAY;

  if (!isMatchingMonth) {
    return false;
  }

  const instanceYear = inst.year;
  const lastDayInMay = DateTime.fromObject({
    year: instanceYear,
    month: MONTH_OF_MAY,
    day: DAYS_IN_MAY,
  });
  const weekday = lastDayInMay.weekday;
  const memorialDay = lastDayInMay.minus({ days: weekday - 1 });

  return +inst === +memorialDay;
};

export const isIndependanceDay = function(inst) {
  const matchesMonth = inst.month === 7;
  const matchesDay = inst.day === 4;

  return matchesMonth && matchesDay;
};
