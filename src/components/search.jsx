import memoize from "memoize-one";
import { connectForm } from "@/elements/baseForm";
import styles from "./search.scss";
import { InsideDropdown } from "@/elements/inputs/dropdown";
import Store from "@/helpers/store";
import { DateToString } from "@/helpers/jsExtend";

function _filterOptions(filterValue) {
  if (!filterValue || filterValue.length < 2) {
    return [];
  }

  const cl = Store.classes.items;
  const val = filterValue.toLowerCase();
  const getClass = learner => {
    const clas = cl.find(c => c.id === learner.classId);
    if (clas) {
      return clas.name;
    }
    if (learner.removed) {
      return "Выбыл";
    }
    return "--";
  };
  const arr1 = Store.learners.items
    .filter(l =>
      Object.keys(l).some(k => {
        let v = l[k];
        if (!v) {
          return false;
        }

        if (v instanceof Date) {
          v = DateToString(v);
        } else {
          v = v.toString();
        }

        return v.toLowerCase().includes(val);
      })
    )
    .map(v => ({
      value: `l${v.id}`,
      text: `${getClass(v)} ${v.name} ${DateToString(v.dob)}`,
      raw: v,
    }));

  const arr2 = Store.teachers.items
    .filter(v =>
      Object.keys(v).some(
        k => v[k] && v[k].toString().toLowerCase().includes(val)
      )
    )
    .map(v => ({
      value: `t${v.id}`,
      text: `${v.post || "Персонал"} ${v.name}`,
      raw: v,
      isPersonal: true,
    }));
  return arr1.concat(...arr2);
}

export class InsideSearch extends InsideDropdown {
  constructor(props) {
    super(props);
    this.filterOptions = memoize(_filterOptions);
  }

  handleMenuClick = e => {
    const { id } = e.target.dataset;
    const v = this.options[id];
    if (v.isPersonal) {
      Store.selectPersonal();
    } else {
      Store.selectLearners();
      setTimeout(() => Store.selectClass(v.raw.classId), 100);
    }
    setTimeout(() => Store.selectPerson(v.raw), 200);
    this.onClose(undefined);
  };

  get options() {
    return this.filterOptions(this.userInputValue);
  }

  get btnOpenClassName() {
    return styles.btnOpen;
  }

  get controlClassName() {
    return styles.search;
  }
}

const Search = connectForm(InsideSearch);
export default Search;
