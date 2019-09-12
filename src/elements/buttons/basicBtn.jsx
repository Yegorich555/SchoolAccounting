/* eslint-disable react/button-has-type */
import styles from "./basicBtn.scss";

export default function BasicBtn(props) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className={[styles.btn, props.className]}
    >
      {props.children}
    </button>
  );
}
