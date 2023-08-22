import { Settings } from 'luxon';
import * as holidays from './holidays';
import { DateTime } from './index';
import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAY_MATCHERS } from './defaults';

beforeEach(() => {
  DateTime.prototype.clearBusinessSetup();

  // https://github.com/moment/luxon/blob/master/docs/upgrading.md#2x-to-30
  Settings.defaultZone = 'system';
});

describe('availableHolidayMatchers', () => {
  it('is the entire list of holidayMatchers provided by this pkg', () => {
    const dt = DateTime.local();

    expect(dt.availableHolidayMatchers).toEqual(holidays);
  });
});

describe('setupBusiness()', () => {
  it('sets the default business days when called with no arguments', () => {
    let dt = DateTime.local();
    dt.setupBusiness();

    expect(dt.businessDays).toEqual(DEFAULT_BUSINESS_DAYS);
  });

  it('can override default business days with a config object', () => {
    const dt = DateTime.local();
    dt.setupBusiness({ businessDays: [1, 3, 5, 6] });

    expect(dt.businessDays).toEqual([1, 3, 5, 6]);
  });

  it('will persist custom config through new instances', () => {
    const today = DateTime.local();
    today.setupBusiness({ businessDays: [2, 3, 6, 7] });
    const tomorrow = today.plus({ days: 1 });

    expect(today.businessDays).toEqual([2, 3, 6, 7]);
    expect(tomorrow.businessDays).toEqual([2, 3, 6, 7]);
  });

  it('unfortunately overwrites business setup config across instances', () => {
    const today = DateTime.local();
    today.setupBusiness({ businessDays: [2, 3, 6, 7] });
    const tomorrow = today.plus({ days: 1 });
    tomorrow.setupBusiness({ businessDays: [1] });

    expect(today.businessDays).toEqual([1]);
    expect(tomorrow.businessDays).toEqual([1]);
  });

  it('sets the default holiday matchers when called with no arguments', () => {
    const dt = DateTime.local();
    dt.setupBusiness();

    expect(dt.holidayMatchers).toEqual(DEFAULT_HOLIDAY_MATCHERS);
  });

  it('can override default holidays with a config object', () => {
    const dt = DateTime.local();
    const myCompanyIsNoFun = [
      holidays.isChristmasDay,
      holidays.isNewYearsDay,
      holidays.isThanksgivingDay,
    ];

    dt.setupBusiness({
      holidayMatchers: myCompanyIsNoFun,
    });

    expect(dt.holidayMatchers).toEqual(myCompanyIsNoFun);
  });
});

describe('isHoliday()', () => {
  it('knows the default holidays', () => {
    const defaultHolidays2019 = {
      newYearsDay: { dt: DateTime.local(2019, 1, 1), isHoliday: true },
      easterSunday: { dt: DateTime.local(2019, 4, 21), isHoliday: true },
      memorialDay: { dt: DateTime.local(2019, 5, 27), isHoliday: true },
      independanceDay: { dt: DateTime.local(2019, 7, 4), isHoliday: true },
      laborDay: { dt: DateTime.local(2019, 9, 2), isHoliday: true },
      thanksgivingDay: { dt: DateTime.local(2019, 11, 28), isHoliday: true },
      christmasDay: { dt: DateTime.local(2019, 12, 25), isHoliday: true },
    };

    Object.values(defaultHolidays2019).forEach(({ dt, isHoliday }) => {
      expect(dt.isHoliday()).toBe(isHoliday);
    });
  });

  it('knows the holdays setup via config', () => {
    const myCompanyIsNoFun = [
      holidays.isChristmasDay,
      holidays.isNewYearsDay,
      holidays.isThanksgivingDay,
      holidays.isIndependanceDay,
    ];
    DateTime.prototype.setupBusiness({ holidayMatchers: myCompanyIsNoFun });

    const defaultHolidays2019 = {
      newYearsDay: { dt: DateTime.local(2019, 1, 1), isHoliday: true },
      easterSunday: { dt: DateTime.local(2019, 4, 21), isHoliday: false },
      memorialDay: { dt: DateTime.local(2019, 5, 27), isHoliday: false },
      independanceDay: { dt: DateTime.local(2019, 7, 4), isHoliday: true },
      laborDay: { dt: DateTime.local(2019, 9, 2), isHoliday: false },
      thanksgivingDay: { dt: DateTime.local(2019, 11, 28), isHoliday: true },
      christmasDay: { dt: DateTime.local(2019, 12, 25), isHoliday: true },
      randomDay: { dt: DateTime.local(2019, 3, 16), isHoliday: false },
    };

    Object.values(defaultHolidays2019).forEach(({ dt, isHoliday }) => {
      expect(dt.isHoliday()).toBe(isHoliday);
    });
  });

  it('correctly passes all additional args to every holiday matchers', () => {
    const monday = [2020, 2, 24];
    const dt = DateTime.local(...monday);
    const holidayMatcherSpys = [jest.fn(), jest.fn()];

    dt.setupBusiness({
      holidayMatchers: [...holidayMatcherSpys],
    });

    dt.isHoliday('anything', ['passed'], { as: 'args' });

    holidayMatcherSpys.forEach(matcherSpy => {
      expect(matcherSpy).toHaveBeenCalledWith(dt, 'anything', ['passed'], {
        as: 'args',
      });
    });
  });
});

describe('isBusinessDay()', () => {
  it('knows mon-fri are the default business days if there was no custom business setup', () => {
    const days = {
      monday: { dt: DateTime.local(2019, 8, 26), isBusinessDay: true },
      tuesday: { dt: DateTime.local(2019, 8, 27), isBusinessDay: true },
      wednesday: { dt: DateTime.local(2019, 8, 28), isBusinessDay: true },
      thursday: { dt: DateTime.local(2019, 8, 29), isBusinessDay: true },
      friday: { dt: DateTime.local(2019, 8, 30), isBusinessDay: true },
      saturday: { dt: DateTime.local(2019, 8, 31), isBusinessDay: false },
      sunday: { dt: DateTime.local(2019, 9, 1), isBusinessDay: false },
    };

    Object.values(days).forEach(({ dt, isBusinessDay }) => {
      expect(dt.isBusinessDay()).toEqual(isBusinessDay);
    });
  });

  it('knows when overridden global business settings are business days', () => {
    const monday = [2019, 8, 26];
    let dt = DateTime.local(...monday);
    dt.setupBusiness({ businessDays: [2, 4, 7] });

    const days = {
      monday: { isBusinessDay: false },
      tuesday: { isBusinessDay: true },
      wednesday: { isBusinessDay: false },
      thursday: { isBusinessDay: true },
      friday: { isBusinessDay: false },
      saturday: { isBusinessDay: false },
      sunday: { isBusinessDay: true },
    };

    Object.values(days).forEach(({ isBusinessDay }) => {
      expect(dt.isBusinessDay()).toEqual(isBusinessDay);

      dt = dt.plus({ days: 1 });
    });
  });

  it('knows when custom business days are passed', () => {
    const monday = [2019, 8, 26];
    let dt = DateTime.local(...monday);
    const customBusinessDays = [1, 2, 4, 7];
    dt.setupBusiness({ businessDays: customBusinessDays });

    const days = {
      monday: { isBusinessDay: true },
      tuesday: { isBusinessDay: true },
      wednesday: { isBusinessDay: false },
      thursday: { isBusinessDay: true },
      friday: { isBusinessDay: false },
      saturday: { isBusinessDay: false },
      sunday: { isBusinessDay: true },
    };

    Object.values(days).forEach(({ isBusinessDay }) => {
      expect(dt.isBusinessDay(customBusinessDays)).toEqual(isBusinessDay);

      dt = dt.plus({ days: 1 });
    });
  });
});

describe('plusBusiness()', () => {
  it('returns the original instance if invalid', () => {
    const invalid = DateTime.fromObject({ months: 13 });
    const nextDay = invalid.plusBusiness();
    nextDay.c = 'should be the same instance by reference';

    expect(nextDay.isValid).toBeFalsy();
    expect(nextDay).toBeInstanceOf(DateTime);
    expect(nextDay.c).toEqual(invalid.c);
  });

  it('knows how to add one business day by default if called with no arguments', () => {
    const friday = DateTime.local(2019, 8, 23);
    const monday = DateTime.local(2019, 8, 26);
    const fridayPlusBusinessDay = friday.plusBusiness();

    expect(+fridayPlusBusinessDay === +monday).toBe(true);
  });

  it('knows how to add basic business days to a DateTime instance', () => {
    const monday = DateTime.local(2019, 8, 26);
    const wednesday = DateTime.local(2019, 8, 28);
    const mondayPlusBusinessDays = monday.plusBusiness({ days: 2 });

    expect(+mondayPlusBusinessDays === +wednesday).toBe(true);
  });

  it('knows how to add business days through weekends', () => {
    const thursday = DateTime.local(2019, 8, 22);
    const nextTuesday = DateTime.local(2019, 8, 27);
    const thursdayPlusBusinessDays = thursday.plusBusiness({ days: 3 });

    expect(+thursdayPlusBusinessDays === +nextTuesday).toBe(true);
  });

  it('knows how to add business days through default holidays like Independance Day', () => {
    const wednesday = DateTime.local(2019, 7, 3);
    const nextMondayAfterJuly4thAndWeekend = DateTime.local(2019, 7, 8);
    const wednesdayPlusBusinessDays = wednesday.plusBusiness({ days: 2 });

    expect(
      +wednesdayPlusBusinessDays === +nextMondayAfterJuly4thAndWeekend
    ).toBe(true);
  });

  it('knows how to add business days through holidays setup via config', () => {
    const dt = DateTime.local(2019, 7, 3);
    const myCompanyTakesNoHolidays = [];
    dt.setupBusiness({
      holidayMatchers: myCompanyTakesNoHolidays,
    });
    const friday = DateTime.local(2019, 7, 5);
    const wednesdayPlusBusinessDays = dt.plusBusiness({ days: 2 });

    expect(+wednesdayPlusBusinessDays === +friday).toBe(true);
  });

  it('knows how to add business days when custom business days are passed', () => {
    const dt = DateTime.local(2019, 7, 3);
    const customBusinessDays = [1, 2, 3, 4, 6]; // Saturday is a business day, but Friday is not.
    const saturday = DateTime.local(2019, 7, 6);
    const myCompanyTakesNoHolidays = [];
    dt.setupBusiness({
      holidayMatchers: myCompanyTakesNoHolidays,
    });
    const wednesdayPlusBusinessDays = dt.plusBusiness({
      days: 2,
      customBusinessDays,
    });
    console.log(wednesdayPlusBusinessDays.toJSDate());

    expect(+wednesdayPlusBusinessDays === +saturday).toBe(true);
  });

  it('knows how add a negative number of days (aka subtract days)', () => {
    const wednesday = DateTime.local(2019, 7, 3);
    const tuesday = DateTime.local(2019, 7, 2);
    const dayBeforeWednesday = wednesday.plusBusiness({ days: -1 });

    expect(+dayBeforeWednesday === +tuesday).toBe(true);
  });

  it('knows how to add negative business days through weekends', () => {
    const tuesday = DateTime.local(2019, 8, 27);
    const previousThursday = DateTime.local(2019, 8, 22);
    const tuesdayMinusBusinessDays = tuesday.plusBusiness({ days: -3 });

    expect(+tuesdayMinusBusinessDays === +previousThursday).toBe(true);
  });
});

describe('minusBusiness()', () => {
  it('knows how to subtract one business day by default if called with no arguments', () => {
    const monday = DateTime.local(2019, 8, 26);
    const friday = DateTime.local(2019, 8, 23);
    const mondayMinusBusinessDay = monday.minusBusiness();

    expect(+mondayMinusBusinessDay === +friday).toBe(true);
  });

  it('knows how to subtract business days through weekends', () => {
    const tuesday = DateTime.local(2019, 8, 27);
    const previousThursday = DateTime.local(2019, 8, 22);
    const tuesdayMinusBusinessDays = tuesday.minusBusiness({ days: 3 });

    expect(+tuesdayMinusBusinessDays === +previousThursday).toBe(true);
  });

  it('knows how to subtract business days when custom business days are passed', () => {
    const tuesday = DateTime.local(2019, 8, 27);
    const previousFriday = DateTime.local(2019, 8, 22);
    const customBusinessDays = [1, 2, 3, 4, 6]; // Saturday is a business day, but Friday is not.
    const tuesdayMinusBusinessDays = tuesday.minusBusiness({
      days: 3,
      customBusinessDays,
    });

    expect(+tuesdayMinusBusinessDays === +previousFriday).toBe(true);
  });

  it('knows how to subtract negative business days (aka add days)', () => {
    const thursday = DateTime.local(2019, 8, 22);
    const nextTuesday = DateTime.local(2019, 8, 27);
    const thursdayPlusBusinessDays = thursday.minusBusiness({ days: -3 });

    expect(+thursdayPlusBusinessDays === +nextTuesday).toBe(true);
  });
});

describe('time zone is carried over after a business-day operation', () => {
  it('holds time zone after minusBusiness with excplicit setZone()', () => {
    const ny = DateTime.utc().setZone('America/New_York');
    const nyMinusThree = ny.minusBusiness({ days: 3 });

    expect(ny.offset === nyMinusThree.offset);
    expect(ny.zoneName === nyMinusThree.zoneName);
    expect(nyMinusThree.zoneName).toBe('America/New_York');
  });

  it('holds time zone after plusBusiness() with excplicit setZone', () => {
    const ny = DateTime.utc().setZone('America/New_York');
    const nyPlusThree = ny.plusBusiness({ days: 3 });

    expect(ny.offset === nyPlusThree.offset);
    expect(ny.zoneName === nyPlusThree.zoneName);
    expect(nyPlusThree.zoneName).toBe('America/New_York');
  });

  it('overrides a defaultZone from Luxon Settings', () => {
    Settings.defaultZone = 'America/Los_Angeles';

    const utc = DateTime.fromObject(
      {
        year: 2020,
        month: 12,
        day: 6,
      },
      { zone: 'utc' }
    );
    const utcPlusTen = utc.plusBusiness({ days: 10 });

    expect(utc.zoneName === utcPlusTen.zoneName);
    expect(utc.offset === utcPlusTen.offset);
    expect(utcPlusTen.zoneName).toBe('UTC');
  });

  it('respects default zoning', () => {
    // Luxon starts out as system zone by default but explicitly set here for readability
    Settings.defaultZone = 'system';

    const defaultZone = DateTime.local();
    const setAsDefaultZone = DateTime.local({ zone: 'default' });

    expect(defaultZone.zoneName).toEqual(setAsDefaultZone.zoneName);

    Settings.defaultZone = 'America/New_York';

    const ny = DateTime.local();
    const nyPlusTwo = ny.plusBusiness({ days: 2 });

    expect(ny.zoneName).toBe('America/New_York');
    expect(nyPlusTwo.zoneName).toBe('America/New_York');
  });
});

describe('business days works through breakings changes on upgrading luxon to 3.X from 1.X', () => {
  it('respects system vs default zones', () => {
    Settings.defaultZone = 'America/Chicago';

    expect(DateTime.local().zoneName).toEqual('America/Chicago');
    expect(DateTime.local({ zone: 'default' }).zoneName).toEqual(
      'America/Chicago'
    );
    expect(DateTime.local({ zone: 'system' }).zoneName).toEqual(
      DateTime.local({ zone: 'local' }).zoneName
    );
  });

  it('handles fromObject param changes', () => {
    const chicagoTime = DateTime.fromObject(
      { hour: 2 },
      { zone: 'America/Chicago' }
    );

    const nextChicagoBizDay = chicagoTime.plusBusiness();

    expect(chicagoTime.zoneName).toBe('America/Chicago');
    expect(nextChicagoBizDay.zoneName).toBe('America/Chicago');
  });

  it('handles toLocaleString changes', () => {
    let dt = DateTime.local(2020, 1, 1);
    dt = dt.plusBusiness();

    const koreanLocaleString = dt.toLocaleString(
      { year: 'numeric', weekday: 'long', month: 'numeric', day: '2-digit' },
      { locale: 'ko' }
    );

    expect(koreanLocaleString).toBe('2020. 1. 02. 목요일');
  });
});
