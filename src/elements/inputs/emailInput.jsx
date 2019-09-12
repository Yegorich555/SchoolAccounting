import TextInput from "./textInput";

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function EmailInput(props) {
  const validations = Object.assign(
    {
      isEmail: v =>
        v === "" || EMAIL_REGEX.test(v) || "Please enter a valid email address"
    },
    props.validations
  );
  return (
    <TextInput
      {...props}
      type="email"
      name={props.name || "email"}
      label={props.label || "Email"}
      validations={validations}
    />
  );
}
