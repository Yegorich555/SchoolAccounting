/* eslint-disable no-underscore-dangle */
import tryParseJSONDate from "ytech-js-extensions/lib/object/tryParseJSONDate";
import CSV from "./csv";
import { arrayFunctions } from "./jsExtend";

function nextId(arr) {
  if (!arr) {
    return 1;
  }
  let id = 1;
  arr.forEach(v => {
    if (v.id >= id) {
      id = v.id + 1;
    }
  });

  return id;
}

class DbSet {
  constructor(name) {
    this.name = name;
  }

  get items() {
    if (this._items === undefined) {
      this._items = CSV.parse(localStorage.getItem(this.name)) || [];
    }
    return this._items;
  }

  submit = () => {
    localStorage.setItem(this.name, CSV.stringify(this.items));
    this._items =
      tryParseJSONDate(JSON.parse(JSON.stringify(this.items))) || [];
    return this._items;
  };

  update = item => {
    arrayFunctions.update.call(this.items, v => v.id, item);
    this.submit();
    return item;
  };

  add(item) {
    // eslint-disable-next-line no-param-reassign
    item.id = nextId(this.items);
    this._items.push(item);
    this.submit();
    return item;
  }

  remove = itemOrItems => {
    let arr = [];
    if (!Array.isArray(itemOrItems)) arr.push(itemOrItems);
    else arr = itemOrItems;

    arr.forEach(item => {
      arrayFunctions.remove.call(this.items, a => a.id === item.id);
    });

    this.submit();
    return this._items;
  };
}

class DbSetLearners extends DbSet {
  constructor() {
    super("learners");
  }

  add(itemOrItems, currentClass) {
    let arr = [];
    if (!Array.isArray(itemOrItems)) arr.push(itemOrItems);
    else arr = itemOrItems;

    arr.forEach(item => {
      // eslint-disable-next-line no-param-reassign
      item.classId = currentClass.id;
      super.add(item);
    });

    this.submit();
    return this._items;
  }
}

const Store = {
  classes: new DbSet("classes"),
  teachers: new DbSet("teachers"),
  learners: new DbSetLearners(),
  set currentPath(v) {
    localStorage.setItem("curPath", v);
  },
  get currentPath() {
    return localStorage.getItem("curPath");
  }
  // addLearners(items, currentClass) {
  //   if (currentClass) {
  //     items.forEach(v => {
  //       // eslint-disable-next-line no-param-reassign
  //       v.classNum = currentClass.num;
  //     });
  //   }
  //   return this.update("learners", v => v.push([...items]));
  // }
};

export default Store;
