import { DateTime } from './index';
import { DEFAULT_BUSINESS_DAYS, DEFAULT_HOLIDAYS } from './defaults';

// clone really means, "make a new object with these modifications". all "setters" really use this
// to create a new object while only changing some of the properties
// function clone(inst, alts) {
//   const current = {
//     ts: inst.ts,
//     zone: inst.zone,
//     c: inst.c,
//     o: inst.o,
//     loc: inst.loc,
//     invalid: inst.invalid
//   };
//   return new DateTime(Object.assign({}, current, alts, { old: current }));
// }

describe('setupBusiness()', () => {
  it('sets the default business days when called with no arguments', () => {
    let dt = DateTime.local();
    dt.setupBusiness();

    expect(dt.businessDays).toEqual(DEFAULT_BUSINESS_DAYS);
  });

  it('can override default business days with a config object', () => {
    const dt = DateTime.local();
    dt.setupBusiness({ businessDays: [1, 3, 5, 6] });
    const next = dt.plus({ days: 1 });

    console.log(next.businessDays);

    console.log(next.isBusinessDay());

    expect(dt.businessDays).toEqual([1, 3, 5, 6]);
  });

  // TODO: test for holidays setup
});

describe('isBusinessDay()', () => {
  xit('knows mon-fri are the default business days', () => {
    const dt = DateTime.local(2019, 8, 26);
    console.log(dt);
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

  xit('knows when overridden business settings are business days', () => {
    let dt = DateTime.local(2019, 8, 26);
    dt.setupBusiness({ businessDays: [2, 4, 7] });
    dt.plus({ days: 1 });
    console.log(dt.plus({ days: 2 }));
    console.log(dt.businessDays);
    const days = {
      monday: { dt: dt, isBusinessDay: false },
      tuesday: { dt: dt.plus({ days: 1 }), isBusinessDay: true },
      wednesday: { dt: dt.plus({ days: 2 }), isBusinessDay: false },
      thursday: { dt: dt.plus({ days: 3 }), isBusinessDay: true },
      friday: { dt: dt.plus({ days: 4 }), isBusinessDay: false },
      saturday: { dt: dt.plus({ days: 5 }), isBusinessDay: false },
      sunday: { dt: dt.plus({ days: 6 }), isBusinessDay: true },
    };

    Object.values(days).forEach(({ dt, isBusinessDay }, i) => {
      // console.log(i);
      // console.log(dt);
      expect(dt.isBusinessDay()).toEqual(isBusinessDay);
    });
  });
});
