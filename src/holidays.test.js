import { DateTime } from './index';
import * as holidays from './holidays';

describe('isNewYearsDay()', () => {
  it('knows if a date time instance is not New Years Day', () => {
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

describe('isEasterDay()', () => {
  it('konws an Easter Day of any year', () => {
    const easter2019 = DateTime.fromObject({ year: 2019, month: 4, day: 21 });
    const easter2016 = DateTime.fromObject({ year: 2016, month: 3, day: 27 });
    const easter1988 = DateTime.fromObject({ year: 1988, month: 4, day: 3 });
    const easter2020 = DateTime.fromObject({ year: 2020, month: 4, day: 12 });
    const easter2024 = DateTime.fromObject({ year: 2024, month: 3, day: 31 });
    const easter2008 = DateTime.fromObject({ year: 2008, month: 3, day: 23 });
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
      DateTime.fromObject({ year: 2019, month: 4, day: 22 }),
      DateTime.fromObject({ year: 2016, month: 1, day: 16 }),
      DateTime.fromObject({ year: 1988, month: 11, day: 23 }),
      DateTime.fromObject({ year: 2020, month: 8, day: 2 }),
    ];

    notEasterDays.forEach(day => {
      expect(holidays.isEasterDay(day)).toEqual(false);
    });
  });
});

describe('isIndependanceDay()', () => {
  it('konws an Independance Day of any year', () => {
    const independanceDays = [
      DateTime.fromObject({ year: 1988, month: 7, day: 4 }),
      DateTime.fromObject({ year: 2020, month: 7, day: 4 }),
    ];

    independanceDays.forEach(day => {
      expect(holidays.isIndependanceDay(day)).toEqual(true);
    });
  });

  it('knows days that are not Independance Day', () => {
    const notIndependanceDays = [
      DateTime.fromObject({ year: 2019, month: 4, day: 22 }),
      DateTime.fromObject({ year: 2016, month: 1, day: 16 }),
    ];

    notIndependanceDays.forEach(day => {
      expect(holidays.isIndependanceDay(day)).toEqual(false);
    });
  });
});

describe('isLaborDay()', () => {
  it('early returns false if a date time instance is not in september', () => {
    const dayInFeb = DateTime.fromObject({ month: 2, day: 3 });

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
    const labor2025 = DateTime.fromObject({ year: 2025, month: 9, day: 1 });

    expect(holidays.isLaborDay(labor2025)).toEqual(true);
  });

  it('knows days that are not Labor Day in september', () => {
    const notLaborDays = [
      DateTime.fromObject({ year: 2019, month: 9, day: 22 }),
      DateTime.fromObject({ year: 2016, month: 9, day: 16 }),
    ];

    notLaborDays.forEach(day => {
      expect(holidays.isLaborDay(day)).toEqual(false);
    });
  });
});
