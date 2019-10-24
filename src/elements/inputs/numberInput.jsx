import memoize from "memoize-one";
import DropdownBasic from "./dropdownBasic";
import { connectForm } from "@/elements/baseForm";
import styles from "./numberInput.scss";

const isFloatReg = /^\d+([.,]\d*)?$/;
const separatorReplacement = /[,. ]/g;
const separator = ".";

function toString(v) {
  return typeof v === "number" ? v.toString() : v;
}

class InsideNumberInput extends DropdownBasic {
  static isEmpty = v => v == null || v === "";

  static get initValue() {
    return "";
  }

  static get defaultValidations() {
    return Object.assign(DropdownBasic.defaultValidations, {
      isNumber: v => /^\d+$/.test(v) || "Please provide a numeric value",
      length: (v, setV) =>
        toString(v).length === setV || `Length must be ${setV} digits`,
      minLength: (v, setV) =>
        toString(v).length >= setV ||
        `Please provide at least ${setV} digits`,
      maxLength: (v, setV) =>
        toString(v).length <= setV || `Max length is ${setV} digits`
    });
  }

  handleInputBlur = e => {
    super.handleBlur(e.target.value, e);
  };

  handleInputChange(e) {
    super.handleChange(e.target.value, e);
  }

  provideValueCallback() {
    return this.parseInputValue(super.provideValueCallback());
  }

  parseInputValue = value => {
    const isString = typeof value === "string";
    const v = isString ? value.trim() : value;
    if (isString && v) {
      const parseFunction =
        this.isFloat && isFloatReg.test(v)
          ? Number.parseFloat
          : Number.parseInt;

      const result = parseFunction(v, 10);
      if (!Number.isNaN(result)) {
        return result;
      }
    }
    return v || undefined;
  };

  get btnOpenClassName() {
    return styles.btnOpen;
  }

  get btnOpenProps() {
    return { disabled: true, "aria-haspopup": false, onClick: null };
  }

  get validationProps() {
    const defValidations = { isNumber: true };

    const lengthSet = this.lengthRestrictions;

    if (lengthSet) {
      if (lengthSet.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        defValidations.maxLength = lengthSet[0];
      } else {
        defValidations.isNumber = false;

        defValidations.isLengthSet = v => {
          const isBroken = v.split(separatorReplacement).find((txt, i) => {
            return !lengthSet[i] || txt.length > lengthSet[i];
          });
          return isBroken ? this.errFormatMessage : true;
        };
      }
    }

    return Object.assign(defValidations, this.props.validations);
  }

  get lengthRestrictions() {
    const { maskLength } = this.props;

    return memoize(mask => {
      if (mask) {
        return mask
          .split(separator)
          .map(s => Number.parseInt(s, 10))
          .filter(v => v);
      }
      return null;
    }).call(this, maskLength);
  }

  get errFormatMessage() {
    const lengthSet = this.lengthRestrictions;
    if (lengthSet && lengthSet.length > 1) {
      return `${"Expected format")}: ${lngthSet
        .map(length => "#".repeat(length))
        .join(separator)}`;
    }
    return null;
  }

  get placeholder() {
    return this.props.placeholder || this.errFormatMessage || super.placeholder;
  }

  get isFloat() {
    if (this.props.isFloat) {
      return true;
    }
    const lengthSet = this.lengthRestrictions;
    if (lengthSet && this.lengthRestrictions.length === 2) {
      return true;
    }
    return false;
  }

  getInputText(value, userInputValue) {
    if (userInputValue != null && this.isFloat) {
      return userInputValue
        .replace(separatorReplacement, separator)
        .replace(new RegExp(`${separator}+`, "g"), separator);
    }
    return userInputValue || value;
  }

  renderMenu() {
    return undefined;
  }
}

const NumberInput = connectForm(InsideNumberInput);
export default NumberInput;
