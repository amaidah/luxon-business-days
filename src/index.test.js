import * as holidays from './holidays';
import { DateTime, clone } from './index';
import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAY_MATCHERS } from './defaults';

beforeEach(() => {
  DateTime.prototype.clearBusinessSetup();
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

  it('knows when overridden business settings are business days', () => {
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
});

describe('plusBusiness()', () => {
  it('returns a cloned instance if invalid', () => {
    const invalid = DateTime.fromObject({ months: 13 });
    const nextDay = invalid.plusBusiness();
    nextDay.c = 'should not equal invalid.c by reference';

    expect(nextDay.isValid).toBeFalsy();
    expect(nextDay).toBeInstanceOf(DateTime);
    expect(nextDay.c).not.toEqual(invalid.c);
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

    expect(+wednesdayPlusBusinessDays === +nextMondayAfterJuly4thAndWeekend);
  });

  it('knows how to add business days through holidays setup via config', () => {
    const dt = DateTime.local(2019, 7, 3);
    const myCompanyTakesNoHolidays = [];
    dt.setupBusiness({
      holidayMatchers: myCompanyTakesNoHolidays,
    });
    const friday = DateTime.local(2019, 7, 5);
    const wednesdayPlusBusinessDays = dt.plusBusiness({ days: 2 });

    expect(+wednesdayPlusBusinessDays === +friday);
  });
});

describe('clone()', () => {
  it('knows how to clone a DateTime instance', () => {
    const dt = DateTime.fromObject({ year: 2019 });
    const copy = clone(dt);

    expect(+dt === +copy).toBe(true);

    copy.c.year = 2006;

    expect(dt.year).not.toEqual(copy.year);
    expect(dt.year).toEqual(2019);
    expect(copy.year).toEqual(2006);
  });
});
