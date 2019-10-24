import BasicInput from "./basicInput";
import { connectForm } from "@/elements/baseForm";
import styles from "./slideInput.scss";

class InsideSlideInput extends BasicInput {
  static get initValue() {
    return false;
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this); // Such bind is important for inheritance and using super...(): https://stackoverflow.com/questions/46869503/es6-arrow-functions-trigger-super-outside-of-function-or-class-error
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !this.state.value;

    if (this.props.onChanging) {
      const canBeChanged = this.props.onChanging(newValue);
      if (canBeChanged === false) {
        return;
      }
    }

    super.handleChange(newValue, e);

    this.props.onChanged && this.props.onChanged(newValue);
  }

  handleLabelClick = () => {
    this.el.focus();
  };

  handleKeyDown = e => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      // it`s enter or space
      this.toggle(e);
    }
  };

  get controlClassName() {
    return styles.control;
  }

  validate = () => true;

  renderInput(id, labelId, value) {
    return (
      <span
        ref={ref => {
          this.el = ref;
        }}
        id={id}
        aria-labelledby={labelId}
        className={styles.wrapper}
        role="checkbox"
        aria-checked={value}
        tabIndex="0"
        name={
          this.props.htmlName !== undefined
            ? this.props.htmlName
            : this.props.name
        }
        onClick={this.toggle}
        onKeyDown={this.handleKeyDown}
      >
        <span className={styles.mark} />
      </span>
    );
  }
}

const SlideInput = connectForm(InsideSlideInput);
export default SlideInput;
