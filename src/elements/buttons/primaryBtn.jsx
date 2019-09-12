import styles from "./primaryBtn.scss";
import BasicBtn from "./basicBtn";

export default function PrimaryBtn(props) {
  return (
    <BasicBtn {...props} className={[props.className, styles.btn]}>
      {props.children}
    </BasicBtn>
  );
}
