# Luxon Business Days

![npm](https://img.shields.io/npm/v/luxon-business-days)
[![CircleCI](https://circleci.com/gh/amaidah/luxon-business-days/tree/master.svg?style=svg)](https://circleci.com/gh/amaidah/luxon-business-days/tree/master)
[![codecov](https://codecov.io/gh/amaidah/luxon-business-days/branch/master/graph/badge.svg)](https://codecov.io/gh/amaidah/luxon-business-days)
![luxon-business-days](https://badgen.net/bundlephobia/minzip/luxon-business-days)
![npm](https://img.shields.io/npm/dm/luxon-business-days)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/luxon-business-days)

Luxon Business Days is a [Luxon](https://github.com/moment/luxon) plugin for calculating and manipulating business days.

Inspired by [moment-business-days](https://github.com/kalmecak/moment-business-days).

## Features

- Add business days to a standard luxon `DateTime` instance. For instance, to calculate the arrival date of a shipment.
- Customizable and extendable. Configure the business working days and holidays of your business.
- Uses holiday "matcher functions" avoiding the need to manually maintain and update holiday date configs every year.

## Install

### Versions

Package versions 3+ supports luxon 3+.

For luxon ^1.X, check out [2.8.3](https://github.com/amaidah/luxon-business-days/tree/v2.8.3)

### Via NPM

Already using luxon:

```bash
yarn add luxon-business-days
```

```diff
- import { DateTime } from 'luxon';
+ import { DateTime } from 'luxon-business-days';
// Use DateTime as normal
```

Not already using luxon:

```bash
yarn add luxon luxon-business-days
```

```javascript
import { DateTime } from 'luxon-business-days';
// Use DateTime as normal
```

### Via Browser Script

```html
<script src="https://cdn.jsdelivr.net/npm/luxon@1.25.0/build/global/luxon.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/luxon-business-days/dist/index.js"></script>
```

Make sure `luxon` script is loaded before `luxon-business-days`. For production use, it is recommended to tag a version in the script url like so:

```
https://cdn.jsdelivr.net/npm/luxon-business-days@2.7.0/dist/index.js
```

```html
<head> 
  <script src="https://cdn.jsdelivr.net/npm/luxon@1.25.0/build/global/luxon.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/luxon-business-days/dist/index.js"></script>
</head> 

<body> 
  <script>
    let dt = luxon.DateTime.local();
    const nextBizDay = dt.plusBusiness();

    console.log(nextBizDay.toLocaleString());
  </script>
</body> 
```

## Config

Default business days:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday

Default holidays (aka shipping holidays via UPS):

- New Year's Day
- Easter Day
- Memorial Day
- Independance Day
- Labor Day
- Thanksgiving Day
- Christmas Day

#### Configure business days

```javascript
import { DateTime } from 'luxon-business-days';

const dt = DateTime.local();

// [Mon, Thur, Fri, Sun]
const awesomeFourDayBusinessWeek = [1, 4, 5, 7];

dt.setupBusiness({ businessDays: awesomeFourDayBusinessWeek });
```

#### Configure holidays

Pick from available holiday matchers:

```javascript
import { DateTime } from 'luxon-business-days';

const dt = DateTime.local();
const { availableHolidayMatchers } = dt;
const myCompanyIsNoFun = [
  availableHolidayMatchers.isNewYearsDay,
  availableHolidayMatchers.isChristmasDay,
];

dt.setupBusiness({ holidayMatchers: myCompanyIsNoFun });
```

No holidays:

```javascript
import { DateTime } from 'luxon-business-days';

const dt = DateTime.local();

dt.setupBusiness({ holidayMatchers: [] });
// Congrats, you will successfuly get everyone to quit
```

Custom holiday matchers:

A holiday matcher is simply a function that takes in a `DateTime` instance and returns a boolean. This allows you to algorithmically determine what is considered a holiday without requiring a hardcoded list of dates that are updated and maintained annually.

It is easy to write a basic matcher:

```javascript
import { DateTime } from 'luxon-business-days';

/**
 * @param {DateTime} - An instance of DateTime.
 * @returns {boolean}
 */
const isCelebratingKobe = function(inst) {
  // Commemorate the day Kobe died
  const kobeRIP = DateTime.fromObject({ month: 1, day: 26 });

  // Celebrate Kobe Day
  const kobeDay = DateTime.fromObject({ month: 8, day: 24 });

  // Matches the following two days regardless of year
  return +inst === +kobeRIP || +inst === +kobeDay;
};

const dt = DateTime.local();
const myHolidays = [
  dt.availableHolidayMatchers.isNewYearsDay,
  dt.availableHolidayMatchers.isChristmasDay,
  isCelebratingKobe,
];

dt.setupBusiness({ holidayMatchers: myHolidays });
// Congrats, now your business will consider New Years, 
// Christmas, and the two Kobe days as holidays.
```

Tip: When writing custom holiday matchers, it is probably better to avoid harcoding years or dates and instead programatically generating holidays. Take a look at the provided [matchers](https://github.com/amaidah/luxon-business-days/blob/master/src/holidays.js) for ideas.

## Usage

Basic:

```javascript
import { DateTime } from 'luxon-business-days';

// Day before July 4
let dt = DateTime.local(2019, 7, 3);

dt = dt.plusBusiness(); // 7/5/19 - Friday
dt = dt.plusBusiness({ days: 2 }); // 7/9/19 - Tuesday (Skipped through Saturday/Sunday)
dt = dt.minusBusiness({ days: 2 }); // back to 7/5/19
dt = dt.minusBusiness({ days: -2 }) // back to 7/9/19
dt = dt.plusBusiness({ days: -2 }); // back to 7/5/19

// Now do what you normally would with a DateTime instance.
```

Passing additional arguments to matchers:

Perhaps you need to calculate regional holidays manually and want to pass extra information to your custom holiday matchers.

```javascript
import { DateTime } from 'luxon-business-days';

/**
 * @param {DateTime} - An instance of DateTime.
 * @param {string} region - An example extra param.
 * @param {Object} someStuff - An example extra param.
 * @returns {boolean}
 */
const someCustomRegionalMatcher = (inst, region, someStuff) => {
  // does some matching based on region and data in someStuff
}

/**
 * @param {DateTime} - An instance of DateTime.
 * @returns {boolean}
 */
const anotherCustomMatcher = inst => {
  // does some matching, but doesn't need additional info
}

let dt = DateTime.local();
const myHolidays = [
  someCustomRegionalMatcher,
  anotherCustomMatcher,
];

dt.setupBusiness({ holidayMatchers: myHolidays });

// Pass any additional argument to all your matchers
dt.isHoliday('middle-america', {some: 'stuff'});
```

## Examples

* [Display a range of delivery dates for a shipment](https://codesandbox.io/s/luxon-business-days-range-example-tmb1d).
* [Add custom holiday matchers to extend a holiday](https://codesandbox.io/s/luxon-business-days-holiday-ovveride-example-b18v5i)

## API

## Members

<dl>
<dt><a href="#DateTime">DateTime</a> ⇐ <code><a href="#DateTime">DateTime</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getEasterMonthAndDay">getEasterMonthAndDay(year)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Returns the month and day of Easter for a given year.</p>
</dd>
</dl>

<a name="DateTime"></a>

## DateTime ⇐ [<code>DateTime</code>](#DateTime)
**Kind**: global variable  
**Extends**: [<code>DateTime</code>](#DateTime)  

* [DateTime](#DateTime) ⇐ [<code>DateTime</code>](#DateTime)
    * [.availableHolidayMatchers](#DateTime+availableHolidayMatchers) : <code>Object</code>
    * [.availableHolidayHelpers](#DateTime+availableHolidayHelpers) : <code>Object</code>
    * [.setupBusiness([businessDays], [holidayMatchers])](#DateTime+setupBusiness) ⇐ [<code>DateTime</code>](#DateTime)
    * [.clearBusinessSetup()](#DateTime+clearBusinessSetup) ⇐ [<code>DateTime</code>](#DateTime)
    * [.isHoliday([...args])](#DateTime+isHoliday) ⇒ <code>boolean</code>
    * [.isBusinessDay()](#DateTime+isBusinessDay) ⇒ <code>boolean</code>
    * [.plusBusiness([days])](#DateTime+plusBusiness) ⇒ [<code>DateTime</code>](#DateTime)
    * [.minusBusiness([days])](#DateTime+minusBusiness) ⇒ [<code>DateTime</code>](#DateTime)

<a name="DateTime+availableHolidayMatchers"></a>

### dateTime.availableHolidayMatchers : <code>Object</code>
All built-in holiday matchers.

**Kind**: instance property of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isNewYearsDay | <code>function</code> | A provided holiday matcher. |
| isMLKDay | <code>function</code> | A provided holiday matcher. |
| isEasterDay | <code>function</code> | A provided holiday matcher. |
| isMemorialDay | <code>function</code> | A provided holiday matcher. |
| isIndependanceDay | <code>function</code> | A provided holiday matcher. |
| isLaborDay | <code>function</code> | A provided holiday matcher. |
| isColumbusDay | <code>function</code> | A provided holiday matcher. |
| isThanksgivingDay | <code>function</code> | A provided holiday matcher. |
| isChristmasDay | <code>function</code> | A provided holiday matcher. |

<a name="DateTime+availableHolidayHelpers"></a>

### dateTime.availableHolidayHelpers : <code>Object</code>
Exposes all available holiday helpers to a DateTime instance.

**Kind**: instance property of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| getEasterMonthAndDay | <code>function</code> | A provided holiday helper function that can be helpful for custom holiday matchers. |

<a name="DateTime+setupBusiness"></a>

### dateTime.setupBusiness([businessDays], [holidayMatchers]) ⇐ [<code>DateTime</code>](#DateTime)
Sets up business days and holiday matchers globally for all DateTime instances.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [businessDays] | <code>Array.&lt;number&gt;</code> | <code>DEFAULT_BUSINESS_DAYS</code> | The working business days for the business. |
| [holidayMatchers] | <code>Array.&lt;function()&gt;</code> | <code>DEFAULT_HOLIDAY_MATCHERS</code> | The holiday matchers used to check if a particular day is a holiday for the business. |

<a name="DateTime+clearBusinessSetup"></a>

### dateTime.clearBusinessSetup() ⇐ [<code>DateTime</code>](#DateTime)
Clears business setup globally from all DateTime instances.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  
<a name="DateTime+isHoliday"></a>

### dateTime.isHoliday([...args]) ⇒ <code>boolean</code>
Checks if DateTime instance is a holiday by checking against all holiday matchers.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  

| Param | Type | Description |
| --- | --- | --- |
| [...args] | <code>\*</code> | Any additional arguments to pass through to each holiday matcher. |

<a name="DateTime+isBusinessDay"></a>

### dateTime.isBusinessDay() ⇒ <code>boolean</code>
Checks if DateTime instance is a business day.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  
<a name="DateTime+plusBusiness"></a>

### dateTime.plusBusiness([days]) ⇒ [<code>DateTime</code>](#DateTime)
Adds business days to an existing DateTime instance.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [days] | <code>number</code> | <code>1</code> | The number of business days to add. |

<a name="DateTime+minusBusiness"></a>

### dateTime.minusBusiness([days]) ⇒ [<code>DateTime</code>](#DateTime)
Subtracts business days to an existing DateTime instance.

**Kind**: instance method of [<code>DateTime</code>](#DateTime)  
**Extends**: [<code>DateTime</code>](#DateTime)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [days] | <code>number</code> | <code>1</code> | The number of business days to subtract. |

<a name="getEasterMonthAndDay"></a>

## getEasterMonthAndDay(year) ⇒ <code>Array.&lt;number&gt;</code>
Returns the month and day of Easter for a given year.

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - Returns month and day via `[month, day]`.  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 

