import { DateTime } from './index';
import * as holidays from './holidays';

describe('isNewYearsDay()', () => {
  it('knows if a date time instance is New Years Day', () => {
    const notNewYearsDay = DateTime.fromObject({ month: 4, day: 14 });

    expect(holidays.isNewYearsDay(notNewYearsDay)).toEqual(false);
  });

  it('knows a New Years Day of any year', () => {
    const nyd2019 = DateTime.fromObject({ year: 2019, month: 1, day: 1 });
    const nyd2016 = DateTime.fromObject({ year: 2016, month: 1, day: 1 });
    const nyd1988 = DateTime.fromObject({ year: 1988, month: 1, day: 1 });
    const nyd2022 = DateTime.fromObject({ year: 2022, month: 1, day: 1 });
    const newYearsDays = [nyd2019, nyd2016, nyd1988, nyd2022];

    newYearsDays.forEach(day => {
      expect(holidays.isNewYearsDay(day)).toEqual(true);
    });
  });
});

describe('isMemorialDay()', () => {
  it('early returns false if a date time instance is not in may', () => {
    const dayInFeb = DateTime.fromObject({ month: 2, day: 3 });

    expect(holidays.isMemorialDay(dayInFeb)).toEqual(false);
  });

  it('knows a Memorial Day of any year', () => {
    const memorial2019 = DateTime.fromObject({ year: 2019, month: 5, day: 27 });
    const memorial2017 = DateTime.fromObject({ year: 2017, month: 5, day: 29 });
    const memorial1988 = DateTime.fromObject({ year: 1988, month: 5, day: 30 });
    const memorial2020 = DateTime.fromObject({ year: 2020, month: 5, day: 25 });
    const memorialDays = [
      memorial2019,
      memorial2017,
      memorial1988,
      memorial2020,
    ];

    memorialDays.forEach(day => {
      expect(holidays.isMemorialDay(day)).toEqual(true);
    });
  });
});
