import NavBtn from "./navBtn";
import styles from "./navBackBtn.scss";

export default function NavBackBtn(props) {
  return <NavBtn {...props} className={[styles.btn, props.className]} />;
}
