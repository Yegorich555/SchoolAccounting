import memoize from "memoize-one";
import { connectForm } from "@/elements/baseForm";
import styles from "./search.scss";
import { InsideDropdown } from "@/elements/inputs/dropdown";

function _filterOptions(arr, filterValue) {
  if (!arr) {
    return [];
  }
  if (!filterValue) {
    return arr;
  }
  const val = filterValue.toLowerCase();
  return arr.filter(v => v && v.text && v.text.toLowerCase().startsWith(val));
}

export class InsideSearch extends InsideDropdown {
  constructor(props) {
    super(props);
    this.filterOptions = memoize(_filterOptions);
  }

  handleMenuClick = e => {
    // const { id } = e.target.dataset;
    // todo select here
  };

  get options() {
    // todo search according to text in input
    return this.filterOptions(this.propsOptions, this.userInputValue);
  }

  get btnOpenClassName() {
    return styles.btnOpen;
  }

  get controlClassName() {
    return styles.search;
  }

  renderMenu() {
    const { options } = this;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      <ul onClick={this.handleMenuClick} id={this.listBoxId}>
        {(options.length &&
          options.map((v, i, arr) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <li key={this.getMenuKey(v, i, arr)} data-id={i} tabIndex={0}>
              {v.text}
            </li>
          ))) || <li className={styles.noItems}>No Items</li>}
      </ul>
    );
  }
}

const Search = connectForm(InsideSearch);
export default Search;
