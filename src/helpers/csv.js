const defLineSplitter = "\r"; // or /[\r\n|\r|\n]/
const defValueSplitter = "\t"; // tab-key

function tryParseDate(value) {
  if (typeof value !== "string") return value;

  if (/^(\d{4})-(\d{2})-(\d{2})/.test(value)) {
    const v = Date.parse(value);
    if (!Number.isNaN(v)) return new Date(v);
  }

  return value;
}

function toString(v) {
  if (v === undefined) return "";
  if (!v || !(v instanceof Date)) return v;
  return v.toISOString();
}

function fromString(v) {
  if (v === "null") {
    return null;
  }
  return tryParseDate(v);
}

const CSV = {
  parse: (
    text,
    lineSplitter = defLineSplitter,
    valueSplitter = defValueSplitter
  ) => {
    if (!text) {
      return null;
    }
    const lines = text.split(lineSplitter);
    if (!lines.length) {
      return text;
    }
    const keys = lines[0].split(valueSplitter);
    const arr = new Array(lines.length - 1);
    for (let i = 1; i < lines.length; ++i) {
      const values = lines[i].split(valueSplitter);
      const obj = {};
      keys.forEach((key, k) => {
        obj[key] = fromString(values[k]);
      });
      arr[i - 1] = obj;
    }
    return arr;
  },
  stringify: (
    arr,
    lineSplitter = defLineSplitter,
    valueSplitter = defValueSplitter
  ) => {
    if (!arr || !arr.length) {
      return "";
    }

    const header = [];
    const lines = new Array(arr.length - 1);
    arr.forEach((v, i) => {
      const keys = Object.keys(v).sort((key1, key2) => {
        // sort keys because it can be different
        let i1 = header.indexOf(key1);
        if (i1 === -1) {
          i1 = header.length;
          header.push(key1);
        }
        let i2 = header.indexOf(key2);
        if (i2 === -1) {
          i2 = header.length;
          header.push(key2);
        }
        return i1 - i2;
      });

      lines[i] = "";
      const lastInd = keys.length - 1;
      for (let k = 0; k < lastInd; ++k) {
        lines[i] += toString(v[keys[k]]) + valueSplitter;
      }
      lines[i] += toString(v[keys[lastInd]]);
    });

    const line1 = header.join(valueSplitter);
    const str = line1 + lineSplitter + lines.join(lineSplitter);

    return str;
  }
};

// console.warn(
//   "test",
//   CSV.parse(
//     CSV.stringify([
//       { text: "Text1", value: "value1" },
//       { text: "Text2", value: "value2" },
//       { text: "Text3", value: null },
//       { value: null }
//     ])
//   )
// );

export default CSV;
