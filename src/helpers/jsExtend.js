import remove from "ytech-js-extensions/lib/array/remove";
import addIfNotExists from "ytech-js-extensions/lib/array/addIfNotExists";

import addDays from "ytech-js-extensions/lib/date/addDays";
import addMonths from "ytech-js-extensions/lib/date/addMonths";
import addYears from "ytech-js-extensions/lib/date/addYears";

// since babel doesn't compile node_modules by default (for compatibility with browsers without ES6)
// eslint-disable-next-line no-extend-native
Array.prototype.find =
  // eslint-disable-next-line global-require
  Array.prototype.find || require("ytech-js-extensions/lib/array/find");

function update(getterKey, newItem) {
  const prop = getterKey(newItem);
  const item = this.find(v => getterKey(v) === prop);
  Object.assign(item, newItem);
  return newItem;
}

export const arrayFunctions = { remove, addIfNotExists, update };
export const dateFunctions = { addDays, addMonths, addYears };

function twoDigits(v) {
  return (v < 10 ? "0" : "") + v;
}

export function DateToString(v) {
  if (!v || !(v instanceof Date)) return v;
  const year = v.getFullYear();
  const month = v.getMonth() + 1;
  const date = v.getDate();
  return `${twoDigits(date)}.${twoDigits(month)}.${year}`;
}
export const DateMask = "DD.MM.YYYY";

function PromiseDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function for preventing ugly fast-blinking during updating states
export function PromiseWait(promiseFn, ms = 400) {
  return Promise.all([promiseFn, PromiseDelay(ms)]).then(arr => arr && arr[0]);
  // TODO: improve forceTimeout for exception-cases
}
