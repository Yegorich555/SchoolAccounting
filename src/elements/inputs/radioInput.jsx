import BasicInput from "./basicInput";
import { connectForm } from "@/elements/baseForm";
import styles from "./radioInput.scss";

class InsideRadioInput extends BasicInput {
  static isEmpty = v => v === undefined;

  static get initValue() {
    return undefined;
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this); // Such bind is important for inheritance and using super...(): https://stackoverflow.com/questions/46869503/es6-arrow-functions-trigger-super-outside-of-function-or-class-error
  }

  handleChange(option, e) {
    const { value } = option;
    super.handleChange(value, e);
  }

  handleKeyDown = (option, e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      // it`s enter or space
      this.handleChange(option, e);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  get controlClassName() {
    return styles.control;
  }

  renderInput(id, labelId, value) {
    const { options } = this.props;
    return (
      <div role="group" aria-labelledby={labelId} className={styles.radioGroup}>
        {options.map((v, i) => {
          const nestedId = `${id}_${i}`;
          return (
            <div
              key={nestedId}
              tabIndex="0"
              role="radio"
              aria-checked={v.value === value}
              onClick={e => this.handleChange(v, e)}
              onKeyDown={e => this.handleKeyDown(v, e)}
            >
              <div />
              {v.text}
            </div>
          );
        })}
      </div>
    );
  }
}

const RadioInput = connectForm(InsideRadioInput);
export default RadioInput;
