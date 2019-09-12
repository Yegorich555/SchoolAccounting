import withClickOutside from "react-click-outside";
import memoize from "memoize-one";
import { connectForm } from "@/elements/baseForm";
import BasicInput, { getPlaceholder } from "./basicInput";
import styles from "./dropdown.scss";

class InsideDropdown extends BasicInput {
  static isEmpty = v => v === undefined;

  static get initValue() {
    return undefined;
  }

  constructor(props) {
    super(props);
    this.state.isOpen = false;
    this.state.userInputValue = "";
  }

  onClose = () => {
    this.setState({ isOpen: false }, () => {
      super.handleBlur(this.currentValue);
    });
  };

  handleClickOutside() {
    if (this.state.isOpen) {
      this.onClose();
    }
  }

  toggleOpen = () => {
    if (this.state.isOpen) {
      this.onClose();
    } else {
      this.setState({ isOpen: true, userInputValue: "" });
    }
  };

  handleMenuClick = e => {
    e.preventDefault();
    const { id } = e.target.dataset;
    if (id) {
      this.setState({ userInputValue: "" });
      super.handleChange(this.props.options[id].value, e);
    }
    this.toggleOpen();
  };

  handleInputClick = () => {
    const { isOpen } = this.state;
    if (!isOpen) this.setState({ isOpen: true });
  };

  handleInputChange = e => {
    const { value } = e.target;
    this.setState({ userInputValue: value, isOpen: true });
  };

  handleInputBlur = () => {
    if (this.state.userInputValue !== "") {
      const option = this.options[0];
      super.handleChange(option && option.value);
    }
    this.state.userInputValue = "";
  };

  renderMenu = (options, currentOption) => {
    // TODO: scroll to current
    return (
      <ul
        className={styles.menu}
        role="listbox"
        onClick={this.handleMenuClick}
        onKeyDown={this.handleMenuKeydown}
        tabIndex={-1}
      >
        {(options &&
          options.length &&
          options.map((v, i) => (
            <li
              key={v.value} // TODO: improve generating of this
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
  };

  // eslint-disable-next-line class-methods-use-this
  get controlClassName() {
    // TODO set static
    return styles.control;
  }

  get options() {
    // filter according to text in input
    return memoize((arr, filterValue) => {
      if (!filterValue) {
        return arr;
      }
      const val = filterValue.toLowerCase();
      return arr.filter(
        v => v && v.text && v.text.toLowerCase().startsWith(val)
      );
    }).call(this, this.props.options, this.state.userInputValue);
  }

  renderInput(id, _labelId, value) {
    let currentText = this.state.userInputValue;
    let currentOption;
    if (currentText === "") {
      currentOption = this.options.find(a => a.value === value);
      currentText = currentOption != null ? currentOption.text : "";
    } else if (currentOption === undefined) {
      [currentOption] = this.options;
    }

    return (
      <>
        <input
          ref={ref => {
            this.refInput = ref;
          }}
          id={id}
          type="text"
          placeholder={getPlaceholder(this.props)}
          value={currentText}
          onChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
          onClick={this.handleInputClick}
          autoComplete="off"
          // TODO: disabled={this.props.disabled}
        />
        );
        <button
          className={styles.btnOpen}
          type="button"
          onClick={this.toggleOpen}
          aria-expanded={this.state.isOpen}
        />
        {/* TODO: maybe portal for overriding? */}
        {this.state.isOpen
          ? this.renderMenu(this.options, currentOption)
          : null}
      </>
    );
  }
}

const Dropdown = connectForm(withClickOutside(InsideDropdown));
export default Dropdown;
