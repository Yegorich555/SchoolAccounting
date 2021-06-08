import styles from "./navBtn.scss";
import BasicBtn from "./basicBtn";
import WarningBtn from "./warningBtn";

export default function NavBtn(props) {
  return (
    <BasicBtn {...props} className={[props.className, styles.btn]}>
      {props.children}
    </BasicBtn>
  );
}

export function NavBtnConfirm(props) {
  return (
    <WarningBtn {...props} className={[props.className, styles.btn]}>
      {props.children}
    </WarningBtn>
  );
}
