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

  set items(v) {
    this._items = v;
    this.submit();
  }

  submit = () => {
    localStorage.setItem(this.name, CSV.stringify(this.items));
    this._items =
      tryParseJSONDate(JSON.parse(JSON.stringify(this.items))) || [];
    return this._items;
  };

  update(item) {
    arrayFunctions.update.call(this.items, v => v.id, item);
    this.submit();
    return item;
  }

  add(item) {
    // eslint-disable-next-line no-param-reassign
    item.id = nextId(this.items);
    this._items.push(item);
    this.submit();
    return item;
  }

  remove(itemOrItems) {
    let arr = [];
    if (!Array.isArray(itemOrItems)) arr.push(itemOrItems);
    else arr = itemOrItems;

    arr.forEach(item => {
      arrayFunctions.remove.call(this.items, a => a.id === item.id);
    });

    this.submit();
    return this._items;
  }
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

class DbSetClasses extends DbSet {
  constructor(store) {
    super("classes");
    this._store = store;
  }

  remove(item) {
    super.remove(item);
    const removeItems = this._store.learners.items.filter(
      v => v.classId === item.id
    );
    this._store.learners.remove(removeItems);
  }
}

class StoreInstance {
  constructor() {
    this.classes = new DbSetClasses(this);
    this.teachers = new DbSet("teachers");
    this.learners = new DbSetLearners();
  }

  set currentClassName(v) {
    localStorage.setItem("curClassPath", v);
  }

  get currentClassName() {
    return localStorage.getItem("curClassPath");
  }

  set currentPath(v) {
    localStorage.setItem("curPath", v);
  }

  get currentPath() {
    return localStorage.getItem("curPath");
  }

  toString() {
    const obj = {
      classes: this.classes.items,
      teachers: this.teachers.items,
      learners: this.learners.items,
      currentClassName: this.currentClassName,
      currentPath: this.currentPath
    };
    return JSON.stringify(obj);
  }

  parse(str) {
    const obj = tryParseJSONDate(JSON.parse(str));
    this.classes.items = obj.classes;
    this.teachers.items = obj.teachers;
    this.learners.items = obj.learners;
    this.currentClassName = obj.currentClassName;
    this.currentPath = obj.currentPath;
  }

  onUploaded(callback) {
    this._onUploaded = callback;
  }

  uploaded() {
    this._onUploaded();
  }
}

const Store = new StoreInstance();
window.myStore = Store;
export default Store;
