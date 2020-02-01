import * as holidays from './holidays';

export const ONE_DAY = 1;
export const DEFAULT_BUSINESS_DAYS = [1, 2, 3, 4, 5];

const SHIPPING_HOLIDAY_MATCHERS = [
  holidays.isNewYearsDay,
  holidays.isEasterDay,
  holidays.isMemorialDay,
  holidays.isIndependanceDay,
  holidays.isLaborDay,
  holidays.isThanksgivingDay,
  holidays.isChristmasDay,
];

export const DEFAULT_HOLIDAY_MATCHERS = [...SHIPPING_HOLIDAY_MATCHERS];
