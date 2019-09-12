import styles from "./navBtn.scss";
import BasicBtn from "./basicBtn";

export default function NavBtn(props) {
  return (
    <BasicBtn {...props} className={[props.className, styles.btn]}>
      {props.children}
    </BasicBtn>
  );
}
