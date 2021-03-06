import memoize from "memoize-one";
import { connectForm } from "@/elements/baseForm";
import styles from "./dropdown.scss";
import DropdownBasic from "./dropdownBasic";

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

export class InsideDropdown extends DropdownBasic {
  constructor(props) {
    super(props);
    this.filterOptions = memoize(_filterOptions);
  }

  handleMenuClick = e => {
    const { id } = e.target.dataset;
    this.onClose(id ? this.options[id].value : undefined);
  };

  parseInputValue = value => {
    return (value && this.options[0] && this.options[0].value) || undefined; // TODO select if we have filter and this is isRequired?
  };

  get propsOptions() {
    return this.props.options;
  }

  get options() {
    // filter according to text in input
    return this.filterOptions(this.propsOptions, this.userInputValue);
  }

  get menuClassName() {
    return styles.menu;
  }

  get btnOpenClassName() {
    return styles.btnOpen;
  }

  get propsInput() {
    return {
      ...super.propsInput,
      "aria-autocomplete": "list",
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-expanded": !!this.state.isOpen,
    };
  }

  get btnOpenProps() {
    return {
      "aria-label": `${this.state.isOpen ? "Close" : "Open"} listbox`,
      "aria-haspopup": "true",
      "aria-expanded": !!this.state.isOpen,
    };
  }

  getCurrentOption = currentValue =>
    memoize((options, value) =>
      (options || []).find(a => a.value === value)
    ).call(this, this.props.options, currentValue);

  getMenuKey = (v, i, arr) => {
    if (this.props.getMenuKey) {
      return this.props.getMenuKey(v, i, arr);
    }
    return v.value;
  };

  getInputText(value, userInputValue) {
    if (userInputValue == null) {
      const currentOption = this.getCurrentOption(value);
      return currentOption != null ? currentOption.text : "";
    }
    return userInputValue;
  }

  renderMenu(value) {
    const { options } = this;
    const currentOption = this.getCurrentOption(value);
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <ul
        role="listbox"
        aria-label="Options"
        onClick={this.handleMenuClick}
        id={this.listBoxId}
      >
        {(options.length &&
          options.map((v, i, arr) => (
            <li
              key={this.getMenuKey(v, i, arr)}
              data-id={i}
              role="option"
              aria-selected={v === currentOption}
              tabIndex={0}
            >
              {v.text}
            </li>
          ))) || <li className={styles.noItems}>No Items</li>}
      </ul>
    );
  }
}

const Dropdown = connectForm(InsideDropdown);
export default Dropdown;
