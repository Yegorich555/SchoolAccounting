/* eslint-disable no-underscore-dangle */
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

class StoreClass {
  save = (name, arr) => {
    localStorage.setItem(name, CSV.stringify(arr));
    const prop = `_${name}`;
    this[prop] = JSON.parse(JSON.stringify(arr)) || [];
    return this[prop];
  };

  load = name => {
    const prop = `_${name}`;
    if (this[prop] === undefined) {
      this[prop] = CSV.parse(localStorage.getItem(name)) || [];
    }
    return this[prop];
  };

  update = (name, updateFn) => {
    const v = this.load(name);
    updateFn(v);
    return this.save(name, v);
  };

  // class functions
  get classes() {
    return this.load("classes");
  }

  set classes(v) {
    this.save("classes", v);
  }

  addClass(name) {
    const nClass = { id: nextId(this.classes), name, teacher: null };
    this.update("classes", v => v.push(nClass));
    return nClass;
  }

  removeClass(item) {
    return this.update("classes", v =>
      arrayFunctions.remove.call(v, a => a.id === item.id)
    );
  }

  updateClass(item) {
    return this.update("classes", v =>
      arrayFunctions.update.call(v, a => a.id, item)
    );
  }

  // learners functions
  get learners() {
    return this.load("learners");
  }

  set learners(v) {
    this.save("learners", v);
  }

  addLearners(items, currentClass) {
    if (currentClass) {
      items.forEach(v => {
        // eslint-disable-next-line no-param-reassign
        v.classNum = currentClass.num;
      });
    }
    return this.update("learners", v => v.push([...items]));
  }

  removeLearner(item) {
    return this.update("classes", v => arrayFunctions.remove.call(v, item));
  }
}

const Store = new StoreClass();
export default Store;
