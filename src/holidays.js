import { DateTime } from 'luxon';

import { getEasterMonthAndDay } from './helpers';
import { MONTH } from './constants';

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

  if (!getDoMonthsMatch(inst.month, MONTH.may)) {
    return false;
  }

  const instanceYear = inst.year;
  const lastDayInMay = DateTime.fromObject({
    year: instanceYear,
    month: MONTH.may,
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

// first Monday in September
export const isLaborDay = function(inst) {
  if (!getDoMonthsMatch(inst.month, MONTH.september)) {
    return false;
  }

  const instanceYear = inst.year;
  const firstDayInSeptember = DateTime.fromObject({
    year: instanceYear,
    month: MONTH.september,
    day: 1,
  });
  const weekday = firstDayInSeptember.weekday;
  const isFirstDayLaborDay = weekday === 1;
  const memorialDay = isFirstDayLaborDay
    ? firstDayInSeptember
    : firstDayInSeptember.plus({ days: 8 - weekday });

  return +inst === +memorialDay;
};

// fourth Thursday in November
export const isThanksgivingDay = function(inst) {
  if (!getDoMonthsMatch(inst.month, MONTH.november)) {
    return false;
  }

  function getPositionFromFirstThursday(weekday) {
    const positionFromThursday = 4 - weekday;
    const isThursdayInPreviousMonth = positionFromThursday < 0;

    return isThursdayInPreviousMonth
      ? positionFromThursday + 7
      : positionFromThursday;
  }

  const instanceYear = inst.year;
  const firstDayInNovember = DateTime.fromObject({
    year: instanceYear,
    month: MONTH.november,
    day: 1,
  });
  const weekday = firstDayInNovember.weekday;
  const positionFromFirstThursday = getPositionFromFirstThursday(weekday);
  const threeWeeks = 21;
  const thanksgivingDay = firstDayInNovember.plus({
    days: positionFromFirstThursday + threeWeeks,
  });

  return +inst === +thanksgivingDay;
};

export const isChristmasDay = function(inst) {
  const matchesMonth = inst.month === 12;
  const matchesDay = inst.day === 25;

  return matchesMonth && matchesDay;
};

function getDoMonthsMatch(instanceMonth, month) {
  return instanceMonth === month;
}
