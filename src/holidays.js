import { DateTime } from 'luxon';

export const isNewYearsDay = function(inst) {
  const matchesMonth = inst.month === 1;
  const matchesDay = inst.day === 1;

  return matchesMonth && matchesDay;
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
