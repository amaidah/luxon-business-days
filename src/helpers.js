/*
 * Based on
 * https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
 * https://www.irt.org/articles/js052/index.htm
 */

/**
 * Returns the month and Day of Easter for a given year.
 * @method getEasterMonthAndDay
 * @param {number} year
 * @returns {Array} Returns the exact month and day via `[month, day]`.
 */
export function getEasterMonthAndDay(year) {
  var f = Math.floor,
    // Golden Number - 1
    G = year % 19,
    C = f(year / 100),
    // related to Epact
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    // number of days from 21 March to the Paschal full moon
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    // weekday for the Paschal full moon
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    // number of days from 21 March to the Sunday on or before the Paschal full moon
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  return [month, day];
}
