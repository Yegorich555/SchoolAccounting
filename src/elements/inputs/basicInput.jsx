import { Component } from "react";
import { get as lodashGet } from "lodash";
import styles from "./basicInput.scss";

import UnifyValidations from "./unifyValidations";

const vowelRegex = /^[aieouAIEOU].*/;
export function getPlaceholder({ placeholder, label }) {
  if (placeholder) {
    return placeholder;
  }
  if (placeholder === "" || !label || typeof label !== "string") return "";
  return `Please provide a${vowelRegex.test(label) ? "n" : ""} ${label}`;
}

export default class BasicInput extends Component {
  static isEmpty = v => v == null;

  static get defaultValidations() {
    return {
      required: v => !this.isEmpty(v) || "This field is required"
    };
  }

  static get initValue() {
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value:
        this.defaultValue !== undefined
          ? this.defaultValue
          : this.constructor.initValue,
      isValid: true
    };
    this.provideValueCallback = this.provideValueCallback.bind(this); // Such bind is important for inheritance and using super...():

    this.props.provideValue &&
      this.props.provideValue(this.provideValueCallback);
    this.props.resetValue &&
      this.props.resetValue(() => {
        this.setState({ value: this.constructor.initValue });
      });
    this.props.validate &&
      this.props.validate(() => this.validate(this.state.value));
    this.renderInput = this.renderInput.bind(this); // Such bind is important for inheritance and using super...(): https://stackoverflow.com/questions/46869503/es6-arrow-functions-trigger-super-outside-of-function-or-class-error
  }

  get defaultValue() {
    const { name, defaultModel, defaultValue } = this.props;
    if (name && defaultModel) {
      return lodashGet(defaultModel, name);
    }
    return defaultValue;
  }

  get hasRequired() {
    return this.props.validations && this.props.validations.required;
  }

  get currentValue() {
    return this.state.value;
  }

  get validationProps() {
    return this.props.validations;
  }

  validate = value => {
    const propsValidations = this.validationProps;
    if (!propsValidations || this.props.disableValidation) {
      return true;
    }

    const validations = UnifyValidations(
      // TODO: move to component willReceiveProps or useMemo???
      propsValidations,
      this.constructor.defaultValidations
    );

    const self = this;
    function updateError(message) {
      self.setState({
        isValid: false,
        errorMessage:
          message === "" ? null : message || "Please provide a valid value"
      });
    }

    const isValid = Object.keys(validations).every(key => {
      const validation = validations[key];
      const result =
        key === "required" || !this.constructor.isEmpty(value)
          ? validation(value)
          : true; // fire validations only if value isNotEmpty
      if (result !== true) {
        updateError(result);
        return false;
      }
      return true;
    });

    isValid && this.setState({ isValid: true });

    return isValid;
  };

  provideValueCallback() {
    const v = this.currentValue;
    return this.constructor.isEmpty(v) ? undefined : v;
  }

  handleChange(value, event, setStateCallback) {
    if (value !== this.state.value) {
      this.setState({ value }, setStateCallback);
      this.props.validateOnChange && this.validate(value);
      this.props.onChange && this.props.onChange(value, event);
    }
  }

  handleBlur(value) {
    if (value !== this.state.value) {
      this.setState({ value });
      this.validate(value);
    }
  }

  renderInput() {
    if (DEBUG) return <span>Implement input</span>;
    return null;
  }

  render() {
    const id = `${this.props.name}`;
    const labelId = `${id}label`;
    return (
      <label
        id={labelId}
        htmlFor={id}
        className={[
          styles.control,
          !this.state.isValid ? styles.isInvalid : null,
          this.props.className,
          this.controlClassName
        ]}
        onClick={this.handleLabelClick}
        {...this.controlProps}
      >
        <span
          className={
            this.hasRequired && !this.props.hideRequiredMark
              ? styles.required
              : null
          }
        >
          {this.props.label}
        </span>

        {this.props.description ? (
          <div className={styles.description}>{this.props.description}</div>
        ) : null}
        <fieldset>
          {this.renderInput && this.renderInput(id, labelId, this.state.value)}
        </fieldset>
        {!this.state.isValid &&
        this.state.errorMessage &&
        !this.props.disableValidation ? (
          <span className={styles.errorMessage}>{this.state.errorMessage}</span>
        ) : null}
      </label>
    );
  }
}
