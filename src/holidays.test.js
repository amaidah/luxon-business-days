import { DateTime } from './index';
import * as holidays from './holidays';

describe('isNewYearsDay()', () => {
  it('knows if a date time instance is not New Years Day', () => {
    const notNewYearsDay = DateTime.fromObject({ month: 4, day: 14 });

    expect(holidays.isNewYearsDay(notNewYearsDay)).toEqual(false);
  });

  it('knows a New Years Day of any year', () => {
    const nyd2019 = DateTime.fromObject({
      year: 2019,
      month: 1,
      day: 1,
      hour: 1,
    });
    const nyd2016 = DateTime.fromObject({
      year: 2016,
      month: 1,
      day: 1,
      hour: 1,
    });
    const nyd1988 = DateTime.fromObject({
      year: 1988,
      month: 1,
      day: 1,
      hour: 1,
    });
    const nyd2022 = DateTime.fromObject({
      year: 2022,
      month: 1,
      day: 1,
      hour: 1,
    });
    const newYearsDays = [nyd2019, nyd2016, nyd1988, nyd2022];

    newYearsDays.forEach(day => {
      expect(holidays.isNewYearsDay(day)).toEqual(true);
    });
  });
});

describe('isMLKDay()', () => {
  it('knows a MLK Day of any year', () => {
    const mlk2020 = DateTime.fromObject({
      year: 2020,
      month: 1,
      day: 20,
      hour: 1,
    });
    const mlk2024 = DateTime.fromObject({
      year: 2024,
      month: 1,
      day: 15,
      hour: 1,
    });
    const mlk2015 = DateTime.fromObject({
      year: 2015,
      month: 1,
      day: 19,
      hour: 1,
    });
    const mlk2017 = DateTime.fromObject({
      year: 2017,
      month: 1,
      day: 16,
      hour: 1,
    });
    const mlk2036 = DateTime.fromObject({
      year: 2036,
      month: 1,
      day: 21,
      hour: 1,
    });
    const mlkDays = [mlk2020, mlk2024, mlk2015, mlk2017, mlk2036];

    mlkDays.forEach(day => {
      expect(holidays.isMLKDay(day)).toEqual(true);
    });
  });

  it('knows if a day is not mlk day', () => {
    const someRandomDays = [
      DateTime.fromObject({ month: 1, day: 13, hour: 1 }),
      DateTime.fromObject({ month: 1, day: 3, hour: 1 }),
      DateTime.fromObject({ month: 5, day: 23, hour: 1 }),
    ];

    someRandomDays.forEach(day => {
      expect(holidays.isMLKDay(day)).toEqual(false);
    });
  });
});

describe('isMemorialDay()', () => {
  it('early returns false if a date time instance is not in may', () => {
    const dayInFeb = DateTime.fromObject({ month: 2, day: 3, hour: 1 });

    expect(holidays.isMemorialDay(dayInFeb)).toEqual(false);
  });

  it('knows a Memorial Day of any year', () => {
    const memorial2019 = DateTime.fromObject({
      year: 2019,
      month: 5,
      day: 27,
      hour: 1,
    });
    const memorial2017 = DateTime.fromObject({
      year: 2017,
      month: 5,
      day: 29,
      hour: 1,
    });
    const memorial1988 = DateTime.fromObject({
      year: 1988,
      month: 5,
      day: 30,
      hour: 1,
    });
    const memorial2020 = DateTime.fromObject({
      year: 2020,
      month: 5,
      day: 25,
      hour: 1,
    });
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

describe('isEasterDay()', () => {
  it('knows an Easter Day of any year', () => {
    const easter2019 = DateTime.fromObject({
      year: 2019,
      month: 4,
      day: 21,
      hour: 1,
    });
    const easter2016 = DateTime.fromObject({
      year: 2016,
      month: 3,
      day: 27,
      hour: 1,
    });
    const easter1988 = DateTime.fromObject({
      year: 1988,
      month: 4,
      day: 3,
      hour: 1,
    });
    const easter2020 = DateTime.fromObject({
      year: 2020,
      month: 4,
      day: 12,
      hour: 1,
    });
    const easter2024 = DateTime.fromObject({
      year: 2024,
      month: 3,
      day: 31,
      hour: 1,
    });
    const easter2008 = DateTime.fromObject({
      year: 2008,
      month: 3,
      day: 23,
      hour: 1,
    });
    const easterDays = [
      easter2019,
      easter2016,
      easter1988,
      easter2020,
      easter2024,
      easter2008,
    ];

    easterDays.forEach(day => {
      expect(holidays.isEasterDay(day)).toEqual(true);
    });
  });

  it('knows days that are not Easter Day', () => {
    const notEasterDays = [
      DateTime.fromObject({ year: 2019, month: 4, day: 22, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 1, day: 16, hour: 1 }),
      DateTime.fromObject({ year: 1988, month: 11, day: 23, hour: 1 }),
      DateTime.fromObject({ year: 2020, month: 8, day: 2, hour: 1 }),
    ];

    notEasterDays.forEach(day => {
      expect(holidays.isEasterDay(day)).toEqual(false);
    });
  });
});

describe('isIndependanceDay()', () => {
  it('konws an Independance Day of any year', () => {
    const independanceDays = [
      DateTime.fromObject({ year: 1988, month: 7, day: 4, hour: 1 }),
      DateTime.fromObject({ year: 2020, month: 7, day: 4, hour: 1 }),
    ];

    independanceDays.forEach(day => {
      expect(holidays.isIndependanceDay(day)).toEqual(true);
    });
  });

  it('knows days that are not Independance Day', () => {
    const notIndependanceDays = [
      DateTime.fromObject({ year: 2019, month: 4, day: 22, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 1, day: 16, hour: 1 }),
    ];

    notIndependanceDays.forEach(day => {
      expect(holidays.isIndependanceDay(day)).toEqual(false);
    });
  });
});

describe('isLaborDay()', () => {
  it('early returns false if a date time instance is not in september', () => {
    const dayInFeb = DateTime.fromObject({ month: 2, day: 3, hour: 1 });

    expect(holidays.isLaborDay(dayInFeb)).toEqual(false);
  });

  it('knows a non september 1st Labor Day of any year', () => {
    const labor2019 = DateTime.fromObject({ year: 2019, month: 9, day: 2 });
    const labor2017 = DateTime.fromObject({ year: 2017, month: 9, day: 4 });
    const labor1988 = DateTime.fromObject({ year: 1988, month: 9, day: 5 });
    const labor2020 = DateTime.fromObject({ year: 2020, month: 9, day: 7 });
    const laborDays = [labor2019, labor2017, labor1988, labor2020];

    laborDays.forEach(day => {
      expect(holidays.isLaborDay(day)).toEqual(true);
    });
  });

  it('knows a september 1st Labor Day', () => {
    const labor2025 = DateTime.fromObject({
      year: 2025,
      month: 9,
      day: 1,
      hour: 1,
    });

    expect(holidays.isLaborDay(labor2025)).toEqual(true);
  });

  it('knows days that are not Labor Day in september', () => {
    const notLaborDays = [
      DateTime.fromObject({ year: 2019, month: 9, day: 22, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 9, day: 16, hour: 1 }),
    ];

    notLaborDays.forEach(day => {
      expect(holidays.isLaborDay(day)).toEqual(false);
    });
  });
});

describe('isColumbusDay()', () => {
  it('knows Columbus Days of any year', () => {
    const columb2019 = DateTime.fromObject({
      year: 2019,
      month: 10,
      day: 14,
      hour: 1,
    });
    const columb2017 = DateTime.fromObject({
      year: 2017,
      month: 10,
      day: 9,
      hour: 1,
    });
    const columb1988 = DateTime.fromObject({
      year: 1988,
      month: 10,
      day: 10,
      hour: 1,
    });
    const columb2020 = DateTime.fromObject({
      year: 2020,
      month: 10,
      day: 12,
      hour: 1,
    });
    const columb2036 = DateTime.fromObject({
      year: 2036,
      month: 10,
      day: 13,
      hour: 1,
    });
    const columbDays = [
      columb2019,
      columb2017,
      columb1988,
      columb2020,
      columb2036,
    ];

    columbDays.forEach(day => {
      expect(holidays.isColumbusDay(day)).toEqual(true);
    });
  });

  it('knows days that are not Columbus Day in October', () => {
    const notColumbusDays = [
      DateTime.fromObject({ year: 2019, month: 10, day: 22, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 10, day: 16, hour: 1 }),
    ];

    notColumbusDays.forEach(day => {
      expect(holidays.isColumbusDay(day)).toEqual(false);
    });
  });

  it('knows if a day is not Columbus Day', () => {
    const someRandomDays = [
      DateTime.fromObject({ month: 1, day: 13, hour: 1 }),
      DateTime.fromObject({ month: 1, day: 3, hour: 1 }),
      DateTime.fromObject({ month: 5, day: 23, hour: 1 }),
    ];

    someRandomDays.forEach(day => {
      expect(holidays.isColumbusDay(day)).toEqual(false);
    });
  });
});

describe('isThanksgivingDay()', () => {
  it('knows Thanksgiving Days of any year', () => {
    const thanks2019 = DateTime.fromObject({
      year: 2019,
      month: 11,
      day: 28,
      hour: 1,
    });
    const thanks2017 = DateTime.fromObject({
      year: 2017,
      month: 11,
      day: 23,
      hour: 1,
    });
    const thanks1988 = DateTime.fromObject({
      year: 1988,
      month: 11,
      day: 24,
      hour: 1,
    });
    const thanks2020 = DateTime.fromObject({
      year: 2020,
      month: 11,
      day: 26,
      hour: 1,
    });
    const thanksDays = [thanks2019, thanks2017, thanks1988, thanks2020];

    thanksDays.forEach(day => {
      expect(holidays.isThanksgivingDay(day)).toEqual(true);
    });
  });

  it('knows Thanksgiving Day when November 1st happens to be the first Thursday', () => {
    const yearWhenNovemberFirstWasThursday = 2018;
    const thanks2018 = DateTime.fromObject({
      year: yearWhenNovemberFirstWasThursday,
      month: 11,
      day: 22,
      hour: 1,
    });

    expect(holidays.isThanksgivingDay(thanks2018)).toEqual(true);
  });

  it('knows Thanksgiving Day when November 1st happens before Thursday of the week', () => {
    const yearWhenNovemberFirstWasBeforeThursday = 2021;
    const thanks2018 = DateTime.fromObject({
      year: yearWhenNovemberFirstWasBeforeThursday,
      month: 11,
      day: 25,
      hour: 1,
    });

    expect(holidays.isThanksgivingDay(thanks2018)).toEqual(true);
  });

  it('knows Thanksgiving Day when November 1st happens after Thursday of the week', () => {
    const yearWhenNovemberFirstWasAfterThursday = 2024;
    const thanks2018 = DateTime.fromObject({
      year: yearWhenNovemberFirstWasAfterThursday,
      month: 11,
      day: 28,
      hour: 1,
    });

    expect(holidays.isThanksgivingDay(thanks2018)).toEqual(true);
  });

  it('knows days that are not Thanksgiving Days', () => {
    const notThanksgivingDays = [
      DateTime.fromObject({ year: 2019, month: 3, day: 2, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 9, day: 25, hour: 1 }),
    ];

    notThanksgivingDays.forEach(day => {
      expect(holidays.isThanksgivingDay(day)).toEqual(false);
    });
  });
});

describe('isChristmasDay()', () => {
  it('knows Christmas Days of any year', () => {
    const christmasDays = [
      DateTime.fromObject({ year: 1988, month: 12, day: 25, hour: 1 }),
      DateTime.fromObject({ year: 2020, month: 12, day: 25, hour: 1 }),
    ];

    christmasDays.forEach(day => {
      expect(holidays.isChristmasDay(day)).toEqual(true);
    });
  });

  it('knows days that are not Christmas Days', () => {
    const notChristmasDays = [
      DateTime.fromObject({ year: 2019, month: 3, day: 2, hour: 1 }),
      DateTime.fromObject({ year: 2016, month: 9, day: 25, hour: 1 }),
    ];

    notChristmasDays.forEach(day => {
      expect(holidays.isChristmasDay(day)).toEqual(false);
    });
  });
});
