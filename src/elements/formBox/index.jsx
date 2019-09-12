import styles from "./style.scss";

export default function FormBox({ children, className }) {
  return <div className={[styles.box, className]}>{children}</div>;
}
