import BasicInput, { getPlaceholder } from "./basicInput";
import { connectForm } from "@/elements/baseForm";

export class InsideTextInput extends BasicInput {
  static isEmpty = v => v == null || v === "";

  static get initValue() {
    return "";
  }

  static get defaultValidations() {
    return Object.assign(BasicInput.defaultValidations, {
      length: (v, setV) =>
        v.length === setV || `Length must be ${setV}-characters`,
      minLength: (v, setV) =>
        v.length >= setV || `Please provide at least ${setV}-characters`,
      maxLength: (v, setV) =>
        v.length <= setV || `Max length is ${setV}-characters`
    });
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this); // Such bind is important for inheritance and using super...(): https://stackoverflow.com/questions/46869503/es6-arrow-functions-trigger-super-outside-of-function-or-class-error
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleInputChange(e) {
    super.handleChange(e.target.value, e);
  }

  handleInputBlur(e) {
    super.handleBlur(e.target.value, e);
  }

  renderInput(_id, labelId, value) {
    const placeholder = getPlaceholder(this.props);
    return (
      <input
        onClick={this.onInputClick}
        {...this.props.inputFor}
        aria-labelledby={labelId}
        aria-required={
          this.props.validations && this.props.validations.required
        }
        aria-invalid={!this.state.isValid}
        type={this.props.type || "text"}
        name={this.props.htmlName}
        placeholder={placeholder}
        value={value}
        onChange={this.handleInputChange}
        onBlur={this.handleInputBlur}
        maxLength={this.props.maxLength || 255}
        autoComplete={this.props.autocomplete !== true ? "new-password" : null}
        disabled={this.props.disabled}
      />
    );
  }
}

const TextInput = connectForm(InsideTextInput);
export default TextInput;
