import remove from "ytech-js-extensions/lib/array/remove";
import addIfNotExists from "ytech-js-extensions/lib/array/addIfNotExists";

// since babel doesn't compile node_modules by default (for compatibility with browsers without ES6)
// eslint-disable-next-line no-extend-native
Array.prototype.find =
  // eslint-disable-next-line global-require
  Array.prototype.find || require("ytech-js-extensions/lib/array/find");

function update(getterKey, newItem) {
  const item = this.find(v => getterKey(v));
  Object.assign(item, newItem);
  return newItem;
}

const arrayFunctions = { remove, addIfNotExists, update };
export { arrayFunctions };

export function DateToString(v) {
  if (!v || !(v instanceof Date)) return v;
  const year = v.getFullYear();
  const month = v.getMonth() + 1;
  const date = v.getDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${
    date < 10 ? "0" : ""
  }${date}`;
}

function PromiseDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function for preventing ugly fast-blinking during updating states
export function PromiseWait(promiseFn, ms = 400) {
  return Promise.all([promiseFn, PromiseDelay(ms)]).then(arr => arr && arr[0]);
  // TODO: improve forceTimeout for exception-cases
}
