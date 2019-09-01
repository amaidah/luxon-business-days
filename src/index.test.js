import { DateTime, clone } from './index';
import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAYS } from './defaults';

beforeEach(() => {
  resetGlobalDateTimeBusinessSetup();
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

  // TODO: test for holidays setup
});

describe('isBusinessDay()', () => {
  it('knows mon-fri are the default business days', () => {
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
});

describe('clone()', () => {
  it('can clone a DateTime instance', () => {
    const dt = DateTime.fromObject({ year: 2019 });
    const copy = clone(dt);

    expect(dt.toString()).toEqual(copy.toString());

    copy.c.year = 2006;

    expect(dt.year).not.toEqual(copy.year);
    expect(dt.year).toEqual(2019);
    expect(copy.year).toEqual(2006);
  });
});

function resetGlobalDateTimeBusinessSetup() {
  const dt = DateTime.local();
  dt.setupBusiness();
}
