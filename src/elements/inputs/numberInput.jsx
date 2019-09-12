import TextInput from "./textInput";
import UnifyValidations from "./unifyValidations";

const defaultValidations = {
  isNumber: v => /^\d+$/.test(v) || "Please provide a numeric value",
  length: (v, setV, defFn) =>
    defFn(v, setV) === true || `Length must be ${setV}-digits`, // use defFn() if you want to override just a message
  minLength: (v, setV, defFn) =>
    defFn(v, setV) === true || `Please provide at least ${setV}-digits`,
  maxLength: (v, setV, defFn) =>
    defFn(v, setV) === true || `Max length is ${setV}-digits`
};

export default function NumberInput(props) {
  const validations = UnifyValidations(
    Object.assign({ isNumber: true }, props.validations),
    defaultValidations
  );

  let inputFor;
  if (props.preventChars === true) {
    const checkDigit = char => /[^\d]/gi.test(char);
    const onPaste = e => {
      const char = (e.clipboardData || window.clipboardData).getData("Text");
      if (checkDigit(char)) {
        e.preventDefault();
      }
      // TODO maybe bug in pure function if onKeyPress is changed dynamically
      props.inputFor && props.inputFor.onPaste && props.inputFor.onPaste(e);
    };
    const onKeyPress = e => {
      const char = String.fromCharCode(e.keyCode || e.which);
      if (checkDigit(char)) {
        e.preventDefault();
      }
      // TODO maybe bug in pure function if onKeyPress is changed dynamically
      props.inputFor &&
        props.inputFor.onKeyPress &&
        props.inputFor.onKeyPress(e);
    };
    inputFor = Object.assign({}, props.inputFor, { onKeyPress, onPaste }); // TODO: props can't override default onKeyPress and onPaste
  }

  return (
    <TextInput
      validateOnChange
      {...props}
      inputFor={inputFor || props.inputFor}
      validations={validations}
    />
  );
}
